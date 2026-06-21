const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log(' Починаємо заповнення бази даних...');

  // Очищаємо старі дані
  console.log('🗑️ Видаляємо старі дані...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.user.deleteMany();

  // Створюємо адміністратора
  console.log('👤 Створюємо адміністратора...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@restaurant.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  // Створюємо звичайного користувача
  console.log('👤 Створюємо користувача...');
  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
    },
  });

  // Створюємо страви
  console.log('🍽️ Створюємо страви...');
  const menuItems = [
    {
      name: 'Цезар з куркою',
      description: 'Класичний салат з куркою, пармезаном, сухариками та соусом Цезар',
      category: 'salads',
      price: 185,
      imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500',
    },
    {
      name: 'Грецький салат',
      description: 'Свіжі овочі, фета, оливки, оливкова олія та спеції',
      category: 'salads',
      price: 165,
      imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500',
    },
    {
      name: 'Стейк Рібай',
      description: 'Соковитий стейк з мармуровою яловичиною, запечений на грилі',
      category: 'main',
      price: 450,
      imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=500',
    },
    {
      name: 'Паста Карбонара',
      description: 'Спагеті з беконом, яйцем, пармезаном та вершками',
      category: 'main',
      price: 210,
      imageUrl: 'https://images.unsplash.com/photo-1645112411342-4665a10c6f6e?w=500',
    },
    {
      name: 'Суші Філадельфія',
      description: 'Класичні суші з лососем, вершковим сиром та огірком',
      category: 'sushi',
      price: 280,
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500',
    },
    {
      name: 'Суші Каліфорнія',
      description: 'Суші з крабом, авокадо та огірком',
      category: 'sushi',
      price: 250,
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500',
    },
    {
      name: 'Тірамісу',
      description: 'Класичний італійський десерт з кавою та маскарпоне',
      category: 'desserts',
      price: 140,
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500',
    },
    {
      name: 'Яблучний пиріг',
      description: 'Домашній пиріг з яблуками та корицею, подається з морозивом',
      category: 'desserts',
      price: 120,
      imageUrl: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=500',
    },
    {
      name: 'Лимонад домашній',
      description: 'Освіжаючий лимонад з лимоном, м\'ятою та льодом',
      category: 'drinks',
      price: 75,
      imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500',
    },
    {
      name: 'Сік апельсиновий',
      description: 'Свіжовичавлений апельсиновий сік',
      category: 'drinks',
      price: 85,
      imageUrl: 'https://images.unsplash.com/photo-1611501278017-e7e5a4bfb4c2?w=500',
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: item,
    });
  }

  console.log(' База даних успішно заповнена!');
  console.log(' Адмін: admin@restaurant.com / admin123');
  console.log(' Користувач: user@example.com / user123');
  console.log(' Додано 10 страв');
}

main()
  .catch((e) => {
    console.error(' Помилка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });