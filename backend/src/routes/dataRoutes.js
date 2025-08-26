// const express = require('express');
// const router = express.Router();
// const dataController = require('../controllers/dataController');
// const { auth, isSupplier, isCustomer } = require('../middleware/auth');
// const erpnext = require('../services/erpnextService');

// // Customer supplier/item/batch routes
// router.post('/supplier', auth, isCustomer, async (req, res) => {
// 		try {
// 			const doc = await erpnext.createSupplier(req.body, req.user.role);
// 			res.json({ success: true, supplier: doc });
// 		} catch (e) {
// 			console.error('Create Supplier error:', e?.response?.data || e);
// 			res.status(500).json({
// 				error: 'Failed to create supplier',
// 				detail: e?.response?.data?.message || e?.response?.data?.exception || e.message || e.toString(),
// 				erpnext: e?.response?.data
// 			});
// 		}
// });

// router.post('/item', auth, isCustomer, async (req, res) => {
// 		try {
// 			const doc = await erpnext.createItem(req.body, req.user.role);
// 			res.json({ success: true, item: doc });
// 		} catch (e) {
// 			console.error('Create Item error:', e?.response?.data || e);
// 			res.status(500).json({
// 				error: 'Failed to create item',
// 				detail: e?.response?.data?.message || e?.response?.data?.exception || e.message || e.toString(),
// 				erpnext: e?.response?.data
// 			});
// 		}
// });

// router.post('/batch', auth, isCustomer, async (req, res) => {
// 		try {
// 			const doc = await erpnext.createBatch(req.body, req.user.role);
// 			res.json({ success: true, batch: doc });
// 		} catch (e) {
// 			console.error('Create Batch error:', e?.response?.data || e);
// 			res.status(500).json({
// 				error: 'Failed to create batch',
// 				detail: e?.response?.data?.message || e?.response?.data?.exception || e.message || e.toString(),
// 				erpnext: e?.response?.data
// 			});
// 		}
// });

// router.get('/batches/:item_code', auth, isCustomer, async (req, res) => {
// 	try {
// 		const rows = await erpnext.getBatchData(req.params.item_code, 'customer');
// 		res.json({ success: true, batches: rows });
// 	} catch (e) {
// 		res.status(500).json({ error: 'Failed to fetch batches', detail: e.message });
// 	}
// });

// // Supplier data sync routes
// router.post('/sync/land-plots', auth, isSupplier, dataController.syncLandPlots);
// router.post('/sync/products', auth, isSupplier, dataController.syncProducts);

// // Public data routes
// router.get('/suppliers', auth, dataController.getSuppliers);

// module.exports = router;
/*  supplierRoutes.js   (only supplier-side APIs)
    – Land-Plot CRUD
    – Batch  CRUD
    – Answer product / PO requests
    – ERP-sync endpoints
*/

const dataController     = require('../controllers/dataController');
const express = require('express');
const router  = express.Router();

// const { auth, isSupplier } = require('../middleware/auth');
const { auth, isSupplier, isCustomer } = require('../middleware/auth');
const productCtrl = require('../controllers/productController');

const landPlotController = require('../controllers/landPlotController');
const batchController    = require('../controllers/batchController');
const requestController  = require('../controllers/requestController');
// const dataController     = require('../controllers/dataController');   // sync
const erpnextService     = require('../services/erpnextService');

/* ────────────────────────────────────────────────
   LAND-PLOT  (CRUD)
────────────────────────────────────────────────── */
router.post('/land-plots', auth, isSupplier, landPlotController.create);
router.get ('/land-plots', auth, isSupplier, landPlotController.list);
router.put ('/land-plots/:id', auth, isSupplier, landPlotController.update);
router.delete('/land-plots/:id', auth, isSupplier, landPlotController.remove);

/* ────────────────────────────────────────────────
   BATCH  (CRUD)
────────────────────────────────────────────────── */
router.post('/batches', auth, isSupplier, batchController.create);
router.get ('/batches', auth, isSupplier, batchController.list);
router.put ('/batches/:id', auth, isSupplier, batchController.update);
router.delete('/batches/:id', auth, isSupplier, batchController.remove);

/* ────────────────────────────────────────────────
   ANSWER  product / PO request
────────────────────────────────────────────────── */
router.post(
  '/requests/:requestId/answer',
  auth,
  isSupplier,
  requestController.respondToRequest        // already contains supplier logic
);

// backend/src/routes/dataRoutes.js
router.get('/template/land-plots', auth, isSupplier, (req, res) => {
  res.json({
    success: true,
    template: {
      headers: [
        'Plot ID', 'Plot Name', 'Country', 'Products', 'Area (hectares)',
        'Lat1', 'Lng1', 'Lat2', 'Lng2', 'Lat3', 'Lng3', 'Lat4', 'Lng4',
        'Lat5', 'Lng5', 'Lat6', 'Lng6', 'Lat7', 'Lng7', 'Lat8', 'Lng8'
      ],
      example: [
        [
          'PLOT001', 'Coffee Farm A', 'Brazil', 'Coffee Arabica;Coffee Robusta', '50',
          '-15.7801', '-47.9292', '-15.7805', '-47.9295', '-15.7810', '-47.9290',
          '-15.7806', '-47.9287', '', '', '', '', '', '', '', ''
        ],
        [
          'PLOT002', 'Cocoa Farm B', 'Ghana', 'Cocoa Beans', '30',
          '7.9465', '-1.0232', '7.9470', '-1.0235', '7.9468', '-1.0228',
          '7.9463', '-1.0230', '', '', '', '', '', '', '', ''
        ]
      ]
    }
  });
});
/* ────────────────────────────────────────────────
   SYNC from ERPNext (existing endpoints)
────────────────────────────────────────────────── */
router.post('/sync/land-plots', auth, isSupplier, dataController.syncLandPlots);
router.post('/sync/products',   auth, isSupplier, dataController.syncProducts);
router.get('/suppliers', auth, dataController.getSuppliers);



const productController = require('../controllers/productController');

router.post ('/products',     auth, isSupplier, productController.create);
router.get  ('/products',     auth, isSupplier, productController.list);
router.put  ('/products/:id', auth, isSupplier, productController.update);
router.delete('/products/:id',auth, isSupplier, productController.remove);


router.post   ('/products',     auth, isSupplier, productCtrl.create);
router.get    ('/products',     auth, isSupplier, productCtrl.list);
router.put    ('/products/:id', auth, isSupplier, productCtrl.update);
router.delete ('/products/:id', auth, isSupplier, productCtrl.remove);

// Public (customer) read-only
router.get('/supplier/:supplierId/products', auth, isCustomer, async (req,res)=>{
  const rows = await require('../models/Product')
                 .find({ supplier:req.params.supplierId })
                 .populate('landPlots','name country commodities geojson latitude longitude');
  res.json({ success:true, products:rows });
});

module.exports = router;

