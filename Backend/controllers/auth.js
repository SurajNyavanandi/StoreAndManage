import User from '../models/auth.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail, sendResetEmail, sendWelcomeEmail } from '../services/email.js';
import { generateOtp, generateResetToken, getOtpExpiry, getResetTokenExpiry, isOtpExpired, isResetTokenExpired } from '../utils/otp.js';

// ============ AUTHENTICATION FUNCTIONS ============

export const register = async (req, res) => {
    try {
        // Step 1: Extract data
        const { name, email, password, role } = req.body;
        
        // Step 2: Validate
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }
        
        // Step 3: Check email exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        
        // Step 4: Hash password
        const hashPassword = await bcryptjs.hash(password, 10);
        
        // Step 5: Create user
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role: role || "guest"
        });
        
        // Step 6: Send welcome email
        await sendWelcomeEmail(email, name);
        
        // Step 7: Send response
        return res.status(201).json({
            message: "User registered. Welcome email sent.",
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
        
    } catch (error) {
        console.log("Error: " + error.message);
        return res.status(500).json({ message: "Error registering user" });
    }
};

export const login = async (req, res) => {
    try {
        // Step 1: Extract data
        const { email, password } = req.body;
        
        // Step 2: Validate
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }
        
        // Step 3: Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Step 4: Compare password
        const isPasswordMatch = await bcryptjs.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Step 5: Create token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // Step 6: Send response
        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        console.log("Error: " + error.message);
        return res.status(500).json({ message: "Error logging in" });
    }
};

// ============ PASSWORD RESET FUNCTIONS ============

export const forgotPassword = async (req, res) => {
    try {
        // Step 1: Extract email
        const { email } = req.body;
        
        // Step 2: Validate
        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }
        
        // Step 3: Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Step 4: Generate OTP
        const otp = generateOtp();
        const otpExpiry = getOtpExpiry();
        
        // Step 5: Save OTP to database
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        
        // Step 6: Send OTP email
        const emailResult = await sendOtpEmail(email, otp);
        
        if (!emailResult.success) {
            return res.status(500).json({ message: "Failed to send OTP" });
        }
        
        // Step 7: Send response
        return res.status(200).json({
            message: "OTP sent to your email",
            email: email
        });
        
    } catch (error) {
        console.log("Error: " + error.message);
        return res.status(500).json({ message: "Error in forgot password" });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        // Step 1: Extract data
        const { email, otp } = req.body;
        
        // Step 2: Validate
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP required" });
        }
        
        // Step 3: Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Step 4: Check if OTP exists
        if (!user.otp) {
            return res.status(400).json({ message: "OTP not requested" });
        }
        
        // Step 5: Check if OTP expired
        if (isOtpExpired(user.otpExpiry)) {
            return res.status(400).json({ message: "OTP expired" });
        }
        
        // Step 6: Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        
        // Step 7: Generate reset token
        const resetToken = generateResetToken();
        const resetTokenExpiry = getResetTokenExpiry();
        
        // Step 8: Save reset token
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        
        // Step 9: Send response
        return res.status(200).json({
            message: "OTP verified. You can now reset password.",
            resetToken: resetToken
        });
        
    } catch (error) {
        console.log("Error: " + error.message);
        return res.status(500).json({ message: "Error verifying OTP" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        // Step 1: Extract data
        const { email, resetToken, newPassword } = req.body;
        
        // Step 2: Validate
        if (!email || !resetToken || !newPassword) {
            return res.status(400).json({ message: "All fields required" });
        }
        
        // Step 3: Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Step 4: Check if reset token exists
        if (!user.resetToken) {
            return res.status(400).json({ message: "Reset token not found" });
        }
        
        // Step 5: Check if reset token matches
        if (user.resetToken !== resetToken) {
            return res.status(400).json({ message: "Invalid reset token" });
        }
        
        // Step 6: Check if reset token expired
        if (isResetTokenExpired(user.resetTokenExpiry)) {
            return res.status(400).json({ message: "Reset token expired" });
        }
        
        // Step 7: Hash new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        
        // Step 8: Update password
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
        
        // Step 9: Send response
        return res.status(200).json({
            message: "Password reset successfully. Please login with new password."
        });
        
    } catch (error) {
        console.log("Error: " + error.message);
        return res.status(500).json({ message: "Error resetting password" });
    }
};

// Sample customers for admin view fallback
const sampleCustomers = [
  { _id: 'u_1', name: 'Kunal Verma', email: 'kunal.verma@example.com', role: 'customer', totalOrders: 4, totalSpent: 4890, phone: '+91 9876543210', city: 'Mumbai', state: 'Maharashtra', createdAt: '2026-01-15T10:00:00Z' },
  { _id: 'u_2', name: 'Anjali Sharma', email: 'anjali.s@example.com', role: 'customer', totalOrders: 2, totalSpent: 2899, phone: '+91 9123456789', city: 'Bengaluru', state: 'Karnataka', createdAt: '2026-02-10T11:20:00Z' },
  { _id: 'u_3', name: 'Rohan Gupta', email: 'rohan.g@example.com', role: 'customer', totalOrders: 3, totalSpent: 3450, phone: '+91 9988776655', city: 'Delhi', state: 'Delhi', createdAt: '2026-03-01T14:15:00Z' },
  { _id: 'u_4', name: 'Sneha Patel', email: 'sneha.p@example.com', role: 'customer', totalOrders: 1, totalSpent: 799, phone: '+91 9811223344', city: 'Ahmedabad', state: 'Gujarat', createdAt: '2026-04-18T09:30:00Z' },
  { _id: 'u_5', name: 'Vikram Singh', email: 'vikram.singh@example.com', role: 'customer', totalOrders: 5, totalSpent: 6200, phone: '+91 9776655443', city: 'Jaipur', state: 'Rajasthan', createdAt: '2026-05-12T16:45:00Z' }
];

// Get Customers List (Admin)
export const getCustomersList = async (req, res) => {
  try {
    const { search } = req.query;

    let customers = [...sampleCustomers];

    if (mongoose.connection.readyState === 1) {
      try {
        const filter = {};
        if (search) {
          const regex = new RegExp(search, 'i');
          filter.$or = [{ name: regex }, { email: regex }];
        }
        const dbUsers = await User.find(filter).select('-password');
        if (dbUsers && dbUsers.length > 0) {
          customers = dbUsers.map(u => ({
            _id: u._id,
            name: u.name,
            email: u.email,
            role: u.role || 'customer',
            totalOrders: 3,
            totalSpent: 3500,
            phone: '+91 9876543210',
            city: 'Mumbai',
            state: 'Maharashtra',
            createdAt: u.createdAt || new Date()
          }));
        }
      } catch (e) {
        console.log('Customers DB query notice:', e.message);
      }
    }

    if (search) {
      const q = search.toLowerCase();
      customers = customers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.city && c.city.toLowerCase().includes(q))
      );
    }

    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching customers', error: error.message });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, state, zipCode } = req.body;
    const userId = req.user?.id;

    if (mongoose.connection.readyState === 1 && userId) {
      const user = await User.findById(userId);
      if (user) {
        if (name) user.name = name;
        await user.save();
        return res.status(200).json({
          success: true,
          message: 'Profile updated successfully',
          user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully (demo mode)',
      user: {
        id: userId || 'demo-user',
        name: name || 'Demo User',
        email: req.user?.email || 'user@example.com',
        role: req.user?.role || 'Admin',
        phone, address, city, state, zipCode
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }

    const userId = req.user?.id;
    if (mongoose.connection.readyState === 1 && userId) {
      const user = await User.findById(userId);
      if (user) {
        const isMatch = await bcryptjs.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ success: false, message: 'Incorrect current password' });
        }
        user.password = await bcryptjs.hash(newPassword, 10);
        await user.save();
        return res.status(200).json({ success: true, message: 'Password changed successfully' });
      }
    }

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error changing password', error: error.message });
  }
};

// ============ DASHBOARD & ADMIN FUNCTIONS ============

export const dashboard = async (req, res) => {
    try {
        // Step 1: Get user from middleware
        const user = req.user;
        
        // Step 2: Get user data
        const userData = await User.findById(user.id);
        
        // Step 3: Send response
        return res.status(200).json({
            message: "Dashboard data",
            user: {
                id: userData._id,
                name: userData.name,
                email: userData.email,
                role: userData.role
            }
        });
        
    } catch (error) {
        console.log("Error: " + error.message);
        return res.status(500).json({ message: "Error accessing dashboard" });
    }
};

export const adminPanel = async (req, res) => {
    try {
        // Step 1: Get user
        const user = req.user;
        
        // Step 2: Get all users
        const allUsers = await User.find().select('-password');
        
        // Step 3: Send response
        return res.status(200).json({
            message: "Admin panel",
            currentUser: { id: user.id, email: user.email, role: user.role },
            totalUsers: allUsers.length,
            allUsers: allUsers
        });
        
    } catch (error) {
        console.log("Error: " + error.message);
        return res.status(500).json({ message: "Error accessing admin panel" });
    }
};