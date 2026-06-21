const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ 
      error: 'Помилка валідації', 
      details: error.errors 
    });
  }
};

const registerSchema = z.object({
  name: z.string().min(2, 'Ім\'я має бути від 2 символів'),
  email: z.string().email('Невірний формат email'),
  password: z.string().min(6, 'Пароль має бути від 6 символів'),
});

const loginSchema = z.object({
  email: z.string().email('Невірний формат email'),
  password: z.string().min(1, 'Введіть пароль'),
});

const menuItemSchema = z.object({
  name: z.string().min(2, 'Назва від 2 символів'),
  description: z.string().min(5, 'Опис від 5 символів'),
  category: z.enum(['salads', 'main', 'sushi', 'desserts', 'drinks']),
  price: z.number().positive('Ціна має бути більше 0'),
  imageUrl: z.string().url('Невірний URL').optional(),
});

const orderSchema = z.object({
  address: z.string().min(5, 'Адреса від 5 символів'),
  comment: z.string().optional(),
  items: z.array(z.object({
    menuItemId: z.string(),
    quantity: z.number().int().positive(),
  })),
});

module.exports = { 
  validate, 
  registerSchema, 
  loginSchema, 
  menuItemSchema,
  orderSchema 
};