'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { register as registerUser } from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z.object({
  name: z.string().min(2, 'Ім\'я має бути не менше 2 символів'),
  email: z.string().email('Неправильний формат email'),
  password: z.string().min(6, 'Пароль має бути не менше 6 символів'),
  confirmPassword: z.string().min(6, 'Підтвердіть пароль'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Паролі не співпадають',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const { setUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const response = await registerUser(data.name, data.email, data.password);
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      // ПРИМУСОВЕ ПЕРЕЗАВАНТАЖЕННЯ
      window.location.href = '/';
      
    } catch (err) {
      setError(err.message || 'Реєстрація не вдалася');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Реєстрація</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Ім'я *</label>
            <input
              {...register('name')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
              placeholder="Іван Петренко"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Пароль *</label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
              placeholder="Мінімум 6 символів"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Підтвердіть пароль *</label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
              placeholder="Повторіть пароль"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center disabled:opacity-50"
          >
            {loading ? 'Реєстрація...' : 'Зареєструватися'}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Вже маєте акаунт?{' '}
          <Link href="/auth/login" className="text-red-600 hover:underline">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}