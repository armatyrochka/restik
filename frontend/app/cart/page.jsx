'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';

export default function CartPage() {
  const { items, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Ваш кошик порожній</h2>
          <p className="text-gray-600 mb-8">
            Додайте смачні страви з нашого меню та поверніться сюди для оформлення замовлення.
          </p>
          <Link href="/menu" className="btn-primary inline-block">
            Переглянути меню
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ваш кошик</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 transition-colors mt-4"
            >
              Очистити кошик
            </button>
          </div>
        </div>
        <div className="lg:col-span-1">
          <CartSummary items={items} total={total} />
        </div>
      </div>
    </div>
  );
}