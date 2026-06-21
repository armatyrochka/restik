const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const ordersRoutes = require('./routes/ordersRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Головні маршрути API
app.use('/api/auth', authRoutes);      // ← РЕЄСТРАЦІЯ ТА ВХІД
app.use('/api/menu', menuRoutes);      // ← МЕНЮ
app.use('/api/orders', ordersRoutes);  // ← ЗАМОВЛЕННЯ

// Тестовий маршрут
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Сервер працює!' });
});

// Обробка помилок
app.use((err, req, res, next) => {
  console.error('❌ Помилка:', err.stack);
  res.status(500).json({ 
    error: 'Щось пішло не так!',
    message: err.message 
  });
});

// Якщо маршрут не знайдено
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Маршрут не знайдено',
    path: req.url 
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порту ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📋 Доступні маршрути:`);
  console.log(`  - GET  /api/health`);
  console.log(`  - POST /api/auth/register`);
  console.log(`  - POST /api/auth/login`);
  console.log(`  - GET  /api/menu`);
  console.log(`  - POST /api/orders`);
});