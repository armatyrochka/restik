'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { createOrder } from '@/services/orders';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Ім\'я має бути не менше 2 символів'),
  phone: z.string().min(10, 'Введіть правильний номер телефону'),
  address: z.string().min(5, 'Адреса має бути не менше 5 символів'),
  comment: z.string().optional(),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user, loading } = useAuth(); // ← ДОДАЛИ loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || '',
      phone: '',
      address: '',
      comment: '',
    },
  });

  // ПЕРЕВІРКА: чи завантажується
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-2xl">⏳ Завантаження...</div>
      </div>
    );
  }

  // ПЕРЕВІРКА: чи є користувач (ТІЛЬКИ ПІСЛЯ ЗАВАНТАЖЕННЯ!)
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  // ПЕРЕВІРКА: чи є товари в кошику
  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log('📝 Дані замовлення:', data);
      
      const orderData = {
        address: data.address,
        comment: data.comment,
        items: items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      };
      
      console.log('📦 Відправляємо:', orderData);
      
      const response = await createOrder(orderData);
      console.log('✅ Замовлення створено:', response);
      
      clearCart();
      router.push('/');
    } catch (error) {
      console.error('❌ Помилка:', error);
      alert('Не вдалося створити замовлення. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Оформлення замовлення</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ім'я *</label>
                <input
                  {...register('name')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Телефон *</label>
                <input
                  {...register('phone')}
                  placeholder="+380 XX XXX XX XX"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Адреса доставки *</label>
                <input
                  {...register('address')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Коментар</label>
                <textarea
                  {...register('comment')}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
                  placeholder="Особливі побажання..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full text-center disabled:opacity-50"
              >
                {isSubmitting ? 'Обробка...' : 'Підтвердити замовлення'}
              </button>
            </div>
          </form>
        </div>
        <div>
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Ваше замовлення</h2>
            <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 border-b border-gray-200">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm text-gray-500 ml-2">×{item.quantity}</span>
                  </div>
                  <span>₴{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Всього:</span>
              <span className="text-red-600">₴{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}