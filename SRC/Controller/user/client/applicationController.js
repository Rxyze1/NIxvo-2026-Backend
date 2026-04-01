// Controllers/Client/applicationController.js

import Application from '../../../Models/USER-Auth/Employee/ApplicationModel.js';
import Job from '../../../Models/USER-Auth/Client/Job.js';
import {
  sendApplicationAccepted,
  sendApplicationRejected,
} from '../../../Email/emailService.js';
import validationService from '../../../Service/validationService.js';   // ✅ ADD


const buildBadge = (emp) => {
  
  const isPremium = emp?.blueVerified?.status ?? false;
  
  return {
    badge: emp?.hasBadge ? {
      show: true,
      type: emp.badgeType,
      label: emp.badgeLabel,
      icon: emp.badgeType === 'blue-verified' ? 'verified' : emp.badgeType === 'admin-verified' ? 'shield-check' : 'badge',
      color: emp.badgeType === 'blue-verified' ? '#0066FF' : emp.badgeType === 'admin-verified' ? '#00B37E' : '#888',
      bg: emp.badgeType === 'blue-verified' ? '#EBF5FF' : emp.badgeType === 'admin-verified' ? '#E6FAF5' : '#f0f0f0',
    } : { show: false },
    blueVerified: isPremium 
      ? { 
          status: true, 
          icon: 'verified', 
          color: '#0066FF', 
          bg: '#EBF5FF', 
          label: 'Premium Member' 
        } 
      : { status: false },
    adminVerified: { status: emp?.adminVerified?.status ?? false },
    tier: isPremium ? 'premium' : emp?.adminVerified?.status ? 'verified' : 'free',
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// ✅ SHARED: Validate message for contact info leaks
// ═══════════════════════════════════════════════════════════════════════════
const validateMessage = async (message) => {
  if (!message || typeof message !== 'string' || !message.trim()) return null;

  console.log('🔍 ══════════════════════════════════════');
  console.log('🔍  MESSAGE VALIDATION (Contact Leak Check)');
  console.log('🔍 ══════════════════════════════════════\n');

  const result = await validationService.validateContent(message, 'client_message');

  console.log(`📊 Result: blocked=${result.blocked}, source=${result.source}, confidence=${result.confidence}%`);
  if (result.matched?.length) console.log(`   Matched: ${result.matched.join(', ')}`);

  return result;
};


// ════════════════════════════════════════════════════════════════════════════
// 1️⃣  GET ALL APPLICANTS — (unchanged, no message input here)
// ════════════════════════════════════════════════════════════════════════════

export const getAllApplicants = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      status,
      page  = 1,
      limit = 50,
      sortBy = 'recent',
      search,
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page)  || 1);
    const limitNum = Math.max(1, parseInt(limit) || 50);

    console.log(`\n👥 Client ${userId} — fetching all applicants`);

    const jobs = await Job.find({ userId })
      .select('_id jobTitle price currency status needFor requiredSkills postedAt')
      .lean();

    if (jobs.length === 0) {
      return res.json({
        success:    true,
        count:      0,
        applicants: [],
        byJob:      [],
        message:    'No jobs posted yet',
      });
    }

    const jobIds = jobs.map(j => j._id);
    console.log(`   ✅ ${jobs.length} job(s) found\n`);

    const query = { jobId: { $in: jobIds } };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { applicantName:     { $regex: search, $options: 'i' } },
        { applicantEmail:    { $regex: search, $options: 'i' } },
        { applicantUsername: { $regex: search, $options: 'i' } },
      ];
    }

    const sortMap = {
      recent:        { appliedAt:      -1 },
      oldest:        { appliedAt:       1 },
      'budget-high': { proposedBudget: -1 },
      'budget-low':  { proposedBudget:  1 },
      name:          { applicantName:   1 },
    };
    const sortOption = sortMap[sortBy] || sortMap.recent;

    const totalCount = await Application.countDocuments(query);

    const applications = await Application.find(query)
      .populate({
        path:   'employeeProfileId',
        select: 'userId profilePic profileBannerImage bio skills experience hourlyRate verifiedBadge hasBadge badgeType badgeLabel blueVerified adminVerified subscription jobStats portfolio reviews availability',
        populate: [
          {
            path:   'userId',
            select: 'fullname username email phone profilePicture ratings stats wallet createdAt',
          },
          {
            path:   'subscription',
            select: 'plan subscriptionStatus planExpiresAt',
          },
        ],
      })
      .populate({
        path:   'employeeId',
        select: 'fullname username email phone profilePicture ratings stats wallet createdAt',
      })
      .populate({
        path:   'jobId',
        select: 'jobTitle price currency status needFor requiredSkills postedAt',
      })
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    console.log(`   ✅ ${applications.length} application(s) fetched\n`);

    const formattedApplicants = applications.map(app => {
      const ep   = app.employeeProfileId;
      const user = app.employeeId || ep?.userId;

      const epSub = ep?.subscription;
      const epIsPremium = !!(
        epSub &&
        typeof epSub === 'object' &&
        epSub.plan === 'premium' &&
        ['active', 'cancelled'].includes(epSub.subscriptionStatus) &&
        new Date() < new Date(epSub.planExpiresAt)
      );

      return {
        id:             app._id,
        status:         app.status,
        appliedAt:      app.appliedAt,
        updatedAt:      app.updatedAt,
        viewedByClient: app.viewedByClient || false,
        viewCount:      app.viewCount      || 0,

        job: {
          id:             app.jobId?._id,
          title:          app.jobTitle       || app.jobId?.jobTitle,
          budget:         app.jobId?.price,
          currency:       app.jobId?.currency,
          status:         app.jobId?.status,
          needFor:        app.jobId?.needFor,
          requiredSkills: app.jobId?.requiredSkills || [],
          postedAt:       app.jobId?.postedAt,
        },

        applicant: {
          id:                 user?._id              || app.employeeId,
          fullname:           user?.fullname          || app.applicantName,
          username:           user?.username          || app.applicantUsername,
          email:              user?.email             || app.applicantEmail,
          phone:              user?.phone,
          profilePicture:     ep?.profilePic          || user?.profilePicture || app.applicantProfilePicture,
          bannerImage:        ep?.profileBannerImage,
          memberSince:        user?.createdAt,
          rating:             user?.ratings?.average  || 0,
          ratingCount:        user?.ratings?.count    || 0,
          totalJobsCompleted: ep?.jobStats?.totalCompleted  || user?.stats?.jobsCompleted || 0,
          totalJobsApplied:   ep?.jobStats?.totalApplied    || 0,
          completionRate:     ep?.jobStats?.completionRate  || 0,
          successRate:        user?.stats?.successRate      || 0,
          totalEarnings:      user?.wallet?.totalEarnings   || 0,
        },

        employeeProfile: {
          bio:    ep?.bio    || '',
          skills: ep?.skills || [],

          experience: {
            totalYears:  ep?.experience?.totalYears  || 0,
            description: ep?.experience?.description || '',
          },

          hourlyRate: {
            amount:   ep?.hourlyRate?.amount   || 0,
            currency: ep?.hourlyRate?.currency || 'INR',
          },

          verifiedBadge: ep?.verifiedBadge || false,

          badge: ep?.hasBadge ? {
            show:   true,
            type:   ep.badgeType,
            label:  ep.badgeLabel,
            icon:   ep.badgeType === 'blue-verified'  ? 'verified'     :
                    ep.badgeType === 'admin-verified'  ? 'shield-check' : 'badge',
            color:  ep.badgeType === 'blue-verified'  ? '#0066FF'       :
                    ep.badgeType === 'admin-verified'  ? '#00B37E'       : '#888',
            bg:     ep.badgeType === 'blue-verified'  ? '#EBF5FF'       :
                    ep.badgeType === 'admin-verified'  ? '#E6FAF5'       : '#f0f0f0',
          } : { show: false },

          blueVerified: epIsPremium
            ? { status: true, icon: 'verified', color: '#0066FF', bg: '#EBF5FF', label: 'Premium Member' }
            : { status: false },

          adminVerified: { status: ep?.adminVerified?.status ?? false },
          tier: epIsPremium ? 'premium'
            : ep?.adminVerified?.status ? 'verified' : 'free',

          jobStats: {
            totalCompleted: ep?.jobStats?.totalCompleted || 0,
            totalApplied:   ep?.jobStats?.totalApplied   || 0,
            completionRate: ep?.jobStats?.completionRate || 0,
          },

          availability: {
            status:       ep?.availability?.status       || 'available',
            hoursPerWeek: ep?.availability?.hoursPerWeek || null,
          },

          portfolio: (ep?.portfolio || []).map(item => ({
            id:          item._id,
            title:       item.title       || 'Untitled Project',
            description: item.description || '',
            images:      item.images      || [],
            thumbnail:   item.images?.[0] || null,
            videos:      item.videos      || [],
            links:       item.links       || [],
            aiScanned:   item.aiScanned   || false,
            createdAt:   item.createdAt,
          })),

          portfolioCount: ep?.portfolio?.length || 0,

          reviews: (ep?.reviews || []).slice(0, 3).map(r => ({
            rating:    r.rating,
            comment:   r.comment,
            createdAt: r.createdAt,
          })),

          reviewCount: ep?.reviews?.length || 0,
        },

        proposal: {
          coverLetter:        app.coverLetter || '',
          coverLetterPreview: app.coverLetter
            ? app.coverLetter.substring(0, 200) + (app.coverLetter.length > 200 ? '...' : '')
            : '',
          coverLetterLength:    app.coverLetter?.length    || 0,
          proposedBudget:       app.proposedBudget         || app.expectedSalary || 0,
          deliveryTime:         app.deliveryTime           || '',
          portfolioLinks:       app.portfolioLinks         || [],
          hasExternalPortfolio: (app.portfolioLinks?.length || 0) > 0,
        },

        resume: app.resume ? {
          url:        app.resume.url,
          filename:   app.resume.filename,
          filesize:   app.resume.filesize || app.resume.size,
          mimetype:   app.resume.mimetype,
          uploadedAt: app.resume.uploadedAt,
          validation: app.resume.validation ? {
            status:     app.resume.validation.status,
            scannedAt:  app.resume.validation.scannedAt,
            confidence: app.resume.validation.confidence,
            violations: app.resume.validation.violations || [],
            reason:     app.resume.validation.reason,
          } : null,
          isValidated: !!app.resume.validation,
          isApproved:  app.resume.validation?.status === 'approved',
        } : null,

        hasResume: !!app.resume,

        actions: {
          canAccept:         app.status === 'pending',
          canReject:         app.status === 'pending',
          canViewDetails:    true,
          canViewResume:     !!app.resume,
          canDownloadResume: !!app.resume,
          canViewPortfolio:  (ep?.portfolio?.length || 0) > 0,
        },
      };
    });

    const jobMap = Object.fromEntries(jobs.map(j => [j._id.toString(), j]));

    const groupedByJob = Object.values(
      formattedApplicants.reduce((acc, app) => {
        const jobIdStr = app.job.id?.toString();
        if (!jobIdStr) return acc;

        if (!acc[jobIdStr]) {
          const jobMeta = jobMap[jobIdStr];
          acc[jobIdStr] = {
            job: {
              id:             jobMeta._id,
              title:          jobMeta.jobTitle,
              budget:         jobMeta.price,
              currency:       jobMeta.currency,
              status:         jobMeta.status,
              needFor:        jobMeta.needFor,
              requiredSkills: jobMeta.requiredSkills,
              postedAt:       jobMeta.postedAt,
            },
            applicantsCount: 0,
            pendingCount:    0,
            acceptedCount:   0,
            rejectedCount:   0,
            applicants:      [],
          };
        }

        acc[jobIdStr].applicants.push(app);
        acc[jobIdStr].applicantsCount += 1;
        if (app.status === 'pending')  acc[jobIdStr].pendingCount  += 1;
        if (app.status === 'accepted') acc[jobIdStr].acceptedCount += 1;
        if (app.status === 'rejected') acc[jobIdStr].rejectedCount += 1;

        return acc;
      }, {})
    );

    return res.json({
      success:    true,
      count:      formattedApplicants.length,
      applicants: formattedApplicants,
      byJob:      groupedByJob,

      pagination: {
        currentPage:  pageNum,
        itemsPerPage: limitNum,
        totalItems:   totalCount,
        totalPages:   Math.ceil(totalCount / limitNum),
        hasNextPage:  pageNum * limitNum < totalCount,
        hasPrevPage:  pageNum > 1,
      },

      summary: {
        totalApplications:  totalCount,
        totalJobs:          jobs.length,
        jobsWithApplicants: groupedByJob.length,
        pending:       formattedApplicants.filter(a => a.status === 'pending').length,
        accepted:      formattedApplicants.filter(a => a.status === 'accepted').length,
        rejected:      formattedApplicants.filter(a => a.status === 'rejected').length,
        withResume:    formattedApplicants.filter(a => a.hasResume).length,
        withPortfolio: formattedApplicants.filter(a => a.employeeProfile.portfolioCount > 0).length,
      },

      filters: { status: status || 'all', search: search || null, sortBy },
    });

  } catch (error) {
    console.error('❌ getAllApplicants error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch applicants',
      error:   error.message,
    });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// 2️⃣  ACCEPT APPLICATION
// ════════════════════════════════════════════════════════════════════════════

export const acceptApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const message = req.body?.message || null;
    const userId  = req.user._id;

    console.log(`\n✅ Accepting application ${applicationId}`);

    // ══════════════════════════════════════════════════════════
    // ✅ VALIDATE MESSAGE — before ANY DB write
    // ══════════════════════════════════════════════════════════
    const validation = await validateMessage(message);
    if (validation?.blocked) {
      console.log('🚫 Message BLOCKED — contact info leak detected\n');
      return res.status(400).json({
        success:    false,
        message:    'Your message contains contact information or off-platform redirect attempts. Please remove any emails, phone numbers, URLs, or social media handles and try again.',
        violations: validation.matched || [],
        reason:     validation.reason,
      });
    }
    console.log('✅ Message passed validation\n');

    const application = await Application.findById(applicationId)
      .populate({ path: 'jobId',      select: 'userId status selectedFreelancer jobTitle description price deliveryTime images needFor' })
      .populate({ path: 'employeeId', select: 'fullname email' });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (application.jobId.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (application.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Application already ${application.status}` });
    }
    if (application.jobId.selectedFreelancer) {
      return res.status(400).json({ success: false, message: 'Job already has a hired employee' });
    }

    // ── Accept ────────────────────────────────────────────────
    application.status = 'accepted';
    application.clientFeedback = {
      message:     message || 'Congratulations! Your application has been accepted.',
      decidedAt:   new Date(),
      respondedBy: userId,
    };
    await application.save();

    // ── Mark job as in-progress ───────────────────────────────
    await Job.findByIdAndUpdate(application.jobId._id, {
      status:             'in-progress',
      selectedFreelancer: application.employeeId._id,
      hiredAt:            new Date(),
    });

    // ── Bulk reject all other pending applications ─────────────
    const others = await Application.find({
      jobId:  application.jobId._id,
      status: 'pending',
      _id:    { $ne: applicationId },
    }).populate('employeeId', 'email fullname');

    await Application.updateMany(
      { _id: { $in: others.map(o => o._id) } },
      {
        status: 'rejected',
        clientFeedback: {
          message:   'Thank you for applying. We hired another candidate.',
          decidedAt: new Date(),
        },
      }
    );

    // ── Fire all emails in parallel ───────────────────────────
    const emailJobs = [
      sendApplicationAccepted(
        application.employeeId.email,
        application.employeeId.fullname,
        application.jobId.jobTitle,
        application.jobId.description     || 'No description provided',
        req.user.fullname,
        application.proposedBudget        || application.expectedSalary,
        application.deliveryTime          || application.jobId.deliveryTime || 'As discussed',
        application.jobId._id,
        message,
        application.jobId.images?.[0]     || null,
      ).catch(err => console.error(`   ⚠️  Accept email failed: ${err.message}`)),

      ...others.map(other =>
        sendApplicationRejected(
          other.employeeId.email,
          other.employeeId.fullname,
          application.jobId.jobTitle,
          application.jobId.description   || 'No description provided',
          req.user.fullname,
          other._id,
          'Thank you for applying. We hired another candidate.',
          application.jobId.images?.[0]   || null,
        ).catch(err => console.error(`   ⚠️  Reject email to ${other.employeeId.email} failed: ${err.message}`))
      ),
    ];

    await Promise.allSettled(emailJobs);
    console.log(`   📧 ${emailJobs.length} email(s) dispatched\n`);

    return res.json({
      success: true,
      message: 'Application accepted successfully',
      application: {
        id:            application._id,
        applicantName: application.applicantName,
        status:        application.status,
        autoRejected:  others.length,
      },
    });

  } catch (error) {
    console.error('❌ acceptApplication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to accept application',
      error:   error.message,
    });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// 3️⃣  REJECT APPLICATION
// ════════════════════════════════════════════════════════════════════════════

export const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const message = req.body?.message || null;
    const userId  = req.user._id;

    console.log(`\n🚫 Rejecting application ${applicationId}`);

    // ══════════════════════════════════════════════════════════
    // ✅ VALIDATE MESSAGE — before ANY DB write
    // ══════════════════════════════════════════════════════════
    const validation = await validateMessage(message);
    if (validation?.blocked) {
      console.log('🚫 Message BLOCKED — contact info leak detected\n');
      return res.status(400).json({
        success:    false,
        message:    'Your message contains contact information or off-platform redirect attempts. Please remove any emails, phone numbers, URLs, or social media handles and try again.',
        violations: validation.matched || [],
        reason:     validation.reason,
      });
    }
    console.log('✅ Message passed validation\n');

    const application = await Application.findById(applicationId)
      .populate({ path: 'jobId',      select: 'userId jobTitle description images' })
      .populate({ path: 'employeeId', select: 'fullname email' });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (application.jobId.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (application.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Application already ${application.status}` });
    }

    const finalMessage = message || 'Thank you for applying. We decided to proceed with another candidate.';

    application.status = 'rejected';
    application.clientFeedback = {
      message:     finalMessage,
      decidedAt:   new Date(),
      respondedBy: userId,
    };
    await application.save();

    sendApplicationRejected(
      application.employeeId.email,
      application.employeeId.fullname,
      application.jobId.jobTitle,
      application.jobId.description || 'No description provided',
      req.user.fullname,
      application._id,
      finalMessage,
      application.jobId.images?.[0] || null,
    ).then(() => {
      console.log(`   📧 Rejection email sent to ${application.employeeId.email}\n`);
    }).catch(err => {
      console.error(`   ⚠️  Email failed: ${err.message}`);
    });

    return res.json({
      success: true,
      message: 'Application rejected',
      application: {
        id:            application._id,
        applicantName: application.applicantName,
        status:        application.status,
      },
    });

  } catch (error) {
    console.error('❌ rejectApplication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reject application',
      error:   error.message,
    });
  }
};