'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const menuItemSchema = z.object({
  name: z.string().min(2, 'Назва має бути не менше 2 символів'),
  description: z.string().min(5, 'Опис має бути не менше 5 символів'),
  category: z.string().min(1, 'Виберіть категорію'),
  price: z.number().min(0.01, 'Ціна має бути більше 0'),
  imageUrl: z.string().url('Неправильний URL').optional().or(z.literal('')),
});

const categories = [
  { value: 'salads', label: 'Салати' },
  { value: 'main', label: 'Основні страви' },
  { value: 'sushi', label: 'Суші' },
  { value: 'desserts', label: 'Десерти' },
  { value: 'drinks', label: 'Напої' },
];

export default function MenuForm({ onSubmit, loading, initialData }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(menuItemSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      category: '',
      price: '',
      imageUrl: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Назва *</label>
        <input
          {...register('name')}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Опис *</label>
        <textarea
          {...register('description')}
          rows="3"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Категорія *</label>
        <select
          {...register('category')}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
        >
          <option value="">Виберіть категорію</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ціна (₴) *</label>
        <input
          {...register('price', { valueAsNumber: true })}
          type="number"
          step="0.01"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">URL зображення</label>
        <input
          {...register('imageUrl')}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-600"
        />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full text-center disabled:opacity-50"
      >
        {loading ? 'Збереження...' : initialData ? 'Оновити' : 'Створити'}
      </button>
    </form>
  );
}