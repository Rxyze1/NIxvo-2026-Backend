// models/OTP.js

import mongoose from 'mongoose';
import crypto from 'crypto';
import { backupDocument } from '../Service/Backup-DB/backupService.js';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    otp: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        enum: ['registration', 'login', 'password_reset'],
        default: 'registration',
    },
    
    // For signup only
    fullname: String,
    username: String,
    phone: String,
    password: String,
    userType: String,
    adminRole: String,  // ✅ ADD THIS!
    
    attempts: {
        type: Number,
        default: 0,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 },
    },
}, {
    timestamps: true,
});

// Check if expired
otpSchema.methods.isExpired = function() {
    return Date.now() > this.expiresAt;
};

// Mark as used
otpSchema.methods.markAsUsed = async function() {
    this.isUsed = true;
    return await this.save();
};

// Generate random 6-digit OTP
otpSchema.statics.generateCode = function() {
    return crypto.randomInt(100000, 999999).toString();
};

// Create new OTP
otpSchema.statics.createNew = async function(email, purpose, userType, signupData) {
    const sanitizedEmail = email.toLowerCase().trim();
    
    // Delete old OTPs for this email
    await this.deleteMany({ email: sanitizedEmail, purpose });
    
    const otpCode = this.generateCode();
    
    const otp = await this.create({
        email: sanitizedEmail,
        otp: otpCode,
        purpose,
        fullname: signupData?.fullname,
        username: signupData?.username,
        phone: signupData?.phone,
        password: signupData?.password,
        userType,
        adminRole: signupData?.adminRole,  // ✅ ADD THIS!
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        attempts: 0,
        isUsed: false,
    });
    
    return { otp: otpCode, _id: otp._id };
};

// Verify OTP code
otpSchema.statics.verifyCode = async function(email, otpCode, purpose) {
    const sanitizedEmail = email.toLowerCase().trim();
    
    // Find OTP by email and purpose
    const otpDoc = await this.findOne({
        email: sanitizedEmail,
        purpose,
        isUsed: false,
    });
    
    if (!otpDoc) {
        return { success: false, message: 'Invalid OTP' };
    }
    
    // Check if expired
    if (otpDoc.isExpired()) {
        await otpDoc.deleteOne();
        return { success: false, message: 'OTP expired' };
    }
    
    // Check attempts
    if (otpDoc.attempts >= 5) {
        await otpDoc.deleteOne();
        return { success: false, message: 'Too many attempts' };
    }
    
    // Compare provided code with stored code
    if (otpDoc.otp !== otpCode.toString()) {
        otpDoc.attempts += 1;
        await otpDoc.save();
        return { 
            success: false, 
            message: 'Invalid OTP', 
            attemptsLeft: 5 - otpDoc.attempts 
        };
    }
    
    // Success - code matches!
    return { success: true, otpDoc };
};

// Resend OTP
otpSchema.statics.resendCode = async function(email, purpose) {
    const sanitizedEmail = email.toLowerCase().trim();
    
    const oldOTP = await this.findOne({
        email: sanitizedEmail,
        purpose,
        isUsed: false,
    }).sort({ createdAt: -1 });
    
    if (!oldOTP) {
        return { error: true, message: 'Please register first' };
    }
    
    // Save old data before deleting
    const savedData = {
        fullname: oldOTP.fullname,
        username: oldOTP.username,
        phone:    oldOTP.phone,
        password: oldOTP.password,
        userType: oldOTP.userType,
        adminRole: oldOTP.adminRole,
    };

    // ✅ DELETE ALL old OTPs for this email+purpose first
    await this.deleteMany({ email: sanitizedEmail, purpose });
    
    const newOtpCode = this.generateCode();
    
    const newOTP = await this.create({
        email:     sanitizedEmail,
        otp:       newOtpCode,
        purpose,
        ...savedData,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        attempts:  0,
        isUsed:    false,
    });
    
    return { otp: newOtpCode, _id: newOTP._id };
};




// ─────────────────────────────────────────────────────────────
// BACKUP HOOKS
// ─────────────────────────────────────────────────────────────


otpSchema.pre('save', function () {
  this._wasNew = this.isNew;
});

otpSchema.post('save', async function () {
  try {
    await backupDocument('otps', this._wasNew ? 'create' : 'update', this);
  } catch (err) {
    console.error('⚠️ [BACKUP] post.save failed (otps):', err.message);
  }
});

otpSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;
  try {
    await backupDocument('otps', 'delete', doc);
  } catch (err) {
    console.error('⚠️ [BACKUP] post.findOneAndDelete failed (otps):', err.message);
  }
});

otpSchema.post('deleteOne', { document: true, query: false }, async function () {
  try {
    await backupDocument('otps', 'delete', this);
  } catch (err) {
    console.error('⚠️ [BACKUP] post.deleteOne failed (otps):', err.message);
  }
});

otpSchema.post('deleteMany', async function () {
  try {
    // deleteMany doesn't give us docs — just log the query filter
    console.log('⚠️ [BACKUP] deleteMany on otps — filter:', this.getFilter());
  } catch (err) {
    console.error('⚠️ [BACKUP] post.deleteMany failed (otps):', err.message);
  }
});

const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema);

export default OTP;