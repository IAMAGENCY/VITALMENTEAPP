
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [clickCount, setClickCount] = useState(0);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [adminError, setAdminError] = useState('');
  const router = useRouter();

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    // Mostrar modal después de 5 clics
    if (newCount >= 5) {
      setShowAdminModal(true);
      setClickCount(0);
    }
    
    // Resetear contador después de 3 segundos
    setTimeout(() => {
      if (clickCount < 5) {
        setClickCount(0);
      }
    }, 3000);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCode === '1098648820') {
      setShowAdminModal(false);
      setAdminCode('');
      setAdminError('');
      router.push('/admin');
    } else {
      setAdminError('Código incorrecto. Intenta nuevamente.');
      setAdminCode('');
    }
  };

  const handleModalClose = () => {
    setShowAdminModal(false);
    setAdminCode('');
    setAdminError('');
    setClickCount(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdminSubmit(e);
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={handleLogoClick} 
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <i className="ri-heart-pulse-line text-white"></i>
            </div>
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Pacifico, serif' }}>
              VitalMente
            </span>
          </button>
          
          <div className="flex items-center space-x-4">
            <button className="w-8 h-8 flex items-center justify-center">
              <i className="ri-notification-line text-gray-600"></i>
            </button>
            <button 
              onClick={() => router.push('/perfil')}
              className="w-8 h-8 flex items-center justify-center"
            >
              <i className="ri-user-line text-gray-600"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">🔐 Panel Maestro</h3>
              <button 
                onClick={handleModalClose}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Introduce el código de acceso administrativo
            </p>
            
            <form onSubmit={handleAdminSubmit}>
              <input
                type="password"
                placeholder="Código de acceso"
                value={adminCode}
                onChange={(e) => {
                  setAdminCode(e.target.value);
                  setAdminError('');
                }}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
                maxLength={10}
              />
              
              {adminError && (
                <div className="flex items-center space-x-2 text-red-500 text-sm mb-4">
                  <i className="ri-error-warning-line"></i>
                  <span>{adminError}</span>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors !rounded-button"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors !rounded-button"
                >
                  <i className="ri-login-box-line mr-2"></i>
                  Acceder
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                Haz 5 clics rápidos en "VitalMente" para abrir
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
