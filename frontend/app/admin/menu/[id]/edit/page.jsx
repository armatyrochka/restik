import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getMenuItem, updateMenuItem } from '../../../../services/menu';
import MenuForm from '../../../../components/admin/MenuForm';

export default function EditMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getMenuItem(id);
        setInitialData(data);
      } catch (error) {
        console.error('Помилка:', error);
        router.push('/admin/menu');
      }
    };
    fetchItem();
  }, [id, router]);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await updateMenuItem(id, data);
      router.push('/admin/menu');
    } catch (error) {
      console.error('Помилка:', error);
      alert('Не удалось обновить страницу');
    }
    setLoading(false);
  };

  if (!initialData) {
    return (
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Редагувати страву</h1>
        <div className="max-w-2xl">
          <MenuForm
            onSubmit={handleSubmit}
            loading={loading}
            initialData={initialData}
          />
        </div>
      </div>
    );
  }
}

// 🔥 ИСПРАВЛЕННАЯ ВЕРСИЯ:
export async function generateStaticParams() {
  try {
    const response = await fetch('https://restik.onrender.com/api/menu');
    const items = await response.json();
    return items.map((item) => ({
      id: String(item.id),
    }));
  } catch (error) {
    return [];
  }
}