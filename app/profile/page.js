'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/PrivateRoute';

const Profile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    email: 'informação não consta',
    name: 'informação não consta',
    uid: 'informação não consta',
  });
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else {
      const { displayName, email, uid } = user;
      setUserData({
        name: displayName || 'informação não consta',
        email: email || 'informação não consta',
        uid: uid || 'informação não consta',
      });
    }
  }, [user, router]);

  return (
    <PrivateRoute>
      <div className="container mx-auto min-h-screen p-6"> 
        <h1 className="text-3xl mb-6">Perfil do Usuário</h1>
        <div className="bg-white p-4 rounded shadow-md">
          <p><strong>Nome:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>ID do Usuário:</strong> {userData.uid}</p>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default Profile;
