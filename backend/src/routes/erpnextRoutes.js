const express = require('express');
const router = express.Router();
const { auth, isSupplier } = require('../middleware/auth');
const erpnextService = require('../services/erpnextService');

// Test ERPNext connection
router.get('/test-connection', auth, isSupplier, async (req, res) => {
  try {
    // Test API connection
    const response = await erpnextService.testConnection();
    res.json({ success: true, message: 'ERPNext connection successful' });
  } catch (error) {
    res.status(500).json({ error: 'ERPNext connection failed' });
  }
});

module.exports = router;