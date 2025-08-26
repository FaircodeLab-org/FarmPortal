// const express = require('express');
// const router = express.Router();
// const requestController = require('../controllers/requestController');
// const { auth, isSupplier, isCustomer } = require('../middleware/auth');

// // Customer routes
// router.post('/create', auth, isCustomer, requestController.createRequest);
// router.get('/customer', auth, isCustomer, requestController.getCustomerRequests);

// // Supplier routes
// router.get('/supplier', auth, isSupplier, requestController.getSupplierRequests);
// router.post('/:requestId/respond', auth, isSupplier, requestController.respondToRequest);

// // Shared routes
// router.get('/:requestId', auth, requestController.getRequestDetails);

// module.exports = router;
// backend/src/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const requestController = require('../controllers/requestController');
const { auth, isSupplier, isCustomer } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/eudr-evidence/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC, DOCX are allowed.'));
    }
  }
});

// Update the respond route to handle file upload
router.post('/:requestId/respond', 
  auth, 
  isSupplier, 
  upload.single('evidence'), 
  requestController.respondToRequest
);

// Other routes remain the same
router.post('/create', auth, isCustomer, requestController.createRequest);
router.get('/customer', auth, isCustomer, requestController.getCustomerRequests);
router.get('/supplier', auth, isSupplier, requestController.getSupplierRequests);
router.get('/:requestId', auth, requestController.getRequestDetails);

module.exports = router;