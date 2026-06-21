const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { validate, menuItemSchema } = require('../middleware/validation');

router.get('/', getMenuItems);
router.get('/:id', getMenuItem);
router.post('/', authenticate, authorizeAdmin, validate(menuItemSchema), createMenuItem);
router.put('/:id', authenticate, authorizeAdmin, validate(menuItemSchema), updateMenuItem);
router.delete('/:id', authenticate, authorizeAdmin, deleteMenuItem);

module.exports = router;