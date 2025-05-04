import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'create', 'read', 'update', 'delete',
      'login', 'logout', 'access_denied',
      'file_upload', 'file_download',
      'report_generate', 'report_view',
      'evidence_add', 'evidence_edit',
      'case_create', 'case_update',
      'investigation_create', 'investigation_update',
      'suspect_add', 'suspect_update',
      'witness_add', 'witness_update'
    ]
  },
  entityType: {
    type: String,
    required: true,
    enum: [
      'user', 'case', 'crime', 'investigation',
      'evidence', 'suspect', 'witness',
      'report', 'court_case', 'police_station'
    ]
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  details: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
    changes: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  location: {
    address: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'warning'],
    default: 'success'
  },
  error: {
    message: String,
    stack: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog; 