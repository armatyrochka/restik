const prisma = require('../config/database');

const getOrders = async (req, res) => {
  try {
    const { userId } = req.user;
    const isAdmin = req.user.role === 'admin';

    const where = isAdmin ? {} : { userId };

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося отримати замовлення' });
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    if (role !== 'admin' && order.userId !== userId) {
      return res.status(403).json({ error: 'Доступ заборонено' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося отримати замовлення' });
  }
};

const createOrder = async (req, res) => {
  try {
    const { address, comment, items } = req.body;
    const { userId } = req.user;

    const menuItemIds = items.map(item => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
      },
    });

    let totalPrice = 0;
    const orderItemsData = items.map((item) => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      if (!menuItem) {
        throw new Error(`Страву ${item.menuItemId} не знайдено`);
      }
      const price = menuItem.price * item.quantity;
      totalPrice += price;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      };
    });

    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        address,
        comment,
        status: 'pending',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Не вдалося створити замовлення' });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося оновити замовлення' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    await prisma.order.delete({
      where: { id },
    });

    res.json({ message: 'Замовлення видалено' });
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося видалити замовлення' });
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
};