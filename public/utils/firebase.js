import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const addTaskToFirestore = async (task) => {
    try {
        const docRef = await addDoc(collection(db, "tasks"), task);
        console.log('Documento escrito com sucesso: ', docRef.id);
    } catch (error) {
        console.error("Erro ao adicionar o documento:", error);
    }
};

export const getTasksFromFirestore = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'tasks'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Erro ao obter tarefas do Firestore:", error);
        return [];
    }
};