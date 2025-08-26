// const mongoose = require('mongoose');

// const requestSchema = new mongoose.Schema({
//   requestType: {
//     type: String,
//     enum: ['land_plot', 'product_data', 'purchase_order', 'cbam_emission'],
//     required: true
//   },
//   customer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   supplier: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'in_progress', 'completed', 'rejected'],
//     default: 'pending'
//   },
//   requestedProducts: [{
//     productCode: String,
//     productName: String,
//     quantity: Number,
//     unit: String,
//     requiredBy: Date
//   }],
//   message: String,
//   responseData: {
//     type: mongoose.Schema.Types.Mixed,
//     default: null
//   },
//   respondedAt: Date,
//   validityDate: Date,
//   automationEnabled: {
//     type: Boolean,
//     default: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Request', requestSchema);
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requestType: {
    type: String,
    enum: ['land_plot', 'product_data', 'purchase_order', 'cbam_emission'],
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'rejected'],
    default: 'pending'
  },
  requestedProducts: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    productCode: String,
    productName: String,
    quantity: Number,
    unit: String,
    requiredBy: Date
  }],
  message: String,
  responseData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  // ADD THESE for EUDR:
  selectedLandPlots: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LandPlot'
  }],
  eudrCompliance: {
    questionnaire: mongoose.Schema.Types.Mixed,
    certifications: [String],
    uploadedFiles: [String]
  },
  respondedAt: Date,
  validityDate: Date,
  automationEnabled: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Request', requestSchema);