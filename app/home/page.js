'use client';

import PrivateRoute from '@/components/PrivateRoute';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { addTaskToFirestore, getTasksFromFirestore } from '../../public/utils/firebase';
import { addTask, getTasks } from '../../public/utils/indexedDb';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [completed, setCompleted] = useState(false);

  const loadTasks = async () => {
    try {
      const tasksFromDB = await getTasks(); 

      if (navigator.onLine) {
        const tasksFromFirestore = await getTasksFromFirestore(); 

        const tasksMap = new Map();
        tasksFromDB.forEach(task => tasksMap.set(task.id, task));
        tasksFromFirestore.forEach(task => tasksMap.set(task.id, task));

        const mergedTasks = Array.from(tasksMap.values());

        await Promise.all(
          mergedTasks.map(async (task) => {
            try {
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
    loadTasks(); 
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();

    const newTask = { id: Date.now(), title, time, date, completed };

    try {
      await addTaskToFirestore(newTask); 
      await addTask(newTask); 
      loadTasks(); 
    } catch (error) {
      console.error('Erro ao adicionar nova tarefa:', error);
    }

    setTitle('');
    setTime('');
    setDate('');
    setCompleted(false);
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  const groupByDate = (tasks) => {
    const grouped = tasks.reduce((groups, task) => {
      const date = task.date >= today ? task.date : 'passadas';
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
      return groups;
    }, {});

    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => (a.time > b.time ? 1 : -1));
    });

    return grouped;
  };

  const groupedTasks = groupByDate(tasks);

  return (
    <PrivateRoute>
      <div className="container mx-auto min-h-screen p-6">
        <h1 className="text-3xl mb-6">Minhas Tarefas Diárias</h1>
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
            type="time"
            className="border p-2 mr-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <input
            type="date"
            className="border p-2 mr-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
              {date === today ? 'Hoje' : format(new Date(date), 'dd/MM/yyyy')}
            </h3>
            <ul>
              {groupedTasks[date].map((task) => (
                <li key={task.id} className="border p-4 mb-2 flex justify-between items-center">
                  <span>
                    {task.title} às {task.time} -{' '}
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
              className="border p-4 mb-2 flex justify-between items-center text-gray-400 bg-gray-100"
            >
              <span>
                {task.title} às {task.time} em {format(new Date(task.date), 'dd/MM/yyyy')} -{' '}
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
