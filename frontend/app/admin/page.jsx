'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="text-center py-12">Завантаження...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Адмін панель</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/menu" className="card p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🍽️</div>
            <div>
              <h2 className="text-xl font-semibold">Управління меню</h2>
              <p className="text-gray-600">Додавання, редагування та видалення страв</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/orders" className="card p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📋</div>
            <div>
              <h2 className="text-xl font-semibold">Управління замовленнями</h2>
              <p className="text-gray-600">Перегляд та зміна статусу замовлень</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}