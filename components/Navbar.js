'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { logout } from 'public/utils/firebase'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOutUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo ou Nome do App */}
        <div className="text-2xl font-bold">
          <Link href="/home">My Tasks App</Link>
        </div>

        {/* Menu Normal */}
        <div className="hidden md:flex space-x-6">
          {user && (
            <>
              <Link href="/home" className="hover:text-gray-300">Home</Link>
              <Link href="/profile" className="hover:text-gray-300">Profile</Link>
            </>
          )}
          {user ? (
            <button onClick={handleLogout} className="hover:text-gray-300">
              Logout
            </button>
          ) : (
            <Link href="/" className="hover:text-gray-300">Login</Link>
          )}
        </div>

        {/* Menu Hambúrguer (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown Menu para Mobile */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2">
          {user && (
            <>
              <Link href="/home" onClick={closeMenu} className="block px-2 py-1 hover:bg-blue-400">Home</Link>
              <Link href="/profile" onClick={closeMenu} className="block px-2 py-1 hover:bg-blue-400">Profile</Link>
            </>
          )}
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
              className="block px-2 py-1 w-full text-left hover:bg-blue-400"
            >
              Logout
            </button>
          ) : (
            <Link href="/" onClick={closeMenu} className="block px-2 py-1 hover:bg-blue-400">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
