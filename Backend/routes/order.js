import express from 'express';
import {
  createOrder,
  verifyPayment,
  getOrder,
  getUserOrders,
  getAllOrdersAdmin,
  updateOrderStatus,
  trackOrder,
  getDashboardAnalytics
} from '../controllers/order.js';

const router = express.Router();

// Admin: Analytics Summary
router.get('/analytics/dashboard', getDashboardAnalytics);

// Admin: Get all orders
router.get('/admin/all', getAllOrdersAdmin);

// Public/Customer: Track Order
router.get('/track/:query', trackOrder);

// Create order
router.post('/create', (req, res, next) => {
  console.log('📨 POST /api/orders/create');
  next();
}, createOrder);

// Verify payment
router.post('/verify', (req, res, next) => {
  console.log('📨 POST /api/orders/verify');
  next();
}, verifyPayment);

// Admin: Update order status & notes
router.put('/:orderId/status', updateOrderStatus);

// Get order details
router.get('/:orderId', (req, res, next) => {
  console.log('📨 GET /api/orders/:orderId');
  next();
}, getOrder);

// Get user's all orders
router.get('/', (req, res, next) => {
  console.log('📨 GET /api/orders');
  next();
}, getUserOrders);

export default router;