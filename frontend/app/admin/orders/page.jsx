'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrders, updateOrder } from '@/services/orders';
import { useAuth } from '@/hooks/useAuth';

const statuses = {
  pending: { label: 'Нове', color: 'bg-yellow-500' },
  preparing: { label: 'Готується', color: 'bg-blue-500' },
  delivering: { label: 'Доставляється', color: 'bg-purple-500' },
  completed: { label: 'Виконано', color: 'bg-green-500' },
};

const statusOptions = [
  { value: 'pending', label: 'Нове' },
  { value: 'preparing', label: 'Готується' },
  { value: 'delivering', label: 'Доставляється' },
  { value: 'completed', label: 'Виконано' },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Помилка:', error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Помилка:', error);
      alert('Не вдалося оновити статус');
    }
  };

  if (loading || loadingOrders) {
    return <div className="text-center py-12">Завантаження...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Управління замовленнями</h1>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Немає замовлень</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <p className="text-sm text-gray-500">Замовлення #{order.id.slice(0, 8)}</p>
                  <p className="font-semibold">{order.user.name}</p>
                  <p className="text-sm text-gray-600">{order.user.email}</p>
                  <p className="text-sm text-gray-600 mt-2">{order.address}</p>
                  {order.comment && (
                    <p className="text-sm text-gray-600 mt-1 italic">"{order.comment}"</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">
                    ₴{order.totalPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString('uk-UA')}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Статус:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={`px-3 py-1 rounded-full text-white text-sm ${statuses[order.status]?.color || 'bg-gray-500'}`}>
                  {statuses[order.status]?.label || order.status}
                </div>
              </div>

              <div className="mt-4">
                <details>
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                    Показати товари
                  </summary>
                  <div className="mt-2 space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm border-b border-gray-100 py-1">
                        <span>
                          {item.menuItem.name} × {item.quantity}
                        </span>
                        <span>₴{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}