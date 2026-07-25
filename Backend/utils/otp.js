// Step 1: Generate random OTP
export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Step 2: Generate reset token
export const generateResetToken = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
};

// Step 3: Get OTP expiry time (10 minutes from now)
export const getOtpExpiry = () => {
    return new Date(Date.now() + 10 * 60 * 1000);
};

// Step 4: Get reset token expiry time (1 hour from now)
export const getResetTokenExpiry = () => {
    return new Date(Date.now() + 60 * 60 * 1000);
};

// Step 5: Check if OTP is expired
export const isOtpExpired = (otpExpiry) => {
    return new Date() > otpExpiry;
};

// Step 6: Check if reset token is expired
export const isResetTokenExpired = (tokenExpiry) => {
    return new Date() > tokenExpiry;
};