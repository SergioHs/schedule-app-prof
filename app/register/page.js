'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '../../public/utils/firebase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true); 
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const user = await signUp(email, password, name);
      console.log('Usuário registrado com sucesso:', user);

      router.push('/home');
    } catch (error) {
      setError('Erro ao registrar o usuário: ' + error.message);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordMatch(value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(value === password);
  };

  return (
    <div className='min-h-screen p-6'>
      <h1 className='text-3xl mb-6'>Registrar</h1>
      <form onSubmit={handleRegister} className='space-y-4'>
        <input
          type='text'
          placeholder='Nome'
          className='border p-2 w-full'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type='email'
          placeholder='Email'
          className='border p-2 w-full'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Senha'
          className={`border p-2 w-full ${passwordMatch ? 'border-green-500' : 'border-red-500'}`}
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <input
          type='password'
          placeholder='Confirme a Senha'
          className={`border p-2 w-full ${passwordMatch ? 'border-green-500' : 'border-red-500'}`}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        <button
          type='submit'
          className={`bg-blue-500 text-white p-2 rounded ${passwordMatch ? '' : 'opacity-50 cursor-not-allowed'}`}
          disabled={!passwordMatch}
        >
          Registrar
        </button>
      </form>
      {error && <p className='text-red-500 mt-4'>{error}</p>}
    </div>
  );
};

export default Register;
