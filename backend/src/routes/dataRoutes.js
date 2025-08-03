const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const { auth, isSupplier } = require('../middleware/auth');

// Supplier data sync routes
router.post('/sync/land-plots', auth, isSupplier, dataController.syncLandPlots);
router.post('/sync/products', auth, isSupplier, dataController.syncProducts);

// Public data routes
router.get('/suppliers', auth, dataController.getSuppliers);

module.exports = router;