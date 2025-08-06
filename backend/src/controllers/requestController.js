const Request = require('../models/Request');
const User = require('../models/User');
const erpnextService = require('../services/erpnextService');
const nodemailer = require('nodemailer');

class RequestController {
  // Create new request (Customer side)
  async createRequest(req, res) {
    try {
      const { supplierId, requestType, requestedProducts, message, requiredBy } = req.body;
      
      // Verify supplier exists
      const supplier = await User.findById(supplierId);
      if (!supplier || supplier.role !== 'supplier') {
        return res.status(404).json({ error: 'Supplier not found' });
      }

      // Create request
      const request = new Request({
        customer: req.user._id,
        supplier: supplierId,
        requestType,
        requestedProducts,
        message,
        requiredBy
      });

      await request.save();

      // Send email notification to supplier (optional)
      // await this.sendNotificationEmail(supplier.email, request);

      res.status(201).json({
        success: true,
        message: 'Request sent successfully',
        request
      });
    } catch (error) {
      console.error('Create request error:', error);
      res.status(500).json({ error: 'Failed to create request' });
    }
  }

  // Get requests for supplier
  async getSupplierRequests(req, res) {
    try {
      const { status, type, dateFrom, dateTo } = req.query;
      
      const filter = { supplier: req.user._id };
      
      if (status) filter.status = status;
      if (type) filter.requestType = type;
      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
        if (dateTo) filter.createdAt.$lte = new Date(dateTo);
      }

      const requests = await Request.find(filter)
        .populate('customer', 'companyName email country')
        .sort('-createdAt');

      res.json({
        success: true,
        requests
      });
    } catch (error) {
      console.error('Get supplier requests error:', error);
      res.status(500).json({ error: 'Failed to fetch requests' });
    }
  }

  // Get requests for customer
  async getCustomerRequests(req, res) {
    try {
      const requests = await Request.find({ customer: req.user._id })
        .populate('supplier', 'companyName email country')
        .sort('-createdAt');

      res.json({
        success: true,
        requests
      });
    } catch (error) {
      console.error('Get customer requests error:', error);
      res.status(500).json({ error: 'Failed to fetch requests' });
    }
  }

  // Respond to request (Supplier side)
  async respondToRequest(req, res) {
    try {
      const { requestId } = req.params;
      const { message, status } = req.body;

      // Find the request
      const request = await Request.findById(requestId);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      // Check if the user is the supplier
      if (request.supplier._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Update the request
      request.status = status || 'pending';
      if (message) {
        request.messages = request.messages || [];
        request.messages.push({ sender: 'supplier', text: message, date: new Date() });
      }

      await request.save();

      res.json({ success: true, request });
    } catch (error) {
      console.error('Respond to request error:', error);
      res.status(500).json({ error: 'Failed to respond to request' });
    }
  }

  // Get request details
  async getRequestDetails(req, res) {
    try {
      const { requestId } = req.params;
      
      const request = await Request.findById(requestId)
        .populate('customer', 'companyName email country')
        .populate('supplier', 'companyName email country');

      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      // Check if user has access to this request
      const userId = req.user._id.toString();
      if (request.customer._id.toString() !== userId && 
          request.supplier._id.toString() !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json({
        success: true,
        request
      });
    } catch (error) {
      console.error('Get request details error:', error);
      res.status(500).json({ error: 'Failed to fetch request details' });
    }
  }
}

module.exports = new RequestController();