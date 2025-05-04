import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  system: {
    name: {
      type: String,
      default: 'Crime Records Management System'
    },
    version: String,
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    maintenanceMessage: String,
    backupSchedule: {
      frequency: String,
      time: String,
      retention: Number
    },
    security: {
      passwordPolicy: {
        minLength: Number,
        requireUppercase: Boolean,
        requireLowercase: Boolean,
        requireNumbers: Boolean,
        requireSpecialChars: Boolean,
        expirationDays: Number
      },
      sessionTimeout: Number,
      maxLoginAttempts: Number,
      ipWhitelist: [String],
      twoFactorAuth: {
        enabled: Boolean,
        required: Boolean
      }
    },
    notifications: {
      email: {
        enabled: Boolean,
        smtp: {
          host: String,
          port: Number,
          secure: Boolean,
          username: String,
          password: String
        }
      },
      sms: {
        enabled: Boolean,
        provider: String,
        apiKey: String
      },
      push: {
        enabled: Boolean,
        provider: String,
        apiKey: String
      }
    },
    fileStorage: {
      maxFileSize: Number,
      allowedTypes: [String],
      storageProvider: String,
      s3: {
        bucket: String,
        region: String,
        accessKey: String,
        secretKey: String
      }
    },
    analytics: {
      enabled: Boolean,
      retentionPeriod: Number,
      anonymizeData: Boolean
    },
    auditLog: {
      enabled: Boolean,
      retentionPeriod: Number
    }
  },
  caseManagement: {
    autoCaseNumber: {
      enabled: Boolean,
      prefix: String,
      format: String
    },
    defaultStatus: String,
    allowedStatuses: [String],
    requiredFields: [String],
    evidence: {
      chainOfCustody: {
        required: Boolean,
        verificationSteps: [String]
      },
      storage: {
        location: String,
        accessControl: [String]
      }
    }
  },
  investigation: {
    defaultPriority: String,
    allowedPriorities: [String],
    taskTemplates: [{
      name: String,
      description: String,
      checklist: [String]
    }],
    reportTemplates: [{
      name: String,
      fields: [String]
    }]
  },
  court: {
    defaultStatus: String,
    allowedStatuses: [String],
    hearingTypes: [String],
    documentTemplates: [{
      name: String,
      type: String,
      content: String
    }]
  },
  userInterface: {
    theme: {
      primaryColor: String,
      secondaryColor: String,
      darkMode: Boolean
    },
    dashboard: {
      defaultLayout: String,
      widgets: [String]
    },
    language: {
      default: String,
      available: [String]
    }
  },
  api: {
    enabled: Boolean,
    rateLimit: {
      windowMs: Number,
      max: Number
    },
    allowedOrigins: [String],
    apiKeys: [{
      key: String,
      name: String,
      permissions: [String],
      expiresAt: Date
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
settingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings; 