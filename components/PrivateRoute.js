"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    const router = useRouter();
    const publicRoutes = ['/register']; // Defina suas rotas públicas aqui
  
    useEffect(() => {
      if (!user && !publicRoutes.includes(router.pathname)) {
        router.push('/'); // Ou a página que você deseja redirecionar
      }
    }, [user, router.pathname]);
  
    return user || publicRoutes.includes(router.pathname) ? children : null;
  };
  
  export default PrivateRoute;