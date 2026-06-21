'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { items } = useCart();
  const router = useRouter();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-red-600">🍽️</span>
            <span className="text-xl font-bold">Restaurant</span>
          </Link>

          {/* Навігація */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/menu" className="hover:text-red-400 transition-colors">
              Меню
            </Link>
            <Link href="/cart" className="relative hover:text-red-400 transition-colors">
              Кошик
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {/* Якщо є користувач - показуємо Вийти та Адмін (якщо адмін) */}
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" className="hover:text-red-400 transition-colors">
                    Адмін
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="hover:text-red-400 transition-colors"
                >
                  Вийти
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-red-400 transition-colors">
                  Увійти
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  Зареєструватися
                </Link>
              </>
            )}
          </nav>

          {/* Мобільне меню */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Мобільна навігація */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link href="/menu" className="hover:text-red-400 transition-colors">
                Меню
              </Link>
              <Link href="/cart" className="relative hover:text-red-400 transition-colors">
                Кошик
                {cartItemsCount > 0 && (
                  <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="hover:text-red-400 transition-colors">
                      Адмін
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="text-left hover:text-red-400 transition-colors"
                  >
                    Вийти
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="hover:text-red-400 transition-colors">
                    Увійти
                  </Link>
                  <Link href="/auth/register" className="btn-primary inline-block text-center">
                    Зареєструватися
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}