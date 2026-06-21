'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function CartSummary({ items, total }) {
  const router = useRouter();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Замовлення</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Товарів:</span>
          <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Сума:</span>
          <span>₴{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>До сплати:</span>
          <span className="text-red-600">₴{total.toFixed(2)}</span>
        </div>
      </div>
      <button
        onClick={handleCheckout}
        className="btn-primary w-full text-center"
      >
        Оформити замовлення
      </button>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {!user && 'Увійдіть для оформлення замовлення'}
      </p>
    </div>
  );
}