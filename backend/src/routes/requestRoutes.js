const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { auth, isSupplier, isCustomer } = require('../middleware/auth');

// Customer routes
router.post('/create', auth, isCustomer, requestController.createRequest);
router.get('/customer', auth, isCustomer, requestController.getCustomerRequests);

// Supplier routes
router.get('/supplier', auth, isSupplier, requestController.getSupplierRequests);
router.post('/:requestId/respond', auth, isSupplier, requestController.respondToRequest);

// Shared routes
router.get('/:requestId', auth, requestController.getRequestDetails);

module.exports = router;