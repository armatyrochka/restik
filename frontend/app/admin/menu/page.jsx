'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getMenuItems, deleteMenuItem } from '@/services/menu';
import { useAuth } from '@/hooks/useAuth';

export default function AdminMenuPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getMenuItems();
        setItems(data);
      } catch (error) {
        console.error('Помилка:', error);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Ви впевнені, що хочете видалити цю страву?')) {
      try {
        await deleteMenuItem(id);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося видалити страву');
      }
    }
  };

  if (loading || loadingItems) {
    return <div className="text-center py-12">Завантаження...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управління меню</h1>
        <Link href="/admin/menu/new" className="btn-primary">
          + Додати страву
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Страва
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категорія
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ціна
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дії
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-200">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">₴{item.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/menu/${item.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Редагувати
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Видалити
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}