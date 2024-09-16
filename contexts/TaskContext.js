'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { addTask, getTasks } from '../public/utils/indexedDb';
import { addTaskToFirestore, getTasksFromFirestore } from '../public/utils/firebase';

const TaskContext = createContext();

export const useTaskContext = () => {
    return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    const loadTasks = async () => {
        try {
            const tasksFromDB = await getTasks();
            
            if (navigator.onLine) {
                const tasksFromFirestore = await getTasksFromFirestore();

                const tasksMap = new Map();
                tasksFromDB.forEach(task => tasksMap.set(task.id, task));
                tasksFromFirestore.forEach(task => tasksMap.set(task.id, task));

                const mergedTasks = Array.from(tasksMap.values());

                await Promise.all(mergedTasks.map(async (task) => {
                    try {
                        await addTask(task);
                    } catch (error) {
                        console.error('Erro ao adicionar tarefa durante a sincronização:', error);
                    }
                }));

                setTasks(mergedTasks);
            } else {
                setTasks(tasksFromDB);
            }
        } catch (error) {
            console.error("Erro ao carregar e mesclar tarefas:", error);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const addNewTask = async (task) => {
        try {
            if (navigator.onLine) {
                await addTaskToFirestore(task);
            }
            await addTask(task); 
            await loadTasks();
        } catch (error) {
            console.error("Erro ao adicionar nova tarefa:", error);
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, addNewTask }}>
            {children}
        </TaskContext.Provider>
    );
};
