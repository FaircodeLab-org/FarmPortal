const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
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