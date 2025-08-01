
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickCount >= 4) {
      setShowAdminInput(true);
      setClickCount(0);
    }
    
    // Reset after 3 seconds of no clicks
    setTimeout(() => {
      if (clickCount < 5) {
        setClickCount(0);
      }
    }, 3000);
  };

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminCode === '1098648820') {
      setShowAdminInput(false);
      setAdminCode('');
      setCodeError('');
      router.push('/admin');
    } else {
      setCodeError('Código incorrecto');
      setAdminCode('');
    }
  };

  const closeAdminModal = () => {
    setShowAdminInput(false);
    setAdminCode('');
    setCodeError('');
    setClickCount(0);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-black/95 backdrop-blur-md shadow-2xl border-b border-amber-500/20 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <button
                onClick={handleLogoClick}
                className="text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text font-bold text-xl font-['Pacifico'] hover:scale-105 transition-transform focus:outline-none"
              >
                VitalMente
              </button>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50"></div>
              <span className="text-slate-300 text-xs font-medium">IA Activa</span>
            </Link>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  className="w-8 h-8 bg-slate-800/60 border border-slate-600 rounded-full flex items-center justify-center hover:bg-slate-700/60 transition-colors backdrop-blur-sm"
                >
                  <i className="ri-notification-3-line text-slate-300 text-lg"></i>
                </button>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <span className="text-xs font-bold text-white">2</span>
                </div>

                {/* Dropdown de Notificaciones */}
                {showNotifications && (
                  <div className="absolute right-0 top-10 w-64 bg-slate-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-slate-700 z-50">
                    <div className="p-3 border-b border-slate-700">
                      <h3 className="font-semibold text-white text-sm">Notificaciones</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-3 hover:bg-slate-800/50 border-b border-slate-800 cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <i className="ri-brain-line text-white text-sm"></i>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">Análisis IA Completado</p>
                            <p className="text-xs text-slate-400">Tu plan nutricional ha sido actualizado</p>
                            <span className="text-xs text-slate-500">Hace 5 min</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 hover:bg-slate-800/50 cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <i className="ri-trophy-line text-white text-sm"></i>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">¡Meta Alcanzada!</p>
                            <p className="text-xs text-slate-400">Has completado tu objetivo semanal</p>
                            <span className="text-xs text-slate-500">Hace 2 horas</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-t border-slate-700">
                      <Link 
                        href="/notificaciones" 
                        className="text-xs text-amber-400 hover:text-amber-300"
                        onClick={() => setShowNotifications(false)}
                      >
                        Ver todas las notificaciones
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="w-8 h-8 bg-slate-800/60 border border-slate-600 rounded-full flex items-center justify-center hover:bg-slate-700/60 transition-colors backdrop-blur-sm"
                >
                  <i className="ri-user-line text-slate-300 text-lg"></i>
                </button>

                {/* Dropdown de Perfil */}
                {showProfile && (
                  <div className="absolute right-0 top-10 w-56 bg-slate-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-slate-700 z-50">
                    <div className="p-4 border-b border-slate-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                          <span className="text-white font-bold text-sm">U</span>
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">Usuario VitalMente</p>
                          <p className="text-xs text-amber-400">Plan Premium</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/perfil"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white"
                      >
                        <i className="ri-user-settings-line mr-3 text-slate-500"></i>
                        Mi Perfil
                      </Link>
                      <Link
                        href="/suscripcion"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white"
                      >
                        <i className="ri-vip-crown-line mr-3 text-amber-500"></i>
                        Suscripción
                      </Link>
                      <Link
                        href="/configuracion"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white"
                      >
                        <i className="ri-settings-3-line mr-3 text-slate-500"></i>
                        Configuración
                      </Link>
                    </div>
                    <div className="py-2 border-t border-slate-700">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-rose-400 hover:bg-slate-800/50 hover:text-rose-300">
                        <i className="ri-logout-circle-line mr-3"></i>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-lg shadow-amber-500/20"></div>
      </header>

      {/* Overlay para cerrar dropdowns */}
      {(showNotifications || showProfile) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        ></div>
      )}

      {/* Modal de Acceso Admin */}
      {showAdminInput && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
          <div className="bg-slate-900/95 backdrop-blur-md rounded-xl p-6 w-80 mx-4 shadow-2xl border border-slate-700">
            <div className="text-center mb-4">
              <i className="ri-admin-line text-amber-500 text-3xl mb-2"></i>
              <h3 className="text-lg font-bold text-white">Acceso Administrativo</h3>
              <p className="text-sm text-slate-400">Ingresa el código de acceso</p>
            </div>

            <form onSubmit={handleAdminAccess} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => {
                    setAdminCode(e.target.value);
                    setCodeError('');
                  }}
                  placeholder="Código de 10 dígitos"
                  className="w-full px-4 py-3 border border-slate-600 rounded-lg text-center text-lg font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-800/80 text-white placeholder-slate-500 backdrop-blur-sm"
                  maxLength={10}
                  autoFocus
                />
                {codeError && (
                  <p className="text-rose-400 text-sm mt-2 text-center">{codeError}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeAdminModal}
                  className="flex-1 py-3 bg-slate-700 text-slate-300 rounded-lg font-medium !rounded-button hover:bg-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-medium !rounded-button hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-500/25"
                >
                  Acceder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}