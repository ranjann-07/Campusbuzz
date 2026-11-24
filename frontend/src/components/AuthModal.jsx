import React from 'react';
import { useApp } from '../context/AppContext';
import LoginPage from '../views/LoginPage';

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen } = useApp();

  if (!isAuthOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl overflow-y-auto">
      <LoginPage isModal={true} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
