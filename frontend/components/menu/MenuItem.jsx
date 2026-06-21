'use client';

import { useCart } from '@/hooks/useCart';

export default function MenuItem({ item }) {
  const { addItem } = useCart();

  const categoryLabels = {
    salads: 'Салати',
    main: 'Основні страви',
    sushi: 'Суші',
    desserts: 'Десерти',
    drinks: 'Напої',
  };

  const imageUrl = item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';

  const handleAddToCart = () => {
    console.log('🛒 Додаємо:', item);
    addItem(item);
  };

  return (
    <div className="card overflow-hidden">
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
          }}
        />
        <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-3 py-1 rounded-full">
          {categoryLabels[item.category] || item.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-red-600">
            ₴{item.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="btn-primary text-sm px-4 py-2"
          >
            Додати в кошик
          </button>
        </div>
      </div>
    </div>
  );
}