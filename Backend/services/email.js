import nodemailer from 'nodemailer';

// Step 1: Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,      // Your Gmail
        pass: process.env.EMAIL_PASSWORD   // Your Gmail App Password
    }
});

// Step 2: Send OTP email
export const sendOtpEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Password Reset',
            html: `
                <h2>Password Reset OTP</h2>
                <p>Your OTP is: <strong>${otp}</strong></p>
                <p>This OTP is valid for 10 minutes.</p>
                <p>If you didn't request this, ignore this email.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'OTP sent to email' };
    } catch (error) {
        console.log('Error: ' + error.message);
        return { success: false, message: 'Failed to send email' };
    }
};

// Step 3: Send password reset link email
export const sendResetEmail = async (email, resetLink) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link is valid for 1 hour.</p>
                <p>If you didn't request this, ignore this email.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Reset link sent to email' };
    } catch (error) {
        console.log('Error: ' + error.message);
        return { success: false, message: 'Failed to send email' };
    }
};

// Step 4: Send welcome email
export const sendWelcomeEmail = async (email, name) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to StoreAndManage',
            html: `
                <h2>Welcome ${name}!</h2>
                <p>Thank you for registering with StoreAndManage.</p>
                <p>Your account has been created successfully.</p>
                <p>You can now login with your email and password.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Welcome email sent' };
    } catch (error) {
        console.log('Error: ' + error.message);
        return { success: false, message: 'Failed to send email' };
    }
};