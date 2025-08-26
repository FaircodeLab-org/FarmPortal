/* backend/src/models/AuditLog.js */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action:          { type: String, required: true },  // CREATE / UPDATE / DELETE / SYNC / LOGIN etc.
    collectionName:  { type: String, required: true },
    documentId:      { type: String, required: true },
    before:          { type: Schema.Types.Mixed },      // previous state (for updates)
    after:           { type: Schema.Types.Mixed },      // new state
    ip:              { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);