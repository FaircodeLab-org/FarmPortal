/* importerRoutes.js
   Routes that can be used ONLY by importer / customer users
   (role checked with isCustomer middleware)
*/
const express = require('express');
const router  = express.Router();

const { auth, isCustomer } = require('../middleware/auth');
const erp    = require('../services/erpnextService');

/* ────────────────────────────────────────────────
   Supplier Management  (ensure + list)
────────────────────────────────────────────────── */
router.post('/supplier', auth, isCustomer, async (req, res) => {
  try {
    const supplier = await erp.ensureSupplier(
      { supplier_name: req.body.supplier_name,
        supplier_type: req.body.supplier_type || 'Company' },
      'customer'
    );
    res.json({ success: true, supplier });
  } catch (e) {
    res.status(500).json({ error: 'Supplier create/list failed', detail: e.message });
  }
});

/* ────────────────────────────────────────────────
   Item / Product Management
────────────────────────────────────────────────── */
router.post('/item', auth, isCustomer, async (req, res) => {
  try {
    const item = await erp.createItem(req.body, 'customer');
    res.json({ success: true, item });
  } catch (e) {
    res.status(500).json({ error: 'Item create failed', detail: e.message });
  }
});

/* ────────────────────────────────────────────────
   Batch Management
────────────────────────────────────────────────── */
router.post('/batch', auth, isCustomer, async (req, res) => {
  try {
    const batch = await erp.createBatch(req.body, 'customer');
    res.json({ success: true, batch });
  } catch (e) {
    res.status(500).json({ error: 'Batch create failed', detail: e.message });
  }
});

router.get('/batches/:item_code', auth, isCustomer, async (req, res) => {
  try {
    const batches = await erp.getBatchData(req.params.item_code, 'customer');
    res.json({ success: true, batches });
  } catch (e) {
    res.status(500).json({ error: 'Batch list failed', detail: e.message });
  }
});

/* ────────────────────────────────────────────────
   Risk-Analysis placeholder  (to be implemented)
────────────────────────────────────────────────── */
router.post('/run-risk', auth, isCustomer, async (_req, res) => {
  // call your future risk-analysis service here
  res.json({ success: true, message: 'Risk analysis triggered (stub).' });
});

module.exports = router;