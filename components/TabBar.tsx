
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: '/', icon: 'ri-home-4-line', iconActive: 'ri-home-4-fill', label: 'Inicio' },
    { href: '/alimentacion', icon: 'ri-restaurant-line', iconActive: 'ri-restaurant-fill', label: 'Nutrición' },
    { href: '/entrenamiento', icon: 'ri-run-line', iconActive: 'ri-run-fill', label: 'Entreno' },
    { href: '/mindfulness', icon: 'ri-heart-3-line', iconActive: 'ri-heart-3-fill', label: 'Mindful' },
    { href: '/tienda', icon: 'ri-shopping-bag-3-line', iconActive: 'ri-shopping-bag-3-fill', label: 'Tienda' }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/95 via-slate-800/95 to-slate-800/90 backdrop-blur-md border-t border-amber-500/20 z-40">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-5 h-16">
          {tabs.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center px-1 py-2 transition-all duration-200 ${
                  active 
                    ? 'text-amber-400 transform scale-105' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className={`w-6 h-6 flex items-center justify-center mb-1 ${
                  active ? 'drop-shadow-lg' : ''
                }`}>
                  <i className={`${active ? tab.iconActive : tab.icon} text-lg`}></i>
                </div>
                <span className={`text-xs font-medium ${
                  active ? 'text-amber-400 font-semibold' : 'text-slate-400'
                }`}>
                  {tab.label}
                </span>
                {active && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg shadow-amber-500/50"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}