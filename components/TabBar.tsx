
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function TabBar() {
  const pathname = usePathname();

  const tabs = [
    {
      href: '/',
      icon: 'ri-home-line',
      activeIcon: 'ri-home-fill',
      label: 'Inicio'
    },
    {
      href: '/alimentacion',
      icon: 'ri-restaurant-line',
      activeIcon: 'ri-restaurant-fill',
      label: 'Alimentación'
    },
    {
      href: '/entrenamiento',
      icon: 'ri-run-line',
      activeIcon: 'ri-run-fill',
      label: 'Entrenar'
    },
    {
      href: '/mindfulness',
      icon: 'ri-heart-line',
      activeIcon: 'ri-heart-fill',
      label: 'Mindfulness'
    },
    {
      href: '/tienda',
      icon: 'ri-shopping-cart-line',
      activeIcon: 'ri-shopping-cart-fill',
      label: 'Tienda'
    }
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-5 h-16">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
            
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center px-2 py-1 ${
                  isActive ? 'text-emerald-600' : 'text-gray-500'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center mb-1">
                  <i className={`${isActive ? tab.activeIcon : tab.icon} text-lg`}></i>
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
