'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMenuItems } from '@/services/menu';
import MenuItem from '@/components/menu/MenuItem';

export default function HomePage() {
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await getMenuItems();
        setPopularItems(data.slice(0, 4));
      } catch (error) {
        console.error('Помилка завантаження:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-800 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Смачна їжа
              <span className="text-red-500 block">з доставкою додому</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Насолоджуйтесь найкращими стравами ресторанного рівня,
              приготованими з свіжих інгредієнтів
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/menu" className="btn-primary text-lg px-8 py-3">
                Переглянути меню
              </Link>
              <Link href="/menu" className="bg-white text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-lg">
                Замовити зараз
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920')] bg-cover bg-center"></div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Про наш ресторан</h2>
              <p className="text-gray-600 mb-4">
                Restaurant Manager - це місце, де поєднуються традиції та інновації.
                Ми готуємо страви з найсвіжіших продуктів, використовуючи секретні
                рецепти наших шеф-кухарів.
              </p>
              <p className="text-gray-600">
                Наша місія - дарувати вам незабутні гастрономічні враження
                та комфорт ресторанного сервісу вдома.
              </p>
            </div>
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
                alt="Ресторан"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Популярні страви</h2>
          {loading ? (
            <div className="text-center">Завантаження...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularItems.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}