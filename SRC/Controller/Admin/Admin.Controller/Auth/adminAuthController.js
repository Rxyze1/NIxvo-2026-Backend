// controllers/adminAuthController.js

// ✅ ADDED: mongoose import
import mongoose from 'mongoose';

import User       from '../../../../Models/USER-Auth/User-Auth.-Model.js';
import Official   from '../../../../Models/USER-Auth/Official-Model.js';
import OTP        from '../../../../Models/otpModel.js';
import RefreshToken from '../../../../Models/RefreshTokenModel.js';
import AdminLog   from '../../Models/AdminLogModel.js';
import { validateContent } from '../../../../Service/validationService.js';
import {
  sendSignupOTP,
  sendAdminApprovalNotification,
  sendAdminRejectionNotification,
} from '../../../../Email/emailService.js';
import { generateAccessToken, generateRefreshToken } from '../../../../Config/tokenUtils.js';
import {
  successResponse, errorResponse,
  unauthorizedResponse, forbiddenResponse,
} from '../../../../Config/responseUtils.js';
import { COOKIE_OPTIONS } from '../../../../Middleware/authMiddleware.js';
import bcrypt from 'bcryptjs';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS & HELPERS
// ═══════════════════════════════════════════════════════════════

const sanitizeEmail    = (email) => email.toLowerCase().trim();
const escapeRegex      = (str)   => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isValidEmail     = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
const isStrongPassword = (pwd)   =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/.test(pwd);

// ✅ ADDED: ObjectId validator function
const validateObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return mongoose.Types.ObjectId.isValid(id);
};

const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000;

const logger = {
  info:  (msg, data) => console.log  (`\n✅ ${msg}`, data ? JSON.stringify(data, null, 2) : ''),
  warn:  (msg, data) => console.warn (`\n⚠️  ${msg}`, data ? JSON.stringify(data, null, 2) : ''),
  error: (msg, data) => console.error(`\n❌ ${msg}`, data ? JSON.stringify(data, null, 2) : ''),
};

const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN:       'admin',
  MODERATOR:   'moderator',
};

const DEFAULT_PERMISSIONS = {
  super_admin: [
    'approve_admins', 'reject_admins',
    'approve_users',  'reject_users',
    'ban_users',      'delete_users',
    'view_all_users', 'view_analytics',
    'manage_settings','view_logs',
    'manage_admins',
  ],
  admin: [
    'approve_admins',
    'approve_users',  'reject_users',
    'ban_users',      'view_all_users',
    'view_analytics', 'view_logs',
  ],
  moderator: [
    'approve_users', 'reject_users', 'view_all_users',
  ],
};

// ─── Private helpers ──────────────────────────────────────────

const logAdminActivity = async (adminId, action, targetType, targetId, details = {}) => {
  try {
    await AdminLog.create({ adminId, action, targetType, targetId, details, timestamp: new Date() });
    await Official.findOneAndUpdate(
      { userId: adminId },
      {
        $push: {
          activityLog: {
            $each:  [{ action, targetUserId: targetId, reason: details.reason || '', timestamp: new Date() }],
            $slice: -100,
          },
        },
        $set: { 'audit.lastActivityAt': new Date() },
      }
    );
  } catch (err) {
    logger.error('Failed to log activity', err.message);
  }
};

const updateOfficialStats = async (adminId, statField) => {
  try {
    await Official.findOneAndUpdate(
      { userId: adminId },
      { $inc: { [`adminStats.${statField}`]: 1 } }
    );
  } catch (err) {
    logger.error('Failed to update stats', err.message);
  }
};

// ══════════════════════════════════════════════════════════════
// PUBLIC — No auth required
// ══════════════════════════════════════════════════════════════

export const adminSignup = async (req, res) => {
  try {
    const { fullname, username, email, password, phone, adminRole = 'admin' } = req.body;

    logger.info('👤 ADMIN SIGNUP REQUEST', { email, adminRole });

    if (!fullname || !username || !email || !password || !phone) {
      return errorResponse(res, 'All fields required: fullname, username, email, password, phone', 400);
    }

    const sanitizedPhone = String(phone).trim();
    if (sanitizedPhone.length < 10) {
      return errorResponse(res, 'Phone number must be at least 10 digits', 400);
    }

    if (adminRole === ADMIN_ROLES.SUPER_ADMIN) {
      logger.warn('🚫 BLOCKED: super_admin signup attempt via API', { email });
      return forbiddenResponse(
        res,
        'super_admin accounts are created manually by the system administrator only'
      );
    }

    const allowedRoles = [ADMIN_ROLES.ADMIN, ADMIN_ROLES.MODERATOR];
    if (!allowedRoles.includes(adminRole)) {
      return errorResponse(res, `Invalid role. Allowed: ${allowedRoles.join(', ')}`, 400);
    }

    if (fullname.length < 3 || fullname.length > 100) {
      return errorResponse(res, 'Fullname must be 3–100 characters', 400);
    }

    const fullnameCheck = await validateContent(fullname, 'fullname');
    if (fullnameCheck.blocked) {
      return errorResponse(res, 'Fullname contains invalid content', 400);
    }

    if (!/^[a-zA-Z0-9_]{3,15}$/.test(username)) {
      return errorResponse(res, 'Username: 3–15 chars, alphanumeric and underscore only', 400);
    }

    const usernameCheck = await validateContent(username, 'username');
    if (usernameCheck.blocked) {
      return errorResponse(res, 'Username contains invalid content', 400);
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, 'Invalid email format', 400);
    }

    const sanitizedEmail = sanitizeEmail(email);

    if (!isStrongPassword(password)) {
      return errorResponse(
        res,
        'Password: min 8 chars, must include uppercase, lowercase, number, and special char (@$!%*?&)',
        400
      );
    }

    const existingUser = await User.findOne({
      $or: [{ email: sanitizedEmail }, { username: username.toLowerCase() }],
    });

    if (existingUser) {
      return errorResponse(
        res,
        existingUser.email === sanitizedEmail ? 'Email already registered' : 'Username already taken',
        400
      );
    }

    const otpResult = await OTP.createNew(sanitizedEmail, 'registration', 'officials', {
      fullname:  fullname.trim(),
      username:  username.toLowerCase(),
      email:     sanitizedEmail,
      phone:     sanitizedPhone,
      password,
      adminRole,
    });

    if (!otpResult?.otp) {
      return errorResponse(res, 'Failed to generate OTP', 500);
    }

    await sendSignupOTP(sanitizedEmail, otpResult.otp, fullname);

    logger.info('✅ OTP sent', { email: sanitizedEmail, role: adminRole });

    return successResponse(
      res,
      {
        email:     sanitizedEmail,
        expiresIn: '10 minutes',
        note:      '⏳ After verification your account stays PENDING until Super Admin approves it',
      },
      'OTP sent to your email'
    );
  } catch (error) {
    logger.error('ADMIN SIGNUP ERROR', error.message);
    return errorResponse(res, 'Signup failed', 500);
  }
};

// ─────────────────────────────────────────────────────────────

export const verifyAdminSignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return errorResponse(res, 'Email and OTP required', 400);
    }

    const sanitizedEmail = sanitizeEmail(email);
    const result         = await OTP.verifyCode(sanitizedEmail, otp, 'registration');

    if (!result.success) {
      return errorResponse(res, result.message, 400);
    }

    const otpDoc = result.otpDoc;

    if (!otpDoc.fullname?.trim())  return errorResponse(res, 'Missing fullname in OTP session',  400);
    if (!otpDoc.username?.trim())  return errorResponse(res, 'Missing username in OTP session',  400);
    if (!otpDoc.password)          return errorResponse(res, 'Missing password in OTP session',  400);
    if (!otpDoc.adminRole)         return errorResponse(res, 'Missing adminRole in OTP session', 400);

    const existingUser = await User.findOne({
      $or: [{ email: sanitizedEmail }, { username: otpDoc.username.toLowerCase().trim() }],
    });

    if (existingUser) {
      return errorResponse(res, 'Account already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(otpDoc.password, 12);

    const adminUser = await User.create({
      fullname:        otpDoc.fullname.trim(),
      username:        otpDoc.username.toLowerCase().trim(),
      email:           sanitizedEmail,
      phone:           String(otpDoc.phone || '').trim(),
      password:        hashedPassword,
      userType:        'officials',
      role:            otpDoc.adminRole,
     status:          'pending',           // ✅ CRITICAL FIX
  isAdminVerified: false,                // ✅ ALSO ADD
  adminVerificationStatus: 'pending',    // ✅ ALSO ADD
      isEmailVerified: true,
      adminMetadata: {
        appliedAt:   new Date(),
        permissions: [],
      },
    });

    logger.info('✅ OFFICIAL CREATED (PENDING)', {
      id:    adminUser._id,
      email: adminUser.email,
      role:  adminUser.role,
    });

    try {
      await Official.create({
        userId: adminUser._id,
        audit:  { lastActivityAt: new Date(), failedLoginAttempts: 0 },
      });
    } catch (profileErr) {
      logger.error('Official profile creation failed', profileErr.message);
    }

    try {
      await OTP.deleteMany({ email: sanitizedEmail, purpose: 'registration' });
    } catch (cleanupErr) {
      logger.warn('OTP cleanup failed', cleanupErr.message);
    }

    User.find({ userType: 'officials', role: ADMIN_ROLES.SUPER_ADMIN, status: 'active' })
      .select('email fullname').lean()
      .then(supers => logger.info('Super admins to notify', { count: supers.length }))
      .catch(err => logger.warn('Super admin notification failed', err.message));

    return successResponse(
      res,
      {
        user: {
          id:       adminUser._id,
          fullname: adminUser.fullname,
          username: adminUser.username,
          email:    adminUser.email,
          role:     adminUser.role,
          status:   adminUser.status,
        },
        note: '⏳ Account PENDING. Waiting for Super Admin approval needed before you can login.',
      },
      'Account created. Awaiting Super Admin approval.'
    );
  } catch (error) {
    logger.error('VERIFY OTP ERROR', error.message);
    return errorResponse(res, 'Verification failed', 500);
  }
};

// ─────────────────────────────────────────────────────────────

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password required', 400);
    }

    const sanitizedEmail  = sanitizeEmail(email);
    const admin           = await User.findOne({ email: sanitizedEmail, userType: 'officials' }).select('+password');

    if (!admin) {
      return unauthorizedResponse(res, 'Invalid email or password');
    }

    const officialProfile = await Official.findOne({ userId: admin._id });

    if (officialProfile?.audit?.accountLockedUntil && new Date() < officialProfile.audit.accountLockedUntil) {
      return forbiddenResponse(res, 'Account temporarily locked. Try again later.');
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      if (officialProfile) {
        await Official.findOneAndUpdate(
          { userId: admin._id },
          { $inc: { 'audit.failedLoginAttempts': 1 } }
        );
      }
      return unauthorizedResponse(res, 'Invalid email or password');
    }

    if (!admin.isEmailVerified) {
      return forbiddenResponse(res, 'Please verify your email first');
    }

    const STATUS_BLOCKS = {
      pending:   '⏳ Account PENDING Super Admin approval. Cannot login until approved.',
      rejected:  `❌ Application REJECTED. Reason: "${admin.adminMetadata?.rejectionReason || 'Not provided'}". Contact support.`,
      suspended: '🚫 Account SUSPENDED. Contact Super Admin.',
      banned:    '🚫 Account BANNED. Contact Super Admin.',
    };

    if (STATUS_BLOCKS[admin.status]) {
      logger.warn(`🚫 LOGIN BLOCKED: ${admin.status}`, { email: sanitizedEmail });
      return forbiddenResponse(res, STATUS_BLOCKS[admin.status]);
    }

    if (admin.status !== 'active') {
      return forbiddenResponse(res, `Cannot login. Account status: ${admin.status}`);
    }

    const accessToken  = generateAccessToken(admin._id.toString(), admin.userType, admin.email, admin.role);
    const refreshToken = generateRefreshToken(admin._id.toString(), admin.userType, admin.email, admin.role);

    if (!accessToken || !refreshToken) {
      return errorResponse(res, 'Token generation failed', 500);
    }

    res.cookie('accessToken',  accessToken,  COOKIE_OPTIONS.ACCESS_TOKEN);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS.REFRESH_TOKEN);

    await RefreshToken.create({
      token:     refreshToken,
      userId:    admin._id,
      userAgent: req.headers['user-agent'] || 'Unknown',
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN),
      isRevoked: false,
    });

    admin.lastLogin  = new Date();
    admin.lastActive = new Date();
    await admin.save({ validateBeforeSave: false });

    if (officialProfile) {
      await Official.findOneAndUpdate(
        { userId: admin._id },
        {
          $set: {
            'audit.lastLoginAt':         new Date(),
            'audit.lastActivityAt':      new Date(),
            'audit.failedLoginAttempts': 0,
            'audit.accountLockedUntil':  null,
          },
        }
      );
    }

    await logAdminActivity(admin._id, 'LOGIN', 'admin', admin._id, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    logger.info('✅ LOGIN SUCCESS', { id: admin._id, email: admin.email, role: admin.role });

    return successResponse(
      res,
      {
        user: {
          id:          admin._id,
          fullname:    admin.fullname,
          username:    admin.username,
          email:       admin.email,
          userType:    admin.userType,
          role:        admin.role,
          status:      admin.status,
          permissions: admin.adminMetadata?.permissions || [],
        },
      },
      'Login successful'
    );
  } catch (error) {
    logger.error('ADMIN LOGIN ERROR', error.message);
    return errorResponse(res, 'Login failed', 500);
  }
};

// ══════════════════════════════════════════════════════════════
// PROTECTED ROUTES
// ══════════════════════════════════════════════════════════════

export const getPendingAdmins = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const cappedLimit = Math.min(parseInt(limit, 10) || 20, 100);
    const pageNum = Math.max(1, parseInt(page, 10) || 1);

    const query = {
      userType: 'officials',
      status: 'pending',
      role: { $ne: ADMIN_ROLES.SUPER_ADMIN },
    };

    if (search && typeof search === 'string' && search.trim()) {
      const safe = escapeRegex(search.trim());
      query.$or = [
        { fullname: { $regex: safe, $options: 'i' } },
        { email: { $regex: safe, $options: 'i' } },
        { username: { $regex: safe, $options: 'i' } },
      ];
    }

    const [totalCount, pendingAdmins] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .select('fullname username email phone role createdAt adminMetadata')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * cappedLimit)
        .limit(cappedLimit)
        .lean(),
    ]);

    return successResponse(res, {
      count: pendingAdmins.length,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / cappedLimit),
      admins: pendingAdmins.map(a => ({
        id: a._id.toString(),
        fullname: a.fullname,
        username: a.username,
        email: a.email,
        phone: a.phone,
        role: a.role,
        appliedAt: a.adminMetadata?.appliedAt || a.createdAt,
      })),
    }, `${totalCount} pending official application(s)`);
  } catch (error) {
    logger.error('GET PENDING ADMINS ERROR', error);
    return errorResponse(res, `Failed to retrieve pending officials: ${error.message}`, 500);
  }
};

// ─────────────────────────────────────────────────────────────

export const approveAdmin = async (req, res) => {
  try {
    const { adminIdToApprove } = req.params;
    const superAdminId = req.user._id;

    // ✅ Validate ObjectId
    if (!validateObjectId(adminIdToApprove)) {
      return errorResponse(res, 'Invalid admin ID format', 400);
    }

    const official = await User.findOne({
      _id: adminIdToApprove,
      userType: 'officials',
      status: 'pending',
      role: { $ne: ADMIN_ROLES.SUPER_ADMIN },
    });

    if (!official) {
      return errorResponse(res, 'Pending official not found or already processed', 404);
    }

    const permissions = DEFAULT_PERMISSIONS[official.role] || DEFAULT_PERMISSIONS.moderator;

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const officialInTx = await User.findOne({
          _id: adminIdToApprove,
          userType: 'officials',
          status: 'pending',
        }).session(session);

        if (!officialInTx) {
          throw new Error('Official already processed by another admin');
        }

        officialInTx.status = 'active';
        officialInTx.isAdminVerified = true;
        officialInTx.adminVerificationStatus = 'approved';
        officialInTx.adminMetadata = {
          ...officialInTx.adminMetadata,
          approvedAt: new Date(),
          approvedBy: superAdminId,
          permissions,
        };
        await officialInTx.save({ session });

        // ✅ FIXED: Proper Official profile creation
        const profileExists = await Official.findOne({ 
          userId: adminIdToApprove 
        }).session(session);
        
        if (!profileExists) {
          const newProfile = new Official({
            userId: adminIdToApprove,
            audit: { lastActivityAt: new Date() }
          });
          await newProfile.save({ session });
        }
      });
    } catch (txErr) {
      logger.error('TRANSACTION ERROR IN APPROVE', txErr.message);
      if (txErr.message === 'Official already processed by another admin') {
        return errorResponse(res, 'Official already processed', 409);
      }
      throw txErr;
    } finally {
      await session.endSession();
    }

    logger.info('✅ OFFICIAL APPROVED', { id: adminIdToApprove, role: official.role });

    await logAdminActivity(superAdminId, 'APPROVE_ADMIN', 'admin', adminIdToApprove, {
      approvedRole: official.role,
      approvedEmail: official.email,
      permissions,
    });

    await updateOfficialStats(superAdminId, 'usersVerified');

    sendAdminApprovalNotification(official.email, official.fullname, official.role).catch((err) => {
      logger.warn('Approval email failed', err.message);
    });

    return successResponse(res, {
      admin: {
        id: official._id,
        fullname: official.fullname,
        email: official.email,
        role: official.role,
        status: 'active',
        permissions,
        approvedAt: new Date(),
      },
    }, '✅ Official approved. They can now login.');
  } catch (error) {
    logger.error('APPROVE OFFICIAL ERROR', error.message);
    return errorResponse(res, 'Failed to approve official', 500);
  }
};

// ─────────────────────────────────────────────────────────────

export const adminApproveAdmin = async (req, res) => {
  try {
    const { adminIdToApprove } = req.params;
    const approvingAdminId = req.user._id;

    // ✅ Validate ObjectId
    if (!validateObjectId(adminIdToApprove)) {
      return errorResponse(res, 'Invalid admin ID format', 400);
    }

    const official = await User.findOne({
      _id: adminIdToApprove,
      userType: 'officials',
      status: 'pending',
      role: { $ne: ADMIN_ROLES.SUPER_ADMIN },
    });

    if (!official) {
      return errorResponse(res, 'Pending official not found or already processed', 404);
    }

    const permissions = DEFAULT_PERMISSIONS[official.role] || DEFAULT_PERMISSIONS.moderator;

    // ✅ Use transaction
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const officialInTx = await User.findOne({
          _id: adminIdToApprove,
          userType: 'officials',
          status: 'pending',
        }).session(session);

        if (!officialInTx) {
          throw new Error('Official already processed by another admin');
        }

        officialInTx.status = 'active';
        officialInTx.isAdminVerified = true;
        officialInTx.adminVerificationStatus = 'approved';
        officialInTx.adminMetadata = {
          ...officialInTx.adminMetadata,
          approvedAt: new Date(),
          approvedBy: approvingAdminId,
          permissions,
        };
        await officialInTx.save({ session });

        // ✅ FIXED: Proper Official profile creation
        const profileExists = await Official.findOne({ 
          userId: adminIdToApprove 
        }).session(session);
        
        if (!profileExists) {
          const newProfile = new Official({
            userId: adminIdToApprove,
            audit: { lastActivityAt: new Date() }
          });
          await newProfile.save({ session });
        }
      });
    } catch (txErr) {
      logger.error('TRANSACTION ERROR IN PEER APPROVE', txErr.message);
      if (txErr.message === 'Official already processed by another admin') {
        return errorResponse(res, 'Official already processed', 409);
      }
      throw txErr;
    } finally {
      await session.endSession();
    }

    logger.info('✅ OFFICIAL PEER APPROVED', { 
      id: adminIdToApprove, 
      by: approvingAdminId 
    });

    await logAdminActivity(approvingAdminId, 'APPROVE_ADMIN', 'admin', adminIdToApprove, {
      approvedRole: official.role,
      approvedEmail: official.email,
      permissions,
    });

    await updateOfficialStats(approvingAdminId, 'usersVerified');

    sendAdminApprovalNotification(official.email, official.fullname, official.role)
      .catch((err) => logger.warn('Approval email failed', err.message));

    return successResponse(
      res,
      {
        admin: {
          id: official._id,
          fullname: official.fullname,
          email: official.email,
          role: official.role,
          status: 'active',
          permissions,
          approvedAt: new Date(),
        },
      },
      '✅ Official approved. They can now login.'
    );
  } catch (error) {
    logger.error('PEER APPROVE ERROR', error.message);
    return errorResponse(res, 'Failed to approve official', 500);
  }
};

// ─────────────────────────────────────────────────────────────

export const rejectAdmin = async (req, res) => {
  try {
    const { adminIdToReject } = req.params;
    const { reason } = req.body;
    const superAdminId = req.user._id;

    // ✅ Validate ObjectId
    if (!validateObjectId(adminIdToReject)) {
      return errorResponse(res, 'Invalid admin ID format', 400);
    }

    // ✅ Validate reason
    if (!reason || reason.trim().length < 10) {
      return errorResponse(res, 'Rejection reason of at least 10 characters required', 400);
    }

    const official = await User.findOne({
      _id: adminIdToReject,
      userType: 'officials',
      status: 'pending',
    });

    if (!official) {
      return errorResponse(res, 'Pending official not found or already processed', 404);
    }

    const rejectionReason = reason.trim();

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const officialInTx = await User.findOne({
          _id: adminIdToReject,
          userType: 'officials',
          status: 'pending',
        }).session(session);

        if (!officialInTx) {
          throw new Error('Official already processed');
        }

        officialInTx.status = 'rejected';
        officialInTx.adminVerificationStatus = 'rejected';
        officialInTx.adminMetadata = {
          ...officialInTx.adminMetadata,
          rejectedAt: new Date(),
          rejectedBy: superAdminId,
          rejectionReason,
        };
        await officialInTx.save({ session });
      });
    } finally {
      await session.endSession();
    }

    logger.info('✅ OFFICIAL REJECTED', { id: adminIdToReject, reason: rejectionReason });

    await logAdminActivity(superAdminId, 'REJECT_ADMIN', 'admin', adminIdToReject, {
      reason: rejectionReason,
      rejectedEmail: official.email,
    });

    sendAdminRejectionNotification(official.email, official.fullname, rejectionReason).catch((err) => {
      logger.warn('Rejection email failed', err.message);
    });

    return successResponse(res, {
      admin: {
        id: official._id,
        fullname: official.fullname,
        email: official.email,
        status: 'rejected',
        rejectionReason,
      },
    }, 'Official application rejected');
  } catch (error) {
    logger.error('REJECT OFFICIAL ERROR', error.message);
    return errorResponse(res, 'Failed to reject official', 500);
  }
};

// ─────────────────────────────────────────────────────────────

export const getAllUsers = async (req, res) => {
  try {
    const { userType, status, page = 1, limit = 20, search } = req.query;
    const cappedLimit = Math.min(parseInt(limit, 10) || 20, 100);
    const pageNum = Math.max(1, parseInt(page, 10) || 1);

    const query = { userType: { $in: ['employee', 'client'] } };

    if (userType && ['employee', 'client'].includes(userType)) {
      query.userType = userType;
    }

    const VALID_STATUSES = ['pending', 'active', 'rejected', 'suspended', 'banned', 'frozen'];
    if (status && VALID_STATUSES.includes(status)) {
      query.status = status;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const safe = escapeRegex(search.trim());
      query.$or = [
        { fullname: { $regex: safe, $options: 'i' } },
        { username: { $regex: safe, $options: 'i' } },
        { email: { $regex: safe, $options: 'i' } },
      ];
    }

    const totalCount = await User.countDocuments(query);
    const users = await User.find(query)
      .select('fullname username email phone userType status createdAt lastLogin')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * cappedLimit)
      .limit(cappedLimit)
      .lean();

    return successResponse(res, {
      count: users.length,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / cappedLimit),
      users: users.map(u => ({
        id: u._id,
        fullname: u.fullname,
        username: u.username,
        email: u.email,
        phone: u.phone,
        userType: u.userType,
        status: u.status,
        joinedAt: u.createdAt,
        lastLogin: u.lastLogin,
      })),
    }, 'Users retrieved successfully');
  } catch (error) {
    logger.error('GET ALL USERS ERROR', error.message);
    return errorResponse(res, 'Failed to retrieve users', 500);
  }
};

// ─────────────────────────────────────────────────────────────

export const getAdminDashboard = async (req, res) => {
  try {
    const adminId = req.user._id;

    const [
      totalEmployees, totalClients,
      activeUsers,    pendingUsers,
      rejectedUsers,  bannedUsers,
      totalAdmins,    activeAdmins,
      pendingAdmins,  officialProfile,
    ] = await Promise.all([
      User.countDocuments({ userType: 'employee' }),
      User.countDocuments({ userType: 'client' }),
      User.countDocuments({ userType: { $in: ['employee', 'client'] }, status: 'active' }),
      User.countDocuments({ userType: { $in: ['employee', 'client'] }, status: 'pending' }),
      User.countDocuments({ userType: { $in: ['employee', 'client'] }, status: 'rejected' }),
      User.countDocuments({ userType: { $in: ['employee', 'client'] }, status: { $in: ['banned', 'suspended'] } }),
      User.countDocuments({ userType: 'officials', role: { $ne: ADMIN_ROLES.SUPER_ADMIN } }),
      User.countDocuments({ userType: 'officials', status: 'active',  role: { $ne: ADMIN_ROLES.SUPER_ADMIN } }),
      User.countDocuments({ userType: 'officials', status: 'pending' }),
      Official.findOne({ userId: adminId }).lean(),
    ]);

    return successResponse(
      res,
      {
        statistics: {
          users: {
            total:     totalEmployees + totalClients,
            employees: totalEmployees,
            clients:   totalClients,
            active:    activeUsers,
            pending:   pendingUsers,
            rejected:  rejectedUsers,
            banned:    bannedUsers,
          },
          admins: {
            total:   totalAdmins,
            active:  activeAdmins,
            pending: pendingAdmins,
          },
        },
        myStats: officialProfile?.adminStats || {
          usersVerified:     0,
          ticketsResolved:   0,
          disputesResolved:  0,
          usersStrikes:      0,
          usersBanned:       0,
          performanceRating: 0,
        },
      },
      'Dashboard data retrieved'
    );
  } catch (error) {
    logger.error('ADMIN DASHBOARD ERROR', error.message);
    return errorResponse(res, 'Failed to retrieve dashboard data', 500);
  }
};

// ─────────────────────────────────────────────────────────────

export const getMyProfile = async (req, res) => {
  try {
    const adminId = req.user._id;

    const [admin, officialProfile] = await Promise.all([
      User.findById(adminId).select('-password').lean(),
      Official.findOne({ userId: adminId }).lean(),
    ]);

    if (!admin) {
      return errorResponse(res, 'Admin not found', 404);
    }

    return successResponse(
      res,
      {
        admin: {
          id:          admin._id,
          fullname:    admin.fullname,
          username:    admin.username,
          email:       admin.email,
          phone:       admin.phone,
          userType:    admin.userType,
          role:        admin.role,
          status:      admin.status,
          permissions: admin.adminMetadata?.permissions || [],
          createdAt:   admin.createdAt,
          lastLogin:   admin.lastLogin,
          approvedAt:  admin.adminMetadata?.approvedAt,
          approvedBy:  admin.adminMetadata?.approvedBy,
        },
        officialProfile: officialProfile || null,
      },
      'Profile retrieved'
    );
  } catch (error) {
    logger.error('GET MY PROFILE ERROR', error.message);
    return errorResponse(res, 'Failed to retrieve profile', 500);
  }
};

// ─────────────────────────────────────────────────────────────

export const getMyActivity = async (req, res) => {
  try {
    const adminId     = req.user._id;
    const { page = 1, limit = 20 } = req.query;
    const cappedLimit = Math.min(parseInt(limit, 10) || 20, 100);
    const pageNum = Math.max(1, parseInt(page, 10) || 1);

    const officialProfile = await Official.findOne({ userId: adminId }).select('activityLog').lean();

    if (!officialProfile) {
      return errorResponse(res, 'Official profile not found', 404);
    }

    const sorted     = (officialProfile.activityLog || [])
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const totalCount = sorted.length;
    const startIndex = (pageNum - 1) * cappedLimit;

    return successResponse(
      res,
      {
        count:       Math.min(cappedLimit, Math.max(0, totalCount - startIndex)),
        totalCount,
        page:        pageNum,
        totalPages:  Math.ceil(totalCount / cappedLimit),
        activityLog: sorted.slice(startIndex, startIndex + cappedLimit),
      },
      'Activity log retrieved'
    );
  } catch (error) {
    logger.error('GET MY ACTIVITY ERROR', error.message);
    return errorResponse(res, 'Failed to retrieve activity', 500);
  }
};

// ─────────────────────────────────────────────────────────────

export const getAdminLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, targetType, adminFilter } = req.query;
    const cappedLimit = Math.min(parseInt(limit, 10) || 50, 200);
    const pageNum = Math.max(1, parseInt(page, 10) || 1);

    const query = {};
    if (action) query.action = action;
    if (targetType) query.targetType = targetType;
    if (adminFilter) {
      // ✅ Also validate ObjectId for adminFilter
      if (validateObjectId(adminFilter)) {
        query.adminId = adminFilter;
      }
    }

    const totalCount = await AdminLog.countDocuments(query);
    const logs = await AdminLog.find(query)
      .populate('adminId', 'fullname username email role')
      .sort({ timestamp: -1 })
      .skip((pageNum - 1) * cappedLimit)
      .limit(cappedLimit)
      .lean();

    return successResponse(res, {
      count: logs.length,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / cappedLimit),
      logs,
    }, 'Logs retrieved');
  } catch (error) {
    logger.error('GET ADMIN LOGS ERROR', error.message);
    return errorResponse(res, 'Failed to retrieve logs', 500);
  }
};

// ─────────────────────────────────────────────────────────────

export const adminLogout = async (req, res) => {
  try {
    const adminId      = req.user._id;
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
     await RefreshToken.revokeAllForUser(adminId)
    }

    const clearOptions = {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path:     '/',
    };

     res.clearCookie('accessToken',  COOKIE_OPTIONS.ACCESS_TOKEN);
    res.clearCookie('refreshToken', COOKIE_OPTIONS.REFRESH_TOKEN);

    await logAdminActivity(adminId, 'LOGOUT', 'admin', adminId);

    return successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    logger.error('ADMIN LOGOUT ERROR', error.message);
    return errorResponse(res, 'Logout failed', 500);
  }
};

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
  adminSignup, verifyAdminSignupOTP, adminLogin, adminLogout,
  getPendingAdmins, approveAdmin, rejectAdmin, adminApproveAdmin,
  getAllUsers, getMyProfile, getMyActivity, getAdminDashboard, getAdminLogs,
};