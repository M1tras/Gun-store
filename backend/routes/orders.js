const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET /api/orders/admin  - admin: all orders (must come before /:id routes)
router.get('/admin', verifyToken, isAdmin, getAllOrders);

// GET /api/orders  - authenticated user's own orders
router.get('/', verifyToken, getUserOrders);

// POST /api/orders  - authenticated user places an order
router.post('/', verifyToken, createOrder);

// PATCH /api/orders/:id/status  - admin: update order status
router.patch('/:id/status', verifyToken, isAdmin, updateOrderStatus);

module.exports = router;
