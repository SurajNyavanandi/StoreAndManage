import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import router from './routes/auth.js';
import productRouter from './routes/products.js';
import orderRouter from './routes/order.js';
import couponRouter from './routes/coupons.js';
import database from './config/database.js';
import cors from 'cors';

const getDirname = () => {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  return path.dirname(fileURLToPath(import.meta.url));
};
const currentDir = getDirname();

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

console.log('✅ Express middleware loaded');

// Router
app.use('/auth', router);
console.log('✅ Auth routes registered');

app.use('/api/products', productRouter);
console.log('✅ Product routes registered');

app.use('/api/orders', orderRouter);
console.log('✅ Order routes registered');

app.use('/api/coupons', couponRouter);
console.log('✅ Coupon routes registered');

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is healthy', timestamp: new Date() });
});
console.log('✅ Health check endpoint registered');

// Serve static SPA frontend
const distPath = path.resolve(currentDir, '../frontend-store/dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Fallback for SPA routing
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(200).send('App is loading...');
});

// Starting the server on port 3000
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  database();
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`\n📍 Available endpoints:`);
  console.log(`   - Auth: http://localhost:${PORT}/auth`);
  console.log(`   - Products: http://localhost:${PORT}/api/products`);
  console.log(`   - Orders: http://localhost:${PORT}/api/orders`);
  console.log(`   - Health: http://localhost:${PORT}/health\n`);
});
