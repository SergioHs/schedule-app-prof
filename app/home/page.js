// app/home/page.js
'use client';

import PrivateRoute from '@/components/PrivateRoute';
import { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';

export default function Home() {
  const { tasks, addNewTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    const newTask = { id: Date.now(), title, time, completed: false };
    addNewTask(newTask);
    setTitle('');
    setTime('');
  };

  return (
    <PrivateRoute>
      <div className='min-h-screen p-6'>
        <h1 className='text-3xl mb-6'>Minhas Tarefas Diárias</h1>
        <form onSubmit={handleAddTask} className='mb-6'>
          <input
            type='text'
            placeholder='Título'
            className='border p-2 mr-2'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type='time'
            className='border p-2 mr-2'
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <button className='bg-blue-500 text-white p-2 rounded' type='submit'>
            Adicionar Tarefa
          </button>
        </form>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className='border p-4 mb-2 flex justify-between items-center'>
              <span>{task.title} às {task.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </PrivateRoute>
  );
}
