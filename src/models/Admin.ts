import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
  },
  activeSessionId: {
    type: String,
    default: null,
  },
  twoFactorMethod: {
    type: String,
    enum: ['none', 'totp', 'sms'],
    default: 'none',
  },
  totpSecret: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  twoFactorOtpHash: {
    type: String,
    default: null,
  },
  twoFactorOtpExpires: {
    type: Date,
    default: null,
  },
  twoFactorAttempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Admin || mongoose.model('Admin', adminSchema); 