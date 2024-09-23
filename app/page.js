// app/page.js
'use client'

import { useState } from 'react';
import { signIn } from '../public/utils/firebase'; 
import { useAuth } from '../contexts/AuthContext'; 
import { useRouter } from 'next/navigation'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, loading } = useAuth(); 
  const router = useRouter(); 

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await signIn(email, password);
      router.push('/home'); 
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError('Erro ao fazer login. Verifique suas credenciais.');
      router.push('/home');

    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Verificando autenticação...</div>;
  }

  if (user) {
    return null; 
    
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl mb-6">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="mb-6">
        <input
          type="email"
          placeholder="E-mail"
          className="border p-2 mr-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="border p-2 mr-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">
          Entrar
        </button>
      </form>
      <p>Não tem uma conta? <a href="/register" className="text-blue-500">Registre-se</a></p>
    </div>
  );
}
