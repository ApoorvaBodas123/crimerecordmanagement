import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'case_update', 'investigation_update',
      'evidence_added', 'report_submitted',
      'witness_statement', 'suspect_update',
      'court_date', 'task_assigned',
      'system_alert', 'message'
    ]
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedTo: {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case'
    },
    crime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crime'
    },
    investigation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investigation'
    },
    evidence: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evidence'
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report'
    }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  readAt: Date,
  actionUrl: String,
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification; 