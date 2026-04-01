// Controllers/employeeJob.Controller.js

import Job          from '../../../Models/USER-Auth/Client/Job.js';
import Application  from '../../../Models/USER-Auth/Employee/ApplicationModel.js';
import Employee     from '../../../Models/USER-Auth/Employee-Model.js';

import ImageValidator    from '../../../Service/Security/ImageValidator.js';
import DocumentValidator from '../../../Service/Security/DocumentValidator.js';
import validationService from '../../../Service/validationService.js';

import { uploadToR2, deleteFromR2 } from '../../../Config/r2Config.js';
import { sendNewApplicationNotificationEmail } from '../../../Email/emailService.js';
import path from 'path';

const imageValidator    = new ImageValidator();
const documentValidator = new DocumentValidator();

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Map AI/validation action strings → Mongoose enum values
// ─────────────────────────────────────────────────────────────────────────────
const mapValidationAction = (action) => {
  const map = {
    ALLOW:    'approved',
    APPROVE:  'approved',
    APPROVED: 'approved',
    FLAG:     'flagged',
    FLAGGED:  'flagged',
    BLOCK:    'rejected',
    REJECT:   'rejected',
    REJECTED: 'rejected',
    PENDING:  'pending',
  };
  return map[action?.toString().toUpperCase()] ?? 'pending';
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Delete a file from R2 (used for rollback)
// ─────────────────────────────────────────────────────────────────────────────
const rollbackR2Upload = async (r2Key) => {
  if (!r2Key) return;
  try {
    await deleteFromR2(r2Key);
    console.log(`🗑️  Rolled back R2 upload: ${r2Key}`);
  } catch (err) {
    console.warn(`⚠️  R2 rollback failed for "${r2Key}": ${err.message}`);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// GET ALL JOBS  (Employee only)
// ═══════════════════════════════════════════════════════════════════════════════
export const getAllJobs = async (req, res) => {
  try {
    console.log('\n🔍 ══════════════════════════════════════════════════');
    console.log('🔍  GET ALL JOBS — EMPLOYEE');
    console.log('🔍 ══════════════════════════════════════════════════\n');

    // ── 1. Auth ───────────────────────────────────────────────────────────────
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (req.userType !== 'employee') {
      return res.status(403).json({ success: false, message: 'Only employees can view jobs' });
    }

    console.log(`✅ Auth passed — ${req.user.fullname}\n`);

    // ── 2. Query params ───────────────────────────────────────────────────────
    const {
      page        = 1,
      limit       = 10,
      skill,
      needFor,
      minPrice,
      maxPrice,
      currency,
      tags,
      search,
      sortBy      = 'postedAt',
      sortOrder   = 'desc',
      closingSoon,           // ✅ NEW — filter jobs closing within 7 days
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page)  || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10));
    const skip     = (pageNum - 1) * limitNum;

    // ── 3. Build filter ───────────────────────────────────────────────────────
    const filter = { status: 'open', isActive: true };

    if (skill) {
      const skills = skill.split(',').map(s => s.trim()).filter(Boolean);
      if (skills.length) filter.requiredSkills = { $in: skills };
    }

    if (needFor && ['long-term', 'short-term'].includes(needFor)) {
      filter.needFor = needFor;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      const min = parseInt(minPrice);
      const max = parseInt(maxPrice);
      if (!isNaN(min) && min >= 0) filter.price.$gte = min;
      if (!isNaN(max) && max >  0) filter.price.$lte = max;
    }

    if (currency && ['INR', 'USD', 'EUR', 'GBP'].includes(currency)) {
      filter.currency = currency;
    }

    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (tagArray.length) filter.tags = { $in: tagArray };
    }

    if (search?.trim()) {
      filter.$or = [
        { jobTitle:    { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // ✅ NEW — Closing Soon: jobs with deadline within the next 7 days
    if (closingSoon === 'true') {
      const now  = new Date();
      const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      filter.deadline = { $gte: now, $lte: soon };
    }

    // ── 4. Sort ───────────────────────────────────────────────────────────────
    const validSortFields = ['postedAt', 'price', 'jobTitle', 'applicationsCount', 'deadline']; // ✅ deadline added
    const sortField       = validSortFields.includes(sortBy) ? sortBy : 'postedAt';
    const sort            = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

    // ── 5. Query DB ───────────────────────────────────────────────────────────
    const t0 = Date.now();

    const [jobs, totalCount] = await Promise.all([
      Job.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate({ path: 'userId',   select: 'fullname username profilePicture' })
        .populate({ path: 'clientId', select: 'companyName location profilePic bio isPremium' })
        .select('-validationResults -__v')
        .lean(),
      Job.countDocuments(filter),
    ]);

    console.log(`✅ ${jobs.length}/${totalCount} jobs fetched in ${Date.now() - t0}ms\n`);

    // ── 6. Format response ────────────────────────────────────────────────────
    const now           = new Date();
    const sevenDaysOut  = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const formattedJobs = jobs.map(job => ({
      id:                job._id,
      jobTitle:          job.jobTitle,
      description:       job.description,
      price:             job.price,
      currency:          job.currency,
      needFor:           job.needFor,
      status:            job.status,
      tags:              job.tags,
      requiredSkills:    job.requiredSkills,
      images:            job.images,
      applicationsCount: job.applicationsCount,
      postedAt:          job.postedAt,
      deadline:          job.deadline ?? null,                        // ✅ NEW
      isClosingSoon:     job.deadline                                 // ✅ NEW
                           ? job.deadline >= now && job.deadline <= sevenDaysOut
                           : false,
      daysUntilDeadline: job.deadline                                 // ✅ NEW — handy for frontend badge
                           ? Math.ceil((new Date(job.deadline) - now) / (1000 * 60 * 60 * 24))
                           : null,


client: job.clientId ? {
  id:          job.clientId._id,
  companyName: job.clientId.companyName,
  location:    job.clientId.location,
  profilePic:  job.clientId.profilePic,
  bio:         job.clientId.bio,
  // ── ADD THESE ↓
  isPremium:   job.clientId.isPremium ?? false,
  blueVerified: job.clientId.isPremium
    ? { status: true, icon: 'verified', color: '#0066FF', bg: '#EBF5FF', label: 'Premium Member' }
    : { status: false },
  tier: job.clientId.isPremium ? 'premium' : 'free',
} : null,


      postedBy: job.userId ? {
        id:             job.userId._id,
        fullname:       job.userId.fullname,
        username:       job.userId.username,
        profilePicture: job.userId.profilePicture,
      } : null,
    }));

    // ── 7. Return ─────────────────────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      message: jobs.length > 0 ? `Found ${jobs.length} job(s)` : 'No jobs found',
      data: {
        jobs: formattedJobs,
        pagination: {
          currentPage: pageNum,
          totalPages:  Math.ceil(totalCount / limitNum),
          totalJobs:   totalCount,
          jobsPerPage: limitNum,
          hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
          hasPrevPage: pageNum > 1,
        },
      },
    });

  } catch (error) {
    console.error('❌ GET ALL JOBS ERROR:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error:   error.message,
    });
  }
};
// ═══════════════════════════════════════════════════════════════════════════════
// GET JOB BY ID  (Employee only)
// ═══════════════════════════════════════════════════════════════════════════════
export const getJobById = async (req, res) => {
  try {
    console.log('\n🔍 ══════════════════════════════════════════════════');
    console.log('🔍  GET JOB BY ID — EMPLOYEE');
    console.log('🔍 ══════════════════════════════════════════════════\n');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (req.userType !== 'employee') {
      return res.status(403).json({ success: false, message: 'Only employees can view jobs' });
    }

    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    console.log(`✅ Auth passed — ${req.user.fullname}`);
    console.log(`📋 Fetching job: ${jobId}\n`);

    const job = await Job.findById(jobId)
      .populate({ path: 'userId',   select: 'fullname username profilePicture email' })
      .populate({ path: 'clientId', select: 'companyName location profilePic bio isPremium' })
      .select('-validationResults -__v')
      .lean();

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    console.log(`✅ Job found: ${job.jobTitle}\n`);

    // ── Check if employee already applied ──
    const userId      = req.userId;
    const alreadyApplied = await Application.exists({
      jobId:      jobId,
      employeeId: userId,
    });

    const formattedJob = {
      id:                job._id,
      jobTitle:          job.jobTitle,
      description:       job.description,
      price:             job.price,
      currency:          job.currency,
      needFor:           job.needFor,
      status:            job.status,
      isActive:          job.isActive,
      tags:              job.tags,
      requiredSkills:    job.requiredSkills,
      images:            job.images,
      videos:            job.videos,
      applicationsCount: job.applicationsCount,
      postedAt:          job.postedAt,
      alreadyApplied:    !!alreadyApplied,


client: job.clientId ? {
  id:          job.clientId._id,
  companyName: job.clientId.companyName,
  location:    job.clientId.location,
  profilePic:  job.clientId.profilePic,
  bio:         job.clientId.bio,
  // ── ADD THESE ↓
  isPremium:   job.clientId.isPremium ?? false,
  blueVerified: job.clientId.isPremium
    ? { status: true, icon: 'verified', color: '#0066FF', bg: '#EBF5FF', label: 'Premium Member' }
    : { status: false },
  tier: job.clientId.isPremium ? 'premium' : 'free',
} : null,


postedBy: job.userId ? {
  id:             job.userId._id,
  fullname:       job.userId.fullname,
  username:       job.userId.username,
  profilePicture: job.userId.profilePicture,
  profilePic:     job.clientId?.profilePic ?? null,  // ← yeh add karo
} : null,

    };

    return res.status(200).json({
      success: true,
      message: 'Job fetched successfully',
      data:    formattedJob,
    });

  } catch (error) {
    console.error('❌ GET JOB BY ID ERROR:', error.message);

    // Bad ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid job ID format' });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error:   error.message,
    });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// APPLY TO JOB  (Employee only)
// ═══════════════════════════════════════════════════════════════════════════════
export const applyToJob = async (req, res) => {

  let uploadedR2Key = null;

  try {
    console.log('\n📝 ══════════════════════════════════════════════════');
    console.log('📝  JOB APPLICATION');
    console.log('📝 ══════════════════════════════════════════════════\n');

    // ── 1. Auth ───────────────────────────────────────────────────────────────
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (req.userType !== 'employee') {
      return res.status(403).json({ success: false, message: 'Only employees can apply to jobs' });
    }

    const userId    = req.userId;
    const { jobId } = req.params;

    console.log(`✅ Auth passed`);
    console.log(`👤 ${req.user.fullname} (${req.user.email})`);
    console.log(`📋 Job: ${jobId}\n`);

    // ── 2. Job exists + is open ───────────────────────────────────────────────
    const job = await Job.findById(jobId).populate('userId clientId');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (!job.isActive || job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    console.log(`✅ Job verified: ${job.jobTitle}\n`);

    // ── 3. Parse body ─────────────────────────────────────────────────────────
    let applicationData;
    try {
      applicationData = req.body.data ? JSON.parse(req.body.data) : req.body;
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid JSON in request body' });
    }

    const { coverLetter, expectedSalary, availableFrom } = applicationData;

    // ── 4. Cover letter presence check ───────────────────────────────────────
    if (!coverLetter?.trim()) {
      return res.status(400).json({ success: false, message: 'Cover letter is required' });
    }

    console.log(`✅ Cover letter: ${coverLetter.length} chars\n`);

    // ── 5. Resume file presence + basic checks ────────────────────────────────
    if (!req.files?.resume?.[0]) {
      return res.status(400).json({ success: false, message: 'Resume file is required' });
    }

    const resumeFile = req.files.resume[0];

    console.log('📄 Resume:');
    console.log(`   Name : ${resumeFile.originalname}`);
    console.log(`   Size : ${(resumeFile.size / 1024).toFixed(2)} KB`);
    console.log(`   Type : ${resumeFile.mimetype}\n`);

    if (resumeFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success:     false,
        message:     'Resume must be under 5 MB',
        currentSize: `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB`,
      });
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (!allowedTypes.includes(resumeFile.mimetype)) {
      return res.status(400).json({
        success:  false,
        message:  'Resume must be PDF, DOC, DOCX, JPG, or PNG',
        received: resumeFile.mimetype,
      });
    }

    console.log('✅ File checks passed\n');

    // ── 6. Validate resume CONTENT (AI + OCR) ─────────────────────────────────
    // ⚠️  Must happen BEFORE duplicate check and BEFORE any DB write.
    //     If resume is blocked, the request dies here — nothing is saved.
    console.log('🔍 ══════════════════════════════════════════════════');
    console.log('🔍  RESUME CONTENT VALIDATION');
    console.log('🔍 ══════════════════════════════════════════════════\n');

    let resumeValidation;

    if (resumeFile.mimetype.startsWith('image/')) {
      console.log('📷 Mode: Image (OCR + AI)\n');
      resumeValidation = await imageValidator.validate(resumeFile.buffer, {
        userId,
        isProfilePic: false,
        filename:     resumeFile.originalname,
      });
    } else {
      console.log('📄 Mode: Document (pdf-parse + OCR + AI)\n');
      resumeValidation = await documentValidator.validate(resumeFile.buffer, {
        filename: resumeFile.originalname,
        mimetype: resumeFile.mimetype,
      });
    }

    console.log(`📊 Resume validation:`);
    console.log(`   Action     : ${resumeValidation.action}`);
    console.log(`   Confidence : ${resumeValidation.confidence}%`);
    console.log(`   Checked by : ${resumeValidation.checkedBy?.join(', ')}\n`);

    const resumeBlocked =
      resumeValidation.action  === 'BLOCK'    ||
      resumeValidation.action  === 'REJECTED' ||
      resumeValidation.blocked === true;

    if (resumeBlocked) {
      // ❌ Resume failed — stop here, nothing written to DB
      console.log('🚫 Resume BLOCKED — request rejected, no DB write\n');
      return res.status(400).json({
        success:    false,
        message:    'Your resume was rejected. Please remove any contact information (email, phone, links) and re-upload.',
        reason:     resumeValidation.reason,
        violations: resumeValidation.violations || [],
        tip:        'Skills, experience, education and tools are all allowed. Only contact details are prohibited.',
      });
    }

    console.log('✅ Resume content passed\n');

    // ── 7. Validate cover letter CONTENT ──────────────────────────────────────
    // ⚠️  Must also happen BEFORE duplicate check and BEFORE any DB write.
    console.log('📝 ══════════════════════════════════════════════════');
    console.log('📝  COVER LETTER VALIDATION');
    console.log('📝 ══════════════════════════════════════════════════\n');

    const coverLetterValidation = await validationService.validateBio(coverLetter);

    console.log(`📊 Cover letter validation:`);
    console.log(`   Action     : ${coverLetterValidation.action}`);
    console.log(`   Confidence : ${coverLetterValidation.confidence}%\n`);

    const coverLetterBlocked =
      coverLetterValidation.action  === 'BLOCK'    ||
      coverLetterValidation.action  === 'REJECTED' ||
      coverLetterValidation.blocked === true;

    if (coverLetterBlocked) {
      // ❌ Cover letter failed — stop here, nothing written to DB
      console.log('🚫 Cover letter BLOCKED — request rejected, no DB write\n');
      return res.status(400).json({
        success:    false,
        message:    'Your cover letter was rejected due to policy violations.',
        reason:     coverLetterValidation.reason,
        violations: coverLetterValidation.violations || [],
      });
    }

    console.log('✅ Cover letter passed\n');

    // ── 8. Duplicate check ────────────────────────────────────────────────────
    // ✅ Only runs after BOTH validations pass.
    //    A rejected application from a previous attempt never reaches this point,
    //    so the user is never falsely told "already applied".
    const existing = await Application.findOne({ jobId, employeeId: userId });
    if (existing) {
      return res.status(400).json({
        success:       false,
        message:       'You have already applied to this job',
        applicationId: existing._id,
        appliedAt:     existing.appliedAt,
      });
    }

    console.log('✅ No duplicate\n');

    // ── 9. Employee profile ───────────────────────────────────────────────────
    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Please complete your profile before applying' });
    }

    console.log('✅ Employee profile found\n');

    // ── 10. Upload resume to R2 ───────────────────────────────────────────────
    // ✅ Only runs after ALL checks pass — no wasted uploads on rejected requests
    console.log('📤 ══════════════════════════════════════════════════');
    console.log('📤  UPLOADING RESUME TO R2');
    console.log('📤 ══════════════════════════════════════════════════\n');

    const fileExt = path.extname(resumeFile.originalname).replace('.', '') || 'pdf';
    const r2Key   = `applications/${userId}/${jobId}/${Date.now()}-resume.${fileExt}`;

    let resumeUrl;
    try {
      resumeUrl     = await uploadToR2(resumeFile.buffer, r2Key, resumeFile.mimetype);
      uploadedR2Key = r2Key;
      console.log(`✅ Uploaded: ${resumeUrl}\n`);
    } catch (uploadErr) {
      console.error('❌ R2 upload failed:', uploadErr.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload resume. Please try again.',
      });
    }

    // ── 11. Save Application document ────────────────────────────────────────
    console.log('💾 ══════════════════════════════════════════════════');
    console.log('💾  SAVING APPLICATION');
    console.log('💾 ══════════════════════════════════════════════════\n');

    const application = new Application({
      jobId,
      employeeId:        userId,
      clientId:          job.userId,
      employeeProfileId: employee._id,

      applicantName:  req.user.fullname,
      applicantEmail: req.user.email,
      jobTitle:       job.jobTitle,

      coverLetter,
      expectedSalary: expectedSalary ? Number(expectedSalary) : undefined,
      availableFrom:  availableFrom  ? new Date(availableFrom) : undefined,

      resume: {
        url:        resumeUrl,
        filename:   resumeFile.originalname,
        mimetype:   resumeFile.mimetype,
        size:       resumeFile.size,
        uploadedAt: new Date(),
      },

      validationResults: {
        coverLetter: {
          action:     mapValidationAction(coverLetterValidation.action),
          confidence: coverLetterValidation.confidence || 0,
          violations: coverLetterValidation.violations || [],
          checkedAt:  new Date(),
        },
        resume: {
          action:     mapValidationAction(resumeValidation.action),
          confidence: resumeValidation.confidence  || 0,
          violations: resumeValidation.violations  || [],
          checkedBy:  resumeValidation.checkedBy   || [],
          ocrUsed:    !!resumeValidation.ocrResult,
          aiVerified: !!resumeValidation.aiResult,
          checkedAt:  new Date(),
        },
      },

      status:    'pending',
      appliedAt: new Date(),
    });

    try {
      await application.save();
      console.log(`✅ Application saved (ID: ${application._id})\n`);
    } catch (saveErr) {
      console.error('❌ Application save failed:', saveErr.message);
      await rollbackR2Upload(uploadedR2Key);
      uploadedR2Key = null;

      return res.status(500).json({
        success: false,
        message: 'Failed to save application. Your resume upload has been rolled back.',
        error:   process.env.NODE_ENV === 'development' ? saveErr.message : undefined,
      });
    }

    // ── 12. Update stats (atomic) ─────────────────────────────────────────────
    console.log('📊 Updating statistics...\n');

    try {
      await Promise.all([
        Job.updateOne(
          { _id: jobId },
          { $inc: { applicationsCount: 1 } }
        ),
        Employee.updateOne(
          { _id: employee._id },
          { $inc: { 'applicationStats.total': 1, 'applicationStats.pending': 1 } }
        ),
        req.user.constructor.updateOne(
          { _id: req.user._id },
          { $inc: { 'stats.totalApplications': 1 } }
        ),
      ]);
      console.log('✅ Stats updated\n');
    } catch (statsErr) {
      console.warn('⚠️  Stats update failed (non-fatal):', statsErr.message);
    }

    // ── 13. Notify client via email (non-blocking) ────────────────────────────
    const clientUser = job.userId;

    if (clientUser?.email) {
      const coverLetterPreview = coverLetter.length > 180
        ? coverLetter.substring(0, 180).trim() + '...'
        : coverLetter.trim();

      sendNewApplicationNotificationEmail(
        clientUser.email,
        clientUser.fullname                     || 'there',
        req.user.fullname,
        req.user.username || req.user.email.split('@')[0],
        job.jobTitle,
        jobId,
        application._id,
        expectedSalary                          || null,
        coverLetterPreview,
        req.user.profilePicture                 || null,
      ).then(() => {
        console.log(`   📧 Client notified: ${clientUser.email}`);
      }).catch(err => {
        console.error(`   ⚠️  Client notification failed (non-fatal): ${err.message}`);
      });
    } else {
      console.warn('   ⚠️  Client has no email address — notification skipped');
    }

    // ── 14. Success ───────────────────────────────────────────────────────────
    uploadedR2Key = null;

    console.log('\n📝 ══════════════════════════════════════════════════');
    console.log('📝  APPLICATION SUBMITTED SUCCESSFULLY');
    console.log('📝 ══════════════════════════════════════════════════\n');

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: {
        id:             application._id,
        jobId:          application.jobId,
        jobTitle:       job.jobTitle,
        applicantName:  application.applicantName,
        applicantEmail: application.applicantEmail,
        status:         application.status,
        appliedAt:      application.appliedAt,
        resume: {
          filename: application.resume.filename,
          url:      application.resume.url,
        },
      },
      validationResults: {
        coverLetter: {
          action:     mapValidationAction(coverLetterValidation.action),
          confidence: coverLetterValidation.confidence,
        },
        resume: {
          action:     mapValidationAction(resumeValidation.action),
          confidence: resumeValidation.confidence,
          checkedBy:  resumeValidation.checkedBy,
        },
      },
    });

  } catch (error) {
    console.error('\n❌ UNHANDLED APPLICATION ERROR\n', error);

    if (uploadedR2Key) {
      await rollbackR2Upload(uploadedR2Key);
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors:  messages,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied to this job',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again.',
      error:   process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};