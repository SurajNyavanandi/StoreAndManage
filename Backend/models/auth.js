import mongoose from 'mongoose';

// Step 1: Create user schema with fields
const userSchema = new mongoose.Schema({
    // Step 1: Basic fields
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{type:String, enum:["admin","user","guest"], default:"guest"},
    
    // Step 2: Email verification
    isEmailVerified:{type:Boolean, default:false},
    
    // Step 3: OTP fields
    otp:{type:String, default:null},
    otpExpiry:{type:Date, default:null},
    
    // Step 4: Password reset fields
    resetToken:{type:String, default:null},
    resetTokenExpiry:{type:Date, default:null},
    
    // Step 5: Timestamps
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now}
});

// Step 2: Create User model from schema
const User = mongoose.model('User', userSchema);

export default User;