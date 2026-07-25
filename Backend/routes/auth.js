import express from 'express';
import { 
    register, 
    login, 
    forgotPassword,
    verifyOtp,
    resetPassword,
    dashboard,
    adminPanel,
    getCustomersList,
    updateProfile,
    changePassword
} from '../controllers/auth.js';

const router = express.Router();

// Step 1: Public routes (no token needed)
router.post('/register', register);
router.post('/login', login);

// Step 2: Forgot password routes (no token needed)
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// Customer Management (Admin view fallback)
router.get('/customers', getCustomersList);

// Profile & Password Management
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

// Step 3: Protected routes
router.post('/dashboard', dashboard);

// Step 4: Admin routes
router.post('/admin', adminPanel);

export default router;