// app/register/page.js
'use client'

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../public/utils/firebase';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = '/home'; // Redireciona para a página Home após o registro
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl mb-6">Registrar</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleRegister} className="mb-6">
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
          Registrar
        </button>
      </form>
      <p>Já tem uma conta? <a href="/" className="text-blue-500">Faça login</a></p>
    </div>
  );
}
