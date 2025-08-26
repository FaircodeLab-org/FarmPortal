const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  supplier : { type: Schema.Types.ObjectId, ref: 'User', required:true, index:true },
  name     : { type: String, required:true },
  code     : { type: String, required:true, unique:true },
  uom      : { type: String, default:'kg' },
  landPlots: [{ type: Schema.Types.ObjectId, ref: 'LandPlot' }],   // optional
  origin   : { type: String, enum:['manual','erp'], default:'manual' }
},{ timestamps:true });

module.exports = model('Product', productSchema);