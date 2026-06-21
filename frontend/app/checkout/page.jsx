import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import { createOrder } from '../../../services/orders';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Им\'я має бути не менше 2 символів'),
  phone: z.string().min(10, 'Введіть правильний номер телефону'),
  address: z.string().min(5, 'Адреса має бути не менше 5 символів'),
  comment: z.string().optional(),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user, loading } = useAuth();
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-2xl">Завантаження...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const orderData = {
        ...data,
        items: items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
      };
      await createOrder(orderData);
      clearCart();
      router.push('/orders/success');
    } catch (error) {
      console.error('Помилка створення замовлення:', error);
      alert('Не вдалося створити замовлення. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Оформлення замовлення</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ім'я</label>
              <input
                {...register('name')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Телефон</label>
              <input
                {...register('phone')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Адреса</label>
              <input
                {...register('address')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Обробка...' : 'Підтвердити замовлення'}
            </button>
          </form>
        </div>
        <div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Ваше замовлення</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} ₴</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>Всього:</span>
                <span>{total.toFixed(2)} ₴</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}