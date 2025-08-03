const erpnextService = require('../services/erpnextService');
const User = require('../models/User');

exports.syncLandPlots = async (req, res) => {
  try {
    const supplier = await User.findById(req.user._id);
    
    if (!supplier.erpnextSupplierName) {
      return res.status(400).json({ 
        error: 'ERPNext supplier name not configured' 
      });
    }

    const landPlots = await erpnextService.getLandPlotData(supplier.erpnextSupplierName);
    
    res.json({
      success: true,
      message: `Synced ${landPlots.length} land plots`,
      data: landPlots
    });
  } catch (error) {
    console.error('Sync land plots error:', error);
    res.status(500).json({ error: 'Failed to sync land plots' });
  }
};

exports.syncProducts = async (req, res) => {
  try {
    const supplier = await User.findById(req.user._id);
    
    if (!supplier.erpnextSupplierName) {
      return res.status(400).json({ 
        error: 'ERPNext supplier name not configured' 
      });
    }

    const products = await erpnextService.getProductData(supplier.erpnextSupplierName);
    
    res.json({
      success: true,
      message: `Synced ${products.length} products`,
      data: products
    });
  } catch (error) {
    console.error('Sync products error:', error);
    res.status(500).json({ error: 'Failed to sync products' });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await User.find({ 
      role: 'supplier'
    }).select('companyName country email _id');
    
    res.json({
      success: true,
      suppliers
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
};