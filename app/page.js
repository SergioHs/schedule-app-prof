// app/page.js
'use client'

import { useState } from 'react';
import { signIn } from '../public/utils/firebase'; // Ajuste o caminho conforme necessário
import { auth } from '../public/utils/firebase'; // Ajuste o caminho conforme a estrutura do projeto
import { useRouter } from 'next/navigation'; // Atualize o caminho conforme necessário

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Adicione isso para usar o router


  const handleLogin = async (event) => {
    event.preventDefault();

    try {
        await signIn(email, password);
        router.push('/home'); // Redireciona para a página /home após login
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        // Lógica para lidar com erros (mostrar mensagem de erro, etc.)
    }
};

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
