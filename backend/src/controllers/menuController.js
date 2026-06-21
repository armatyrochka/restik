const prisma = require('../config/database');

const getMenuItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося отримати меню' });
  }
};

const getMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      return res.status(404).json({ error: 'Страву не знайдено' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося отримати страву' });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, description, category, price, imageUrl } = req.body;

    const item = await prisma.menuItem.create({
      data: {
        name,
        description,
        category,
        price,
        imageUrl,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося створити страву' });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, imageUrl } = req.body;

    const existingItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Страву не знайдено' });
    }

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description,
        category,
        price,
        imageUrl,
      },
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося оновити страву' });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Страву не знайдено' });
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    res.json({ message: 'Страву видалено' });
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося видалити страву' });
  }
};

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};