'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/services/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функція для завантаження користувача
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        const userData = await getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Помилка:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Завантажуємо при монтуванні
  useEffect(() => {
    fetchUser();
  }, []);

  // Функція для оновлення користувача після входу/реєстрації
  const setAuthUser = (userData) => {
    setUser(userData);
    setLoading(false);
  };

  // Вихід з системи
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false);
  };

  return { 
    user, 
    loading, 
    setUser: setAuthUser, 
    logout, 
    fetchUser 
  };
}