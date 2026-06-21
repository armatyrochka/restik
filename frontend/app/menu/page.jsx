'use client';

import { useState, useEffect } from 'react';
import { getMenuItems } from '@/services/menu';
import MenuItem from '@/components/menu/MenuItem';
import MenuFilter from '@/components/menu/MenuFilter';
import MenuSearch from '@/components/menu/MenuSearch';

const categories = [
  { value: 'all', label: 'Всі страви' },
  { value: 'salads', label: 'Салати' },
  { value: 'main', label: 'Основні страви' },
  { value: 'sushi', label: 'Суші' },
  { value: 'desserts', label: 'Десерти' },
  { value: 'drinks', label: 'Напої' },
];

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getMenuItems();
        setItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error('Помилка завантаження:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    let filtered = items;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    }

    setFilteredItems(filtered);
  }, [items, selectedCategory, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Наше меню</h1>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <MenuFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <MenuSearch
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {loading ? (
        <div className="text-center py-12">Завантаження...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Нічого не знайдено. Спробуйте змінити пошук або фільтри.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}