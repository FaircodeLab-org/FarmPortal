/* backend/src/controllers/landPlotController.js */

const LandPlot = require('../models/LandPlot');

/* ───────────────────────────────────────────────
   CREATE  (POST /supplier/land-plots)
──────────────────────────────────────────────────*/
exports.create = async (req, res) => {
  try {
    const plot = await LandPlot.create({
      ...req.body,
      supplier: req.user._id        // owner
    });
    res.json({ success: true, landPlot: plot });
  } catch (e) {
    console.error('Land-Plot create error:', e);
    res.status(500).json({ error: 'Failed to create land plot', detail: e.message });
  }
};

/* ───────────────────────────────────────────────
   LIST  (GET /supplier/land-plots)
──────────────────────────────────────────────────*/
exports.list = async (req, res) => {
  try {
    const rows = await LandPlot.find({ supplier: req.user._id });
    res.json({ success: true, landPlots: rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed to list land plots', detail: e.message });
  }
};

/* ───────────────────────────────────────────────
   UPDATE  (PUT /supplier/land-plots/:id)
──────────────────────────────────────────────────*/
exports.update = async (req, res) => {
  try {
    const plot = await LandPlot.findOneAndUpdate(
      { _id: req.params.id, supplier: req.user._id },
      req.body,
      { new: true }
    );
    if (!plot) return res.status(404).json({ error: 'Land plot not found' });
    res.json({ success: true, landPlot: plot });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update land plot', detail: e.message });
  }
};

/* ───────────────────────────────────────────────
   DELETE  (DELETE /supplier/land-plots/:id)
──────────────────────────────────────────────────*/
exports.remove = async (req, res) => {
  try {
    const plot = await LandPlot.findOneAndDelete({
      _id: req.params.id,
      supplier: req.user._id
    });
    if (!plot) return res.status(404).json({ error: 'Land plot not found' });
    res.json({ success: true, message: 'Land plot deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete land plot', detail: e.message });
  }
};