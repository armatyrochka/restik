const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/ordersController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { validate, orderSchema } = require('../middleware/validation');

router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrder);
router.post('/', authenticate, validate(orderSchema), createOrder);
router.put('/:id', authenticate, authorizeAdmin, updateOrder);
router.delete('/:id', authenticate, authorizeAdmin, deleteOrder);

module.exports = router;