/* backend/src/models/Batch.js */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const batchSchema = new Schema(
  {
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    // batch_id:   { type: String, required: true },      // external / ERP ID
    batch_id   : { type: String, required: true, unique:true },
    // item_code:  { type: String, required: true },
    products   : [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    land_plot:  { type: Schema.Types.ObjectId, ref: 'LandPlot' },  // optional link
    manufacturing_date: { type: Date },
    expiry_date:        { type: Date },
    harvest_date:       { type: Date },                // single date; extend to array if needed
    quantity:           { type: Number },
    unit:               { type: String, default: 'kg' }
  },
  { timestamps: true }
);
batchSchema.pre('validate', async function(next){
  if(this.batch_id) return next();
  const count = await mongoose.model('Batch').countDocuments();
  this.batch_id = 'BATCH' + String(count + 1).padStart(4,'0');   // BATCH0001
  next();
});
module.exports = mongoose.model('Batch', batchSchema);