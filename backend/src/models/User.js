const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['supplier', 'customer'],
    required: true
  },
  country: {
    type: String,
    required: true
  },
  isEU: {
    type: Boolean,
    default: false
  },
  erpnextSupplierName: {
    type: String, // Links to ERPNext Supplier name
    unique: true,
    sparse: true
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    state: String
  },
  contactPerson: {
    name: String,
    phone: String,
    position: String
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);