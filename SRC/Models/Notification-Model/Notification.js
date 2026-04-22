// Models/Notification.js

import mongoose from 'mongoose';
import { backupDocument } from '../../Service/Backup-DB/backupService.js';
import { sendPush } from '../../Service/Notification/firebasePushService.js';

const notificationSchema = new mongoose.Schema({

  // ═══════════════════════════════════════════════════
  // RECIPIENT
  // ═══════════════════════════════════════════════════

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // ═══════════════════════════════════════════════════
  // TYPE
  // ═══════════════════════════════════════════════════

  type: {
    type: String,
    enum: [
      'job_match',
      'new_application',
      'application_accepted',
      'application_rejected',
      'job_completed',
      'job_cancelled',
      'job_closing_soon',
      'message',                    
      'follow',                     
      'review_received',            
      'payment_received',           
    ],
    required: true,
    index: true
  },

  // ═══════════════════════════════════════════════════
  // CONTENT
  // ═══════════════════════════════════════════════════

  title: {
    type: String,
    required: true,
    maxlength: 200
  },

  message: {
    type: String,
    required: true,
    maxlength: 500
  },

  // ═══════════════════════════════════════════════════
  // ✅ FIXED: RELATED DATA (Mixed type to allow navigation strings like "screen")
  // ═══════════════════════════════════════════════════

  data: {
    type: mongoose.Schema.Types.Mixed, // ✅ CHANGED from strict Object to Mixed!
    default: {}
  },

  // ═══════════════════════════════════════════════════
  // PUSH NOTIFICATION STATUS
  // ═══════════════════════════════════════════════════

  pushSent: {
    type: Boolean,
    default: false
  },

  pushError: {
    type: String,
    default: null
  },

  // ═══════════════════════════════════════════════════
  // READ STATUS
  // ═══════════════════════════════════════════════════

  isRead: {
    type: Boolean,
    default: false,
    index: true
  },

  readAt: {
    type: Date,
    default: null
  },

  senderDetails: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fullname: String,
    username: String,
    profilePicture: String,
    userType: { type: String, enum: ['employee', 'client'] },
    badge: {
      hasBadge: Boolean,
      badgeType: { type: String, enum: ['blue-verified', 'admin-verified', 'none'] },
      badgeLabel: String,
      blueVerified: { status: Boolean },
      adminVerified: { status: Boolean },
      tier: { type: String, enum: ['premium', 'verified', 'free'] },
    },
  },

  actionUrl: {
    type: String,
    default: null
  },

  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },

}, {
  timestamps: true
});

// ═══════════════════════════════════════════════════
// INDEXES
// ═══════════════════════════════════════════════════

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 24 * 60 * 60 }
);

// ═══════════════════════════════════════════════════
// INSTANCE METHODS
// ═══════════════════════════════════════════════════

notificationSchema.methods.markRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// ═══════════════════════════════════════════════════
// STATIC METHODS
// ═══════════════════════════════════════════════════

notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({ userId, isRead: false });
};

notificationSchema.statics.markAllRead = function (userId) {
  return this.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 🪝 HOOKS: Combined Backup + Auto-Push (Runs safely together)
// ═══════════════════════════════════════════════════════════════════════════

notificationSchema.pre('save', function () {
  this._wasNew = this.isNew;
});

notificationSchema.post('save', async function (doc, next) {
  
  // 1. Handle Auto-Push ONLY if it's a brand new document
  if (doc._wasNew) {
    
    // 🛑 SAFETY CHECK: Don't send push to yourself!
    const senderIdStr = doc.data?.senderId?.toString();
    const userIdStr = doc.userId?.toString();
    
    if (senderIdStr && senderIdStr === userIdStr) {
      // This is the user's own action, skip push.
      if (next) next();
      return; 
    }

    // Fire push in the background (don't block the DB save or backup)
    setImmediate(async () => {
      try {
        const pushData = {
          // Navigation
          screen: doc.data?.screen || 'Notifications',
          // IDs
          ...(doc.data?.jobId && { jobId: doc.data.jobId.toString() }),
          ...(doc.data?.applicationId && { applicationId: doc.data.applicationId.toString() }),
          ...(doc.data?.conversationId && { conversationId: doc.data.conversationId.toString() }),
          ...(doc.data?.senderId && { senderId: doc.data.senderId.toString() }),
          // Sender details for the popup UI
          ...(doc.data?.senderType && { senderType: doc.data.senderType }),
          ...(doc.data?.senderProfilePic && { senderProfilePic: doc.data.senderProfilePic }),
        };

       await sendPush({
  userId: doc.userId,
  title: doc.title,
  body: doc.message,
  data: pushData
});
        
        // Optional: Mark in DB that push was sent successfully
        // await Notification.updateOne({ _id: doc._id }, { $set: { pushSent: true } });

      } catch (pushError) {
        console.error(`❌ [Auto-Push Failed] Notif ${doc._id}:`, pushError.message);
        // Optional: Mark error in DB
        // await Notification.updateOne({ _id: doc._id }, { $set: { pushError: pushError.message } });
      }
    });
  }

  // 2. Handle Backup (Your existing logic, unchanged)
  try {
    await backupDocument('notifications', doc._wasNew ? 'create' : 'update', doc);
  } catch (err) {
    console.error('⚠️ [BACKUP] post.save failed (notifications):', err.message);
  }
  
  if (next) next();
});

notificationSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;
  try {
    await backupDocument('notifications', 'delete', doc);
  } catch (err) {
    console.error('⚠️ [BACKUP] post.findOneAndDelete failed (notifications):', err.message);
  }
});

notificationSchema.post('deleteOne', { document: true, query: false }, async function () {
  try {
    await backupDocument('notifications', 'delete', this);
  } catch (err) {
    console.error('⚠️ [BACKUP] post.deleteOne failed (notifications):', err.message);
  }
});

notificationSchema.post('findOneAndUpdate', async function (doc) {
  if (!doc) return;
  try {
    await backupDocument('notifications', 'update', doc);
  } catch (err) {
    console.error('⚠️ [BACKUP] post.findOneAndUpdate failed (notifications):', err.message);
  }
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;