/* backend/src/controllers/batchController.js */

const Batch = require('../models/Batch');

/* CREATE */
exports.create = async (req, res) => {
  try {
    const batch = await Batch.create({
      ...req.body,
      supplier: req.user._id
    });
    res.json({ success: true, batch });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create batch', detail: e.message });
  }
};

/* LIST */
exports.list = async (req, res) => {
  try {
    const rows = await Batch.find({ supplier: req.user._id });
    res.json({ success: true, batches: rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed to list batches', detail: e.message });
  }
};

/* UPDATE */
exports.update = async (req, res) => {
  try {
    const batch = await Batch.findOneAndUpdate(
      { _id: req.params.id, supplier: req.user._id },
      req.body,
      { new: true }
    );
    if (!batch) return res.status(404).json({ error: 'Batch not found' });
    res.json({ success: true, batch });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update batch', detail: e.message });
  }
};

/* DELETE */
exports.remove = async (req, res) => {
  try {
    const batch = await Batch.findOneAndDelete({
      _id: req.params.id,
      supplier: req.user._id
    });
    if (!batch) return res.status(404).json({ error: 'Batch not found' });
    res.json({ success: true, message: 'Batch deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete batch', detail: e.message });
  }
};