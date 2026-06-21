'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createMenuItem } from '@/services/menu';
import MenuForm from '@/components/admin/MenuForm';

export default function NewMenuItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await createMenuItem(data);
      router.push('/admin/menu');
    } catch (error) {
      console.error('Помилка:', error);
      alert('Не вдалося створити страву');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Додати нову страву</h1>
      <div className="max-w-2xl">
        <MenuForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}