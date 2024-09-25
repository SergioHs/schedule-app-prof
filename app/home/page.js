'use client';

import PrivateRoute from '@/components/PrivateRoute';
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { addTaskToFirestore, getTasksFromFirestore } from '../../public/utils/firebase';
import { addTask, getTasks } from '../../public/utils/indexedDb';

const requestNotificationPermission = () => {
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        sendNotification('Notificações ativadas', 'Agora você receberá notificações.');
      }
    });
  }
};

const sendNotification = (title, body) => {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
};

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [completed, setCompleted] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine); 
  const today = format(new Date(), 'yyyy-MM-dd');

  const loadTasks = async () => {
    try {
      const tasksFromDB = await getTasks();

      if (navigator.onLine) {
        const tasksFromFirestore = await getTasksFromFirestore();

        const tasksMap = new Map();
        tasksFromDB.forEach(task => tasksMap.set(task.id, task));
        tasksFromFirestore.forEach(task => {
          const exists = tasksMap.has(task.id) || tasksMap.has(Date.now());
          if (!exists) {
            tasksMap.set(task.id, task);
          }
        });

        const mergedTasks = Array.from(tasksMap.values());
        await Promise.all(
          mergedTasks.map(async (task) => {
            try {
              if (!task.synced) {
                await addTaskToFirestore(task); 
                task.synced = true; 
              }
              await addTask(task);
            } catch (error) {
              console.error('Erro ao adicionar tarefa durante a sincronização:', error);
            }
          })
        );

        setTasks(mergedTasks);
      } else {
        setTasks(tasksFromDB);
      }
    } catch (error) {
      console.error('Erro ao carregar e mesclar tarefas:', error);
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    loadTasks();

    const handleOfflineStatus = () => {
      if (!navigator.onLine) {
        setIsOffline(true);
        sendNotification('Você está offline', 'As tarefas adicionadas serão sincronizadas quando a conexão for restaurada.');
      } else {
        setIsOffline(false);
        sendNotification('Você está online', 'A conexão foi restabelecida.');
        loadTasks(); 
      }
    };

    window.addEventListener('online', handleOfflineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    return () => {
      window.removeEventListener('online', handleOfflineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      title,
      date: new Date(dateTime).toISOString(),
      completed,
      synced: navigator.onLine,
    };

    try {
      if (navigator.onLine) {
        const tasksFromFirestore = await getTasksFromFirestore();
        const exists = tasksFromFirestore.some(task => task.title === newTask.title && task.date === newTask.date && task.completed === newTask.completed);

        if (!exists) {
          await addTaskToFirestore(newTask);
        }
      }
      await addTask(newTask);
      loadTasks();
    } catch (error) {
      console.error('Erro ao adicionar nova tarefa:', error);
    }

    setTitle('');
    setDateTime('');
    setCompleted(false);
  };

  const groupByDate = (tasks) => {
    const grouped = tasks.reduce((groups, task) => {
      const taskDate = parseISO(task.date); 
      const formattedDate = format(taskDate, 'yyyy-MM-dd'); 

      const displayDate = formattedDate >= today ? formattedDate : 'passadas';

      if (!groups[displayDate]) {
        groups[displayDate] = [];
      }
      groups[displayDate].push(task);
      return groups;
    }, {});

    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        return new Date(a.date) - new Date(b.date); 
      });
    });

    return grouped;
  };

  const groupedTasks = groupByDate(tasks);

  return (
    <PrivateRoute>
      <div className="container mx-auto min-h-screen p-6">
        <h1 className="text-3xl mb-6">Minhas Tarefas Diárias</h1>
        
        {isOffline && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            Você está offline! As tarefas serão sincronizadas quando a conexão for restaurada.
          </div>
        )}

        <form onSubmit={handleAddTask} className="mb-6">
          <input
            type="text"
            placeholder="Título"
            className="border p-2 mr-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            className="border p-2 mr-2"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />
          <label className="mr-2">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />{' '}
            Completo
          </label>
          <button className="bg-blue-500 text-white p-2 rounded" type="submit">
            Adicionar Tarefa
          </button>
        </form>

        <h2 className="text-2xl mb-4">Tarefas</h2>
        {Object.keys(groupedTasks).filter(date => date !== 'passadas').map((date) => (
          <div key={date} className="mb-6">
            <h3 className="text-xl font-bold">
              {date === today ? 'Hoje' : format(parseISO(date), 'dd/MM/yyyy')}
            </h3>
            <ul>
              {groupedTasks[date].map((task) => (
                <li key={task.id} className={`border p-4 mb-2 flex justify-between items-center ${!task.synced ? 'border-red-500' : ''}`}>
                  <span>
                    {task.title} -{' '}
                    {format(new Date(task.date), 'HH:mm')} -{' '}
                    {task.completed ? (
                      <span className="text-green-500">Concluída</span>
                    ) : (
                      <span className="text-red-500">Não Concluída</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h2 className="text-2xl mb-4">Tarefas Passadas</h2>
        <ul>
          {groupedTasks['passadas']?.map((task) => (
            <li
              key={task.id}
              className={`border p-4 mb-2 flex justify-between items-center ${!task.synced ? 'text-gray-400 bg-gray-100 border-red-500 ' : 'text-gray-400 bg-gray-100'}`}
            >
              <span>
                {task.title} -{' '}
                {format(new Date(task.date), 'HH:mm')} em {format(parseISO(task.date), 'dd/MM/yyyy')} -{' '}
                {task.completed ? (
                  <span className="text-green-500">Concluída</span>
                ) : (
                  <span className="text-red-500">Não Concluída</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </PrivateRoute>
  );
}