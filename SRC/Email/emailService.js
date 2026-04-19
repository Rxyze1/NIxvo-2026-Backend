// services/Email/emailService.js
import { emailConfig, appConfig } from './emailConfig.js';


import nodemailer from 'nodemailer';
import {
    otpSignupTemplate,
    otpLoginTemplate,
    otpResendTemplate,
    welcomeEmployeeTemplate,
    welcomeClientTemplate,
    employeeApprovalTemplate,
    employeeRejectionTemplate,
    passwordResetTemplate,
    passwordResetSuccessTemplate,
    strikeWarningTemplate,
    accountBannedTemplate,
    paymentReceivedTemplate,
    paymentSentTemplate,
    paymentRefundTemplate,
    paymentFailedTemplate,
    accountDeletionTemplate,
    emailChangeVerificationTemplate,
    lowBalanceWarningTemplate,
    applicationAcceptedTemplate,
    applicationRejectedTemplate,

    adminWelcomeTemplate,
    adminRejectionTemplate,
    adminApprovalTemplate,

    
    subscriptionActivatedTemplate,
    subscriptionExpiringTemplate,
    subscriptionCancelledTemplate,
    subscriptionRenewedTemplate,
    subscriptionPaymentFailedTemplate,



escrowCreatedTemplate,
escrowFundedTemplate,
workDeliveredTemplate,
escrowReversedTemplate,
escrowDisputedTemplate,
disputeResolvedTemplate,
withdrawalRequestedTemplate,



    

    

    jobMatchTemplate,
    newApplicationTemplate,
    jobCompletedTemplate,
    sendNewApplicationNotification,



    jobClosingSoonTemplate
   
} from './emailTemplates.js';

import {
    subscriptionPaymentInvoiceTemplate,
    subscriptionRefundCreditNoteTemplate,
    escrowPaymentInvoiceTemplate,
    escrowReleaseReceiptTemplate,
    escrowRefundCreditNoteTemplate,

    

} from './paymentEmailTemplates.js';




/**
 * ════════════════════════════════════════════════════════════════
 *                    📧 EMAIL SERVICE INITIALIZATION
 *              Uses Mailtrap SMTP (Port 587)
 * ════════════════════════════════════════════════════════════════
 */

console.log('');
console.log('════════════════════════════════════════════════════════════════');
console.log('📧 EMAIL SERVICE INITIALIZATION');
console.log('════════════════════════════════════════════════════════════════');
console.log(`🌐 SMTP Host:     ${emailConfig.host}`);
console.log(`🔌 Port:          ${emailConfig.port}`);
console.log(`📤 From Email:    ${emailConfig.from.email}`);
console.log(`📛 From Name:     ${emailConfig.from.name}`);
console.log(`🔑 Mailtrap User: ${emailConfig.auth.user ? '✅ Configured' : '❌ Missing'}`);
console.log(`🔑 Mailtrap Pass: ${emailConfig.auth.pass ? '✅ Configured' : '❌ Missing'}`);
console.log('════════════════════════════════════════════════════════════════');
console.log('');

/**
 * ═══════════════════════════════════════════════════════════════
 *                      BASE SEND FUNCTION (AWS SES SMTP)
 * ═══════════════════════════════════════════════════════════════
 */

// Create transporter once outside the function for performance
const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
    },
    tls: {
        rejectUnauthorized: false, // Keeps it simple, works on most servers
    },
});

const sendEmail = async ({ to, subject, html, text = '', category = 'General' }) => {
    try {
        console.log(`📧 Sending: ${subject} → ${to}`);

        const mailOptions = {
            from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
            to: to,
            subject: subject,
            html: html,
            text: text || subject,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error(`❌ Email failed: ${to} - ${error.message}`);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};


/**
 * ═══════════════════════════════════════════════════════════════
 *                   OTP EMAILS (3 FUNCTIONS)
 * ═══════════════════════════════════════════════════════════════
 */

// 1. Signup OTP

export const sendSignupOTP = async (email, otp, fullname) => {
    const html = otpSignupTemplate(otp, fullname);
    return await sendEmail({
        to: email,
        subject: `${otp} is your verification code - ${appConfig.appName}`,
        html,
        category: 'OTP - Signup',
    });
};

// 2. Login OTP
export const sendLoginOTP = async (email, otp, fullname) => {
    const html = otpLoginTemplate(otp, fullname);
    return await sendEmail({
        to: email,
        subject: `${otp} is your login code - ${appConfig.appName}`,
        html,
        category: 'OTP - Login',
    });
};

// 3. Resend OTP
export const sendResendOTP = async (email, otp, fullname, attemptCount) => {
    const html = otpResendTemplate(otp, fullname, attemptCount);
    return await sendEmail({
        to: email,
        subject: `${otp} is your new verification code - ${appConfig.appName}`,
        html,
        category: 'OTP - Resend',
    });
};

/**
 * ═══════════════════════════════════════════════════════════════
 *                   WELCOME EMAILS (2 FUNCTIONS)
 * ═══════════════════════════════════════════════════════════════
 */

// 4. Welcome Employee
export const sendWelcomeEmployee = async (email, fullname) => {
    const html = welcomeEmployeeTemplate(fullname);
    return await sendEmail({
        to: email,
        subject: `Welcome to ${appConfig.appName}! 🎉`,
        html,
        category: 'Welcome - Employee',
    });
};

// 5.5 Welcome Email (Unified - Chooses based on userType)
export const sendWelcomeEmail = async (email, fullname, userType) => {
    if (userType === 'employee') {
        return await sendWelcomeEmployee(email, fullname);
    } else if (userType === 'client') {
        return await sendWelcomeClient(email, fullname);
    } else {
        // Default to client if unknown type
        return await sendWelcomeClient(email, fullname);
    }
};

// 5. Welcome Client
export const sendWelcomeClient = async (email, fullname) => {
    const html = welcomeClientTemplate(fullname);
    return await sendEmail({
        to: email,
        subject: `Welcome to ${appConfig.appName}! 🎉`,
        html,
        category: 'Welcome - Client',
    });
};

/**
 * ═══════════════════════════════════════════════════════════════
 *                   ACCOUNT MANAGEMENT (2 FUNCTIONS)
 * ═══════════════════════════════════════════════════════════════
 */

// 6. Employee Approval
export const sendEmployeeApproval = async (email, fullname) => {
    const html = employeeApprovalTemplate(fullname);
    return await sendEmail({
        to: email,
        subject: `Your account has been approved! ✅ - ${appConfig.appName}`,
        html,
        category: 'Account - Approval',
    });
};

// 7. Employee Rejection
export const sendEmployeeRejection = async (email, fullname, reason) => {
    const html = employeeRejectionTemplate(fullname, reason);
    return await sendEmail({
        to: email,
        subject: `Application Update - ${appConfig.appName}`,
        html,
        category: 'Account - Rejection',
    });
};

/**
 * ═══════════════════════════════════════════════════════════════
 *                   PASSWORD MANAGEMENT (2 FUNCTIONS)
 * ═══════════════════════════════════════════════════════════════
 */

// 8. Password Reset Request
export const sendPasswordResetOTP = async (email, fullname, resetToken) => {
    const html = passwordResetTemplate(fullname, resetToken);
    return await sendEmail({
        to: email,
        subject: `Reset Your Password - ${appConfig.appName}`,
        html,
        category: 'Password - Reset',
    });
};

// 9. Password Reset Success
export const sendPasswordResetSuccess = async (email, fullname, ipAddress, location) => {
    const html = passwordResetSuccessTemplate(fullname, ipAddress, location);
    return await sendEmail({
        to: email,
        subject: `Password Changed Successfully - ${appConfig.appName}`,
        html,
        category: 'Password - Success',
    });
};

/**
 * ═══════════════════════════════════════════════════════════════
 *                   SECURITY ALERTS (2 FUNCTIONS)
 * ═══════════════════════════════════════════════════════════════
 */

// 10. Strike Warning
export const sendStrikeWarning = async (email, fullname, strikeCount, reason, freezeDuration = null) => {
    const html = strikeWarningTemplate(fullname, strikeCount, reason, freezeDuration);
    return await sendEmail({
        to: email,
        subject: `⚠️ Account Warning: Strike ${strikeCount}/3 - ${appConfig.appName}`,
        html,
        category: 'Security - Strike',
    });
};

// 11. Account Banned
export const sendAccountBanned = async (email, fullname, reason) => {
    const html = accountBannedTemplate(fullname, reason);
    return await sendEmail({
        to: email,
        subject: `Account Suspended - ${appConfig.appName}`,
        html,
        category: 'Security - Ban',
    });
};

/**
 * ═══════════════════════════════════════════════════════════════
 *                   PAYMENT NOTIFICATIONS (4 FUNCTIONS)
 * ═══════════════════════════════════════════════════════════════
 */

// 12. Payment Received (Employee)
export const sendPaymentReceived = async (email, fullname, amount, projectName, transactionId, clientName) => {
    const html = paymentReceivedTemplate(fullname, amount, projectName, transactionId, clientName);
    return await sendEmail({
        to: email,
        subject: `💰 Payment Received: ₹${amount.toLocaleString('en-IN')} - ${appConfig.appName}`,
        html,
        category: 'Payment - Received',
    });
};

// 13. Payment Sent (Client)
export const sendPaymentSent = async (email, fullname, amount, projectName, transactionId, employeeName) => {
    const html = paymentSentTemplate(fullname, amount, projectName, transactionId, employeeName);
    return await sendEmail({
        to: email,
        subject: `✅ Payment Processed: ₹${amount.toLocaleString('en-IN')} - ${appConfig.appName}`,
        html,
        category: 'Payment - Sent',
    });
};

// 14. Payment Refund
export const sendPaymentRefund = async (email, fullname, amount, projectName, reason, transactionId) => {
    const html = paymentRefundTemplate(fullname, amount, projectName, reason, transactionId);
    return await sendEmail({
        to: email,
        subject: `🔄 Refund Processed: ₹${amount.toLocaleString('en-IN')} - ${appConfig.appName}`,
        html,
        category: 'Payment - Refund',
    });
};

// 15. Payment Failed
export const sendPaymentFailed = async (email, fullname, amount, projectName, reason) => {
    const html = paymentFailedTemplate(fullname, amount, projectName, reason);
    return await sendEmail({
        to: email,
        subject: `❌ Payment Failed - ${appConfig.appName}`,
        html,
        category: 'Payment - Failed',
    });
};

/**
 * ═══════════════════════════════════════════════════════════════
 *                   ADDITIONAL NOTIFICATIONS (3 FUNCTIONS)
 * ═══════════════════════════════════════════════════════════════
 */

// 16. Account Deletion
export const sendAccountDeletion = async (email, fullname) => {
    const html = accountDeletionTemplate(fullname);
    return await sendEmail({
        to: email,
        subject: `Account Deleted - ${appConfig.appName}`,
        html,
        category: 'Account - Deletion',
    });
};

// 17. Email Change Verification
export const sendEmailChangeVerification = async (newEmail, fullname, verificationCode) => {
    const html = emailChangeVerificationTemplate(fullname, newEmail, verificationCode);
    return await sendEmail({
        to: newEmail,
        subject: `Verify Your New Email - ${appConfig.appName}`,
        html,
        category: 'Account - Email Change',
    });
};

// 18. Low Balance Warning
export const sendLowBalanceWarning = async (email, fullname, currentBalance, projectName) => {
    const html = lowBalanceWarningTemplate(fullname, currentBalance, projectName);
    return await sendEmail({
        to: email,
        subject: `⚠️ Low Balance Alert - ${appConfig.appName}`,
        html,
        category: 'Payment - Low Balance',
    });
};



/**
 * ═══════════════════════════════════════════════════════════════
 *                   APPLICATION NOTIFICATIONS (2 FUNCTIONS)
 * ═══════════════════════════════════════════════════════════════
 */

// 19. Application Accepted
export const sendApplicationAccepted = async (
    email, 
    employeeName, 
    jobTitle, 
    jobDescription, 
    clientName, 
    budget, 
    deliveryTime,
    jobId,
    clientMessage = null,
    jobImage = null
) => {
    const html = applicationAcceptedTemplate(
        employeeName,
        jobTitle,
        jobDescription,
        clientName,
        budget,
        deliveryTime,
        jobId,
        clientMessage,
        jobImage
    );
    
    return await sendEmail({
        to: email,
        subject: `🎉 Congratulations! You've Been Hired for "${jobTitle}" - ${appConfig.appName}`,
        html,
        category: 'Application - Accepted',
    });
};

// 20. Application Rejected
export const sendApplicationRejected = async (
    email, 
    employeeName, 
    jobTitle, 
    jobDescription, 
    clientName,
    applicationId,
    clientMessage = null,
    jobImage = null
) => {
    const html = applicationRejectedTemplate(
        employeeName,
        jobTitle,
        jobDescription,
        clientName,
        applicationId,
        clientMessage,
        jobImage
    );
    
    return await sendEmail({
        to: email,
        subject: `📋 Application Update: ${jobTitle} - ${appConfig.appName}`,
        html,
        category: 'Application - Rejected',
    });
};







// 21. Subscription Activated (Simple notification)
export const sendSubscriptionActivated = async (
    email, 
    fullname, 
    planName, 
    planPrice, 
    startDate, 
    endDate, 
    features,
    invoiceNumber,
    transactionId
) => {
    const html = subscriptionActivatedTemplate(
        fullname,
        planName,
        planPrice,
        startDate,
        endDate,
        features,
        invoiceNumber,
        transactionId
    );
    
    return await sendEmail({
        to: email,
        subject: `🎉 ${planName} Activated Successfully - ${appConfig.appName}`,
        html,
        category: 'Subscription - Activated',
    });
};

// 22. Subscription Expiring Soon
export const sendSubscriptionExpiring = async (
    email, 
    fullname, 
    planName, 
    endDate, 
    daysRemaining,
    autoRenewEnabled
) => {
    const html = subscriptionExpiringTemplate(
        fullname,
        planName,
        endDate,
        daysRemaining,
        autoRenewEnabled
    );
    
    return await sendEmail({
        to: email,
        subject: `⏰ ${planName} Expires in ${daysRemaining} Days - ${appConfig.appName}`,
        html,
        category: 'Subscription - Expiring',
    });
};

// 23. Subscription Cancelled
export const sendSubscriptionCancelled = async (
    email, 
    fullname, 
    planName, 
    endDate,
    reason = null
) => {
    const html = subscriptionCancelledTemplate(
        fullname,
        planName,
        endDate,
        reason
    );
    
    return await sendEmail({
        to: email,
        subject: `Subscription Cancelled - ${appConfig.appName}`,
        html,
        category: 'Subscription - Cancelled',
    });
};

// 24. Subscription Renewed
export const sendSubscriptionRenewed = async (
    email, 
    fullname, 
    planName, 
    planPrice, 
    newEndDate,
    invoiceNumber,
    transactionId
) => {
    const html = subscriptionRenewedTemplate(
        fullname,
        planName,
        planPrice,
        newEndDate,
        invoiceNumber,
        transactionId
    );
    
    return await sendEmail({
        to: email,
        subject: `✅ ${planName} Renewed Successfully - ${appConfig.appName}`,
        html,
        category: 'Subscription - Renewed',
    });
};

// 25. Subscription Payment Failed
export const sendSubscriptionPaymentFailed = async (
    email, 
    fullname, 
    planName, 
    planPrice,
    endDate,
    reason,
    retryUrl = null
) => {
    const html = subscriptionPaymentFailedTemplate(
        fullname,
        planName,
        planPrice,
        endDate,
        reason,
        retryUrl
    );
    
    return await sendEmail({
        to: email,
        subject: `❌ Payment Failed - Action Required - ${appConfig.appName}`,
        html,
        category: 'Subscription - Payment Failed',
    });
};

// 26. Subscription Payment Invoice (Detailed invoice with GST)
export const sendSubscriptionInvoice = async (email, invoiceData) => {
    const html = subscriptionPaymentInvoiceTemplate(invoiceData);
    return await sendEmail({
        to: email,
        subject: `📄 Invoice #${invoiceData.invoiceNumber} - ${invoiceData.planName} - ${appConfig.appName}`,
        html,
        category: 'Subscription - Invoice',
    });
};

// 27. Subscription Refund Credit Note
export const sendSubscriptionRefundCreditNote = async (email, creditNoteData) => {
    const html = subscriptionRefundCreditNoteTemplate(creditNoteData);
    return await sendEmail({
        to: email,
        subject: `🔄 Credit Note #${creditNoteData.creditNoteNumber} - Refund Processed - ${appConfig.appName}`,
        html,
        category: 'Subscription - Refund',
    });
};

/**
 * ════════════════════════════════════════════════════════════════
 *                   ADDITIONAL EMAIL FUNCTIONS CAN BE ADDED HERE
 * ════════════════════════════════════════════════════════════════
 */


/**
 * ═══════════════════════════════════════════════════════════════
 *                   ADMIN/OFFICIAL NOTIFICATIONS (3 FUNCTIONS)
 * ═══════════════════════════════════════════════════════════════
 */

// 28. Admin Account Approved
export const sendAdminApprovalNotification = async (email, fullname, role, permissions = []) => {
    const html = adminApprovalTemplate(fullname, role, permissions);
    return await sendEmail({
        to: email,
        subject: `✅ Admin Account Approved - Welcome to ${appConfig.appName}!`,
        html,
        category: 'Admin - Approval',
    });
};

// 29. Admin Account Rejected
export const sendAdminRejectionNotification = async (email, fullname, reason) => {
    const html = adminRejectionTemplate(fullname, reason);
    return await sendEmail({
        to: email,
        subject: `Admin Application Update - ${appConfig.appName}`,
        html,
        category: 'Admin - Rejection',
    });
};

// 30. Admin Welcome Email (Optional - can be sent on first login)
export const sendAdminWelcomeEmail = async (email, fullname, role) => {
    const html = adminWelcomeTemplate(fullname, role);
    return await sendEmail({
        to: email,
        subject: `🎉 Welcome to the Admin Team - ${appConfig.appName}`,
        html,
        category: 'Admin - Welcome',
    });
};




// ─────────────────────────────────────────────────────────────
// 31. Job Match Notification (Employee)
// ─────────────────────────────────────────────────────────────
export const sendJobMatchNotification = async (
  email,
  employeeName,
  jobTitle,
  needFor,
  currency,
  price,
  requiredSkills,
  clientName,
  jobId
) => {
  const html = jobMatchTemplate(
    employeeName,
    jobTitle,
    needFor,
    currency,
    price,
    requiredSkills,
    clientName,
    jobId
  );
  return await sendEmail({
    to: email,
    subject: `🎯 New Job Match: ${jobTitle} - ${appConfig.appName}`,
    html,
    category: 'Job - Match Notification'
  });
};

// ─────────────────────────────────────────────────────────────
// 32. New Application Received (Client)
// ─────────────────────────────────────────────────────────────
export const sendNewApplicationToClient = async (
  email,
  clientName,
  applicantName,
  jobTitle,
  jobId,
  applicantSkills = []
) => {
  const html = newApplicationTemplate(
    clientName,
    applicantName,
    jobTitle,
    jobId,
    applicantSkills
  );
  return await sendEmail({
    to: email,
    subject: `📩 New Application on: ${jobTitle} - ${appConfig.appName}`,
    html,
    category: 'Job - New Application'
  });
};

// ─────────────────────────────────────────────────────────────
// 33. Job Completed (Client + Employee — role decides content)
// ─────────────────────────────────────────────────────────────
export const sendJobCompleted = async (email, userName, jobTitle, role, jobId) => {
  const html = jobCompletedTemplate(userName, jobTitle, role, jobId);
  return await sendEmail({
    to: email,
    subject: `🎉 Job Completed: ${jobTitle} - ${appConfig.appName}`,
    html,
    category: 'Job - Completed'
  });
};



// ─────────────────────────────────────────────────────────────
// 40. Escrow Payment Invoice — sent to client when escrow funded
// ─────────────────────────────────────────────────────────────
export const sendEscrowPaymentInvoice = async (email, invoiceData) => {
  const html = escrowPaymentInvoiceTemplate(invoiceData);
  return await sendEmail({
    to:       email,
    subject:  `📄 Invoice #${invoiceData.invoiceNumber} — Escrow Funded: ${invoiceData.jobTitle} - ${appConfig.appName}`,
    html,
    category: 'Escrow - Payment Invoice',
  });
};

// ─────────────────────────────────────────────────────────────
// 41. Escrow Release Receipt — sent to employee when paid
// ─────────────────────────────────────────────────────────────
export const sendEscrowReleaseReceipt = async (email, receiptData) => {
  const html = escrowReleaseReceiptTemplate(receiptData);
  return await sendEmail({
    to:       email,
    subject:  `💰 Payment Receipt #${receiptData.receiptNumber} — ₹${Number(receiptData.netAmount).toLocaleString('en-IN')} Credited - ${appConfig.appName}`,
    html,
    category: 'Escrow - Release Receipt',
  });
};


// ── ADD to default export ─────────────────────────────────────

  // ...all your existing exports...


// ─────────────────────────────────────────────────────────────
// 34. Escrow Created — employee notified
// ─────────────────────────────────────────────────────────────
export const sendEscrowCreated = async (
  email,
  employeeName,
  clientName,
  jobTitle,
  amount,
  escrowId
) => {
  const html = escrowCreatedTemplate(employeeName, clientName, jobTitle, amount, escrowId);
  return await sendEmail({
    to:       email,
    subject:  `🔔 New Job Escrow Created: ${jobTitle} - ${appConfig.appName}`,
    html,
    category: 'Escrow - Created',
  });
};

// ─────────────────────────────────────────────────────────────
// 35. Escrow Funded — employee notified, start work
// ─────────────────────────────────────────────────────────────
export const sendEscrowFunded = async (
  email,
  employeeName,
  clientName,
  jobTitle,
  amount,
  escrowId
) => {
  const html = escrowFundedTemplate(employeeName, clientName, jobTitle, amount, escrowId);
  return await sendEmail({
    to:       email,
    subject:  `✅ Escrow Funded — Start Working: ${jobTitle} - ${appConfig.appName}`,
    html,
    category: 'Escrow - Funded',
  });
};

// ─────────────────────────────────────────────────────────────
// 36. Work Delivered — client notified to review and release
// ─────────────────────────────────────────────────────────────
export const sendWorkDelivered = async (
  email,
  clientName,
  employeeName,
  jobTitle,
  amount,
  escrowId
) => {
  const html = workDeliveredTemplate(clientName, employeeName, jobTitle, amount, escrowId);
  return await sendEmail({
    to:       email,
    subject:  `📦 Work Delivered — Review & Release: ${jobTitle} - ${appConfig.appName}`,
    html,
    category: 'Escrow - Work Delivered',
  });
};

// ─────────────────────────────────────────────────────────────
// 37. Escrow Reversed — employee notified, window to contest
// ─────────────────────────────────────────────────────────────
export const sendEscrowReversed = async (
  email,
  employeeName,
  clientName,
  jobTitle,
  amount,
  escrowId
) => {
  const html = escrowReversedTemplate(employeeName, clientName, jobTitle, amount, escrowId);
  return await sendEmail({
    to:       email,
    subject:  `⚠️ Payment Reversal Requested: ${jobTitle} - ${appConfig.appName}`,
    html,
    category: 'Escrow - Reversed',
  });
};

// ─────────────────────────────────────────────────────────────
// 38. Escrow Disputed — admin + both parties notified
// ─────────────────────────────────────────────────────────────
export const sendEscrowDisputed = async (
  email,
  recipientName,
  recipientRole,
  employeeName,
  clientName,
  jobTitle,
  amount,
  escrowId
) => {
  const html = escrowDisputedTemplate(
    recipientName,
    recipientRole,
    employeeName,
    clientName,
    jobTitle,
    amount,
    escrowId
  );
  return await sendEmail({
    to:       email,
    subject:  `🚨 Escrow Dispute: ${jobTitle} - ${appConfig.appName}`,
    html,
    category: 'Escrow - Disputed',
  });
};

// ─────────────────────────────────────────────────────────────
// 39. Dispute Resolved — both parties notified of decision
// ─────────────────────────────────────────────────────────────
export const sendDisputeResolved = async (
  email,
  recipientName,
  recipientRole,
  jobTitle,
  decision,
  amount,
  escrowId
) => {
  const html = disputeResolvedTemplate(
    recipientName,
    recipientRole,
    jobTitle,
    decision,
    amount,
    escrowId
  );
  return await sendEmail({
    to:       email,
    subject:  `⚖️ Dispute Resolved: ${jobTitle} - ${appConfig.appName}`,
    html,
    category: 'Escrow - Dispute Resolved',
  });
};

// ─────────────────────────────────────────────────────────────
// 42. Escrow Refund Credit Note — sent to client when refunded
// ─────────────────────────────────────────────────────────────
export const sendEscrowRefundCreditNote = async (email, creditNoteData) => {
  const html = escrowRefundCreditNoteTemplate(creditNoteData);
  return await sendEmail({
    to:       email,
    subject:  `🔄 Credit Note #${creditNoteData.creditNoteNumber} — Escrow Refund Processed - ${appConfig.appName}`,
    html,
    category: 'Escrow - Refund Credit Note',
  });
};

// ─────────────────────────────────────────────────────────────
// 43. Withdrawal Requested — employee notified
// ─────────────────────────────────────────────────────────────
export const sendWithdrawalRequested = async (
  email,
  fullname,
  amount,
  withdrawalId
) => {
  const html = withdrawalRequestedTemplate(fullname, amount, withdrawalId);
  return await sendEmail({
    to:       email,
    subject:  `🏦 Withdrawal Request Received: ₹${Number(amount).toLocaleString('en-IN')} - ${appConfig.appName}`,
    html,
    category: 'Withdrawal - Requested',
  });
};


// ─────────────────────────────────────────────────────────────
// 44. Rich New Application Notification — client gets full details
//     (who applied, which job, budget, cover letter preview, avatar)
//     Used by employeeController.js → applyToJob
// ─────────────────────────────────────────────────────────────
export const sendNewApplicationNotificationEmail = async (
  clientEmail,
  clientName,
  employeeName,
  employeeUsername,
  jobTitle,
  jobId,
  applicationId,
  proposedBudget   = null,
  coverLetterPreview = null,
  employeeProfilePic = null,
) => {
  // sendNewApplicationNotification is the TEMPLATE function from emailTemplates.js
  const html = sendNewApplicationNotification(
    clientName,
    employeeName,
    employeeUsername,
    jobTitle,
    jobId,
    applicationId,
    proposedBudget,
    coverLetterPreview,
    employeeProfilePic,
  );

  return await sendEmail({
    to:       clientEmail,
    subject:  `📬 New Application — ${employeeName} applied for "${jobTitle}" - ${appConfig.appName}`,
    html,
    category: 'Job - New Application (Rich)',
  });
};






export const sendJobClosingSoonNotification = async (
  email,
  employeeName,
  jobTitle,
  needFor,
  currency,
  price,
  requiredSkills,
  clientName,
  jobId,
  closingAt           // Date object — when the job closes
) => {
  const hoursLeft = Math.max(1, Math.round((new Date(closingAt) - Date.now()) / 3600000));

  const html = jobClosingSoonTemplate(
    employeeName,
    jobTitle,
    needFor,
    currency,
    price,
    requiredSkills,
    clientName,
    jobId,
    hoursLeft
  );

  return await sendEmail({
    to:       email,
    subject:  `⏳ Closing in ${hoursLeft}h — Apply Now: ${jobTitle} - ${appConfig.appName}`,
    html,
    category: 'Job - Closing Soon',
  });
};


// ─────────────────────────────────────────────────────────────
// Also add to the export default object at the bottom:
// ─────────────────────────────────────────────────────────────

// sendJobClosingSoonNotification,   ← add this line

/**
 * ═══════════════════════════════════════════════════════════════
 *                   EXPORT ALL FUNCTIONS
 * ═══════════════════════════════════════════════════════════════
 */
export default {
    // OTP
    sendSignupOTP,
    sendLoginOTP,
    sendResendOTP,
    // Welcome
    sendWelcomeEmail,
    sendWelcomeEmployee,
    sendWelcomeClient,
    // Account
    sendEmployeeApproval,
    sendEmployeeRejection,
    // Password
    sendPasswordResetOTP,
    sendPasswordResetSuccess,
    // Security
    sendStrikeWarning,
    sendAccountBanned,
    // Payment
    sendPaymentReceived,
    sendPaymentSent,
    sendPaymentRefund,
    sendPaymentFailed,
    // Additional
    sendAccountDeletion,
    sendEmailChangeVerification,
    sendLowBalanceWarning,
    // Job Notification
    sendJobMatchNotification,
    sendNewApplicationToClient,
    sendNewApplicationNotificationEmail,
    sendJobCompleted,
    sendJobClosingSoonNotification,
    // Application
    sendApplicationAccepted,
    sendApplicationRejected,
    sendNewApplicationNotification,
    // Admin
    sendAdminApprovalNotification,
    sendAdminRejectionNotification,
    sendAdminWelcomeEmail,
    // Subscription
    sendSubscriptionActivated,
    sendSubscriptionExpiring,
    sendSubscriptionCancelled,
    sendSubscriptionRenewed,
    sendSubscriptionPaymentFailed,
    sendSubscriptionInvoice,
    sendSubscriptionRefundCreditNote,
    // Escrow Workflow
    sendEscrowCreated,
    sendEscrowFunded,
    sendWorkDelivered,
    sendEscrowReversed,
    sendEscrowDisputed,
    sendDisputeResolved,
    // Escrow Invoices & Receipts
    sendEscrowPaymentInvoice,
    sendEscrowReleaseReceipt,
    sendEscrowRefundCreditNote,
    // Withdrawal
    sendWithdrawalRequested,
};