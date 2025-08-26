const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided in Authorization header');
      throw new Error('No token provided');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Token verified, user:', decoded);
    // req.user = decoded;
    const user = await User.findOne({ email: decoded.email });
    if (!user) throw new Error('User not found');
    req.user  = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Check if user is supplier
const isSupplier = (req, res, next) => {
  if (req.user.role !== 'supplier') {
    return res.status(403).json({ error: 'Access denied. Suppliers only.' });
  }
  next();
};

// Check if user is customer
const isCustomer = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Access denied. Customers only.' });
  }
  next();
};

module.exports = { auth, isSupplier, isCustomer };