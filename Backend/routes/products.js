import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  duplicateProduct,
  bulkProductAction,
  addProductReview
} from '../controllers/productController.js';

const router = express.Router();

// Create a new product
router.post('/', (req, res, next) => {
  console.log('📨 POST /api/products');
  next();
}, createProduct);

// Get all products (with optional search, filters, sorting, pagination)
router.get('/', (req, res, next) => {
  console.log('📨 GET /api/products', req.query);
  next();
}, getAllProducts);

// Bulk product actions (delete or update status)
router.post('/bulk', (req, res, next) => {
  console.log('📨 POST /api/products/bulk');
  next();
}, bulkProductAction);

// Get products by category
router.get('/category/:category', (req, res, next) => {
  console.log('📨 GET /api/products/category/:category -', req.params.category);
  next();
}, getProductsByCategory);

// Duplicate product
router.post('/:id/duplicate', (req, res, next) => {
  console.log('📨 POST /api/products/:id/duplicate -', req.params.id);
  next();
}, duplicateProduct);

// Add product review
router.post('/:id/reviews', (req, res, next) => {
  console.log('📨 POST /api/products/:id/reviews -', req.params.id);
  next();
}, addProductReview);

// Get product by ID
router.get('/:id', (req, res, next) => {
  console.log('📨 GET /api/products/:id -', req.params.id);
  next();
}, getProductById);

// Update product
router.put('/:id', (req, res, next) => {
  console.log('📨 PUT /api/products/:id -', req.params.id);
  next();
}, updateProduct);

// Delete product
router.delete('/:id', (req, res, next) => {
  console.log('📨 DELETE /api/products/:id -', req.params.id);
  next();
}, deleteProduct);

export default router;
