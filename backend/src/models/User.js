// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   companyName: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   role: {
//     type: String,
//     enum: ['supplier', 'customer'],
//     required: true
//   },
//   country: {
//     type: String,
//     required: true
//   },
//   isEU: {
//     type: Boolean,
//     default: false
//   },
//   erpnextSupplierName: {
//     type: String, // Links to ERPNext Supplier name
//     unique: true,
//     sparse: true
//   },
//   address: {
//     street: String,
//     city: String,
//     postalCode: String,
//     state: String
//   },
//   contactPerson: {
//     name: String,
//     phone: String,
//     position: String
//   },
//   verificationStatus: {
//     type: String,
//     enum: ['pending', 'verified', 'rejected'],
//     default: 'pending'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Compare password method
// userSchema.methods.comparePassword = async function(password) {
//   return await bcrypt.compare(password, this.password);
// };

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: '' // Changed from required to default empty
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
    default: '' // Changed from required to default empty
  },
  isEU: {
    type: Boolean,
    default: false
  },
  erpnextSupplierName: {
    type: String,
    unique: true,
    sparse: true
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    state: { type: String, default: '' }
  },
  contactPerson: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    position: { type: String, default: '' }
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving - but skip if it's the dummy password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (this.password === 'erpnext-managed') return next(); // Skip hashing for ERP users
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  if (this.password === 'erpnext-managed') {
    // For ERP-managed users, always return false
    // They should authenticate via ERPNext
    return false;
  }
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);