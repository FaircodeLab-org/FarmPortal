// /* backend/src/models/LandPlot.js */

// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const landPlotSchema = new Schema(
//   {
//     supplier: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       index: true
//     },
//     plot_id:      { type: String, required: true },   // external / ERP ID
//     name:         { type: String },
//     country:      { type: String },
//     commodities:  [{ type: String }],
//     area:         { type: Number },                   // hectares
//     latitude:     { type: Number },
//     longitude:    { type: Number },
//     geojson:      { type: Schema.Types.Mixed },       // full polygon (optional)
//     surveyDate:   { type: Date },
//     deforestationStatus: { type: String, default: 'unknown' }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('LandPlot', landPlotSchema);
/* backend/src/models/LandPlot.js */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const landPlotSchema = new Schema(
  {
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    plot_id:      { type: String, required: true },   
    name:         { type: String },
    country:      { type: String },
    commodities:  [{ type: String }],
    area:         { type: Number },                   
    latitude:     { type: Number },
    longitude:    { type: Number },
    geojson:      { type: Schema.Types.Mixed },       
    surveyDate:   { type: Date },
    deforestationStatus: { type: String, default: 'unknown' },
    // ADD THIS:
    products: [{
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }],
    // backend/src/models/LandPlot.js
// Add these fields to your schema:
    deforestationData: {
      percentage: { type: Number, default: 0 },
      deforestedArea: { type: Number, default: 0 }, // in hectares
      deforestedPolygons: { type: Schema.Types.Mixed }, // GeoJSON for deforested areas
      lastAnalyzed: { type: Date },
      post2020: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LandPlot', landPlotSchema);