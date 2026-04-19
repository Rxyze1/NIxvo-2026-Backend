// services/Email/emailTemplates.js
import { appConfig } from './emailConfig.js';

/**
 * ════════════════════════════════════════════════════════════════
 *                    📧 EMAIL TEMPLATES
 *              Complete Email System - All Scenarios
 * ════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
//                      BASE TEMPLATE
// ═══════════════════════════════════════════════════════════════
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${appConfig.appName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-wrapper {
            background-color: #f4f4f4;
            padding: 20px 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
            font-size: 14px;
        }
        .content {
            padding: 40px 30px;
        }
        .content p {
            margin-bottom: 15px;
            font-size: 15px;
        }
        .otp-box {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 2px dashed #667eea;
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 2px 10px rgba(102, 126, 234, 0.1);
        }
        .otp-code {
            font-size: 42px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 12px;
            font-family: 'Courier New', monospace;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .otp-timer {
            margin-top: 15px;
            color: #666;
            font-size: 14px;
            font-weight: 500;
        }
        .button {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 50px;
            margin: 20px 0;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-2px);
        }
        .info-box {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .info-box p, .info-box ul {
            margin: 0;
            font-size: 14px;
            color: #1565c0;
        }
        .info-box strong {
            display: block;
            margin-bottom: 10px;
            font-size: 15px;
        }
        .info-box ul {
            padding-left: 20px;
            margin-top: 10px;
        }
        .info-box li {
            margin: 5px 0;
        }
        .success-box {
            background: #e8f5e9;
            border-left: 4px solid #4caf50;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            color: #2e7d32;
        }
        .warning-box {
            background: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .warning-box p {
            margin: 0;
            font-size: 14px;
            color: #e65100;
        }
        .warning-box strong {
            display: block;
            margin-bottom: 10px;
            font-size: 15px;
        }
        .danger-box {
            background: #ffebee;
            border-left: 4px solid #f44336;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .danger-box p {
            margin: 0;
            font-size: 14px;
            color: #c62828;
        }
        .danger-box strong {
            display: block;
            margin-bottom: 10px;
            font-size: 15px;
        }
        .payment-details {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .payment-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .payment-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 18px;
            color: #667eea;
        }
        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #dee2e6, transparent);
            margin: 30px 0;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e0e0e0;
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .container {
                margin: 0 10px;
            }
            .content {
                padding: 30px 20px;
            }
            .otp-code {
                font-size: 32px;
                letter-spacing: 8px;
            }
            .button {
                display: block;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="container">
            ${content}
            <div class="footer">
                <p><strong>${appConfig.appName}</strong></p>
                <p style="color: #999; font-size: 12px; margin: 10px 0;">
                    Professional Video Editing Platform
                </p>
                
                <div class="divider"></div>
                
                <p>
                    <strong>Need Help?</strong><br>
                    Email: <a href="mailto:${appConfig.supportEmail}">${appConfig.supportEmail}</a><br>
                    Visit: <a href="${appConfig.appUrl}">${appConfig.appUrl}</a>
                </p>
                
                <div class="social-links">
                    <a href="#">Twitter</a> • 
                    <a href="#">Facebook</a> • 
                    <a href="#">Instagram</a>
                </div>
                
                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                    © ${new Date().getFullYear()} ${appConfig.appName}. All rights reserved.<br>
                    This email was sent to you as a registered user of ${appConfig.appName}.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`;

// ═══════════════════════════════════════════════════════════════
//                   1. OTP VERIFICATION
// ═══════════════════════════════════════════════════════════════

/**
 * OTP Email for Signup
 */
export const otpSignupTemplate = (otp, fullname) => {
    const content = `
        <div class="header">
            <h1>🔐 Verify Your Email</h1>
            <p>Complete your registration</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>Welcome to ${appConfig.appName}! To complete your registration, please verify your email address with the code below:</p>
            
            <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="otp-timer">⏱️ Valid for 10 minutes</div>
            </div>

            <div class="info-box">
                <strong>🔒 Security Tips:</strong>
                <ul>
                    <li>Never share this code with anyone</li>
                    <li>We'll never ask for your OTP via phone or chat</li>
                    <li>This code expires in 10 minutes</li>
                    <li>If you didn't request this, please ignore this email</li>
                </ul>
            </div>

            <p style="color: #666; font-size: 13px; margin-top: 20px;">
                Didn't request this code? Someone might have entered your email by mistake. 
                You can safely ignore this email.
            </p>
        </div>
    `;
    return baseTemplate(content);
};

/**
 * OTP Email for Login
 */
export const otpLoginTemplate = (otp, fullname) => {
    const content = `
        <div class="header">
            <h1>🔐 Login Verification</h1>
            <p>Secure access to your account</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>Someone is trying to log in to your ${appConfig.appName} account. If this is you, use the code below:</p>
            
            <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="otp-timer">⏱️ Valid for 10 minutes</div>
            </div>

            <div class="warning-box">
                <strong>⚠️ Didn't try to log in?</strong>
                <p>If you didn't request this code, your account may be at risk. Please:</p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Change your password immediately</li>
                    <li>Contact our support team</li>
                    <li>Review your recent account activity</li>
                </ul>
            </div>

            <center>
                <a href="${appConfig.appUrl}/security" class="button">Review Security Settings</a>
            </center>
        </div>
    `;
    return baseTemplate(content);
};

/**
 * Resend OTP Notification
 */
export const otpResendTemplate = (otp, fullname, attemptCount) => {
    const content = `
        <div class="header">
            <h1>🔁 New Verification Code</h1>
            <p>Your previous code has been replaced</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>You requested a new verification code. Here's your new OTP:</p>
            
            <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="otp-timer">⏱️ Valid for 10 minutes</div>
            </div>

            <div class="info-box">
                <strong>📌 Important Information:</strong>
                <ul>
                    <li>This is your <strong>attempt ${attemptCount} of 5</strong></li>
                    <li>Your previous OTP codes are now invalid</li>
                    <li>Only the most recent code will work</li>
                    ${attemptCount >= 4 ? '<li style="color: #f44336;"><strong>⚠️ Last attempt! After this, you\'ll need to wait 30 minutes</strong></li>' : ''}
                </ul>
            </div>

            <p style="color: #666; font-size: 13px;">
                <strong>Tip:</strong> Check your spam folder if you're not receiving OTP emails promptly.
            </p>
        </div>
    `;
    return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════
//                   2. WELCOME EMAILS
// ═══════════════════════════════════════════════════════════════

/**
 * Welcome Email - Employee
 */
export const welcomeEmployeeTemplate = (fullname) => {
    const content = `
        <div class="header">
            <h1>🎉 Welcome to ${appConfig.appName}!</h1>
            <p>Your journey as an editor begins here</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>Congratulations! Your account has been successfully created. We're excited to have you join our community of talented video editors!</p>
            
            <div class="success-box">
                <strong>✅ Registration Complete!</strong>
                <p style="margin-top: 10px;">Your account type: <strong>Employee/Editor</strong></p>
            </div>

            <div class="info-box">
                <strong>⏳ What Happens Next?</strong>
                <ul>
                    <li><strong>Step 1:</strong> Our admin team will review your profile (24-48 hours)</li>
                    <li><strong>Step 2:</strong> You'll receive an approval email</li>
                    <li><strong>Step 3:</strong> Once approved, you can start browsing and applying for jobs</li>
                </ul>
            </div>

            <div class="info-box" style="background: #e8f5e9; border-color: #4caf50;">
                <strong style="color: #2e7d32;">💡 Pro Tips While You Wait:</strong>
                <ul style="color: #2e7d32;">
                    <li>Complete your profile with portfolio samples</li>
                    <li>Add your skills and experience</li>
                    <li>Upload high-quality work samples</li>
                    <li>Set your availability and rates</li>
                </ul>
            </div>

            <center>
                <a href="${appConfig.appUrl}/profile/edit" class="button">Complete Your Profile</a>
            </center>

            <div class="divider"></div>

            <p style="text-align: center; color: #666;">
                Questions? We're here to help!<br>
                Contact us at <a href="mailto:${appConfig.supportEmail}">${appConfig.supportEmail}</a>
            </p>
        </div>
    `;
    return baseTemplate(content);
};

/**
 * Welcome Email - Client
 */
export const welcomeClientTemplate = (fullname) => {
    const content = `
        <div class="header">
            <h1>🎉 Welcome to ${appConfig.appName}!</h1>
            <p>Find the perfect editor for your project</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>Welcome aboard! Your account is ready, and you can start posting jobs immediately.</p>
            
            <div class="success-box">
                <strong>✅ Account Activated!</strong>
                <p style="margin-top: 10px;">Your account type: <strong>Client</strong></p>
            </div>

            <div class="info-box">
                <strong>🚀 Get Started in 3 Easy Steps:</strong>
                <ul>
                    <li><strong>Step 1:</strong> Post your first job with detailed requirements</li>
                    <li><strong>Step 2:</strong> Review applications from skilled editors</li>
                    <li><strong>Step 3:</strong> Hire and collaborate with your chosen editor</li>
                </ul>
            </div>

            <div class="info-box" style="background: #e3f2fd; border-color: #2196f3;">
                <strong style="color: #1565c0;">💼 Why Choose ${appConfig.appName}?</strong>
                <ul style="color: #1565c0;">
                    <li>Access to verified, professional editors</li>
                    <li>Secure payment system with escrow protection</li>
                    <li>Project milestone tracking</li>
                    <li>24/7 customer support</li>
                </ul>
            </div>

            <center>
                <a href="${appConfig.appUrl}/jobs/create" class="button">Post Your First Job</a>
            </center>

            <div class="divider"></div>

            <p style="text-align: center; color: #666;">
                Need help getting started?<br>
                <a href="${appConfig.appUrl}/help">Visit our Help Center</a> or 
                <a href="mailto:${appConfig.supportEmail}">Contact Support</a>
            </p>
        </div>
    `;
    return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════
//                   3. EMPLOYEE APPROVAL/REJECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Employee Account Approved
 */
export const employeeApprovalTemplate = (fullname) => {
    const content = `
        <div class="header">
            <h1>✅ Account Approved!</h1>
            <p>You're ready to start working</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p><strong>Congratulations!</strong> Your freelance account has been approved by our admin team. You can now start browsing and applying for jobs!</p>
            
            <div class="success-box">
                <strong>🎉 Your Account is Now Active!</strong>
                <p style="margin-top: 10px;">You have full access to all freelance features.</p>
            </div>

            <div class="info-box">
                <strong>🎯 What You Can Do Now:</strong>
                <ul>
                    <li>Browse available video editing jobs</li>
                    <li>Submit proposals to clients</li>
                    <li>Build your portfolio with completed projects</li>
                    <li>Earn money doing what you love</li>
                </ul>
            </div>

            <div class="info-box" style="background: #fff3e0; border-color: #ff9800;">
                <strong style="color: #e65100;">⭐ Stand Out From the Crowd:</strong>
                <ul style="color: #e65100;">
                    <li>Complete your profile 100%</li>
                    <li>Upload portfolio samples</li>
                    <li>Set competitive rates</li>
                    <li>Respond quickly to job invitations</li>
                </ul>
            </div>

            <center>
                <a href="${appConfig.appUrl}/jobs" class="button">Browse Available Jobs</a>
            </center>

            <div class="divider"></div>

            <p style="text-align: center;">
                <strong>Welcome to the ${appConfig.appName} community!</strong><br>
                <span style="color: #666;">We're excited to see your amazing work 🚀</span>
            </p>
        </div>
    `;
    return baseTemplate(content);
};

/**
 * Employee Account Rejected
 */
export const employeeRejectionTemplate = (fullname, reason) => {
    const content = `
        <div class="header">
            <h1>📋 Application Update</h1>
            <p>Regarding your employee account</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>Thank you for your interest in joining ${appConfig.appName} as an employee. After careful review of your application, we're unable to approve your account at this time.</p>
            
            <div class="warning-box">
                <strong>Reason for Rejection:</strong>
                <p style="margin-top: 10px;">${reason}</p>
            </div>

            <div class="info-box">
                <strong>💡 How to Improve Your Application:</strong>
                <ul>
                    <li>Add more detailed work experience</li>
                    <li>Include high-quality portfolio samples</li>
                    <li>Complete all required profile sections</li>
                    <li>Provide professional references (if applicable)</li>
                </ul>
            </div>

            <div class="info-box" style="background: #e3f2fd; border-color: #2196f3;">
                <strong style="color: #1565c0;">🔄 You Can Reapply:</strong>
                <p style="color: #1565c0; margin-top: 10px;">
                    You're welcome to update your profile and reapply after <strong>30 days</strong>. 
                    We encourage you to address the feedback above before resubmitting.
                </p>
            </div>

            <p style="margin-top: 30px;">
                If you have questions about this decision, please contact our support team at 
                <a href="mailto:${appConfig.supportEmail}">${appConfig.supportEmail}</a>
            </p>

            <p style="color: #666; font-size: 13px; margin-top: 20px;">
                Thank you for your understanding and interest in ${appConfig.appName}.
            </p>
        </div>
    `;
    return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════
//                   4. PASSWORD RESET
// ═══════════════════════════════════════════════════════════════

/**
 * Password Reset Request
 */
export const passwordResetTemplate = (fullname, resetToken) => {
    const resetUrl = `${appConfig.appUrl}/reset-password?token=${resetToken}`;
    const content = `
        <div class="header">
            <h1>🔑 Reset Your Password</h1>
            <p>Secure password recovery</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>We received a request to reset your password for your ${appConfig.appName} account. Click the button below to create a new password:</p>
            
            <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
            </center>

            <div class="info-box">
                <strong>🔗 Or copy this link:</strong>
                <p style="word-break: break-all; background: white; padding: 10px; border-radius: 4px; margin-top: 10px; font-family: monospace; font-size: 12px; color: #667eea;">
                    ${resetUrl}
                </p>
            </div>

            <div class="warning-box">
                <strong>⚠️ Important Security Information:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>This link expires in <strong>1 hour</strong></li>
                    <li>You can only use this link once</li>
                    <li>If you didn't request this, ignore this email</li>
                    <li>Your current password remains active until you set a new one</li>
                </ul>
            </div>

            <div class="danger-box">
                <strong>🚨 Didn't Request This?</strong>
                <p style="margin-top: 10px;">
                    If you didn't request a password reset, someone may be trying to access your account. 
                    Please <a href="${appConfig.appUrl}/security" style="color: #c62828;"><strong>secure your account immediately</strong></a>.
                </p>
            </div>

            <p style="color: #666; font-size: 13px; margin-top: 20px;">
                For security reasons, we never send your password via email. 
                You must create a new one using the link above.
            </p>
        </div>
    `;
    return baseTemplate(content);
};

/**
 * Password Reset Successful
 */
export const passwordResetSuccessTemplate = (fullname, ipAddress, location) => {
    const content = `
        <div class="header">
            <h1>✅ Password Changed</h1>
            <p>Your password was successfully reset</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>Your password for ${appConfig.appName} has been successfully changed.</p>
            
            <div class="success-box">
                <strong>✅ Password Updated</strong>
                <p style="margin-top: 10px;">Your account is now secured with your new password.</p>
            </div>

            <div class="info-box">
                <strong>📍 Change Details:</strong>
                <ul>
                    <li><strong>Date & Time:</strong> ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</li>
                    <li><strong>IP Address:</strong> ${ipAddress || 'Unknown'}</li>
                    <li><strong>Location:</strong> ${location || 'Unknown'}</li>
                </ul>
            </div>

            <div class="warning-box">
                <strong>⚠️ Didn't Change Your Password?</strong>
                <p style="margin-top: 10px;">
                    If you didn't make this change, your account may be compromised. 
                    Please contact our support team immediately and:
                </p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Reset your password again</li>
                    <li>Enable two-factor authentication</li>
                    <li>Review your account activity</li>
                </ul>
            </div>

            <center>
                <a href="${appConfig.appUrl}/security" class="button">Review Security Settings</a>
            </center>

            <p style="text-align: center; margin-top: 20px; color: #666;">
                Questions? Contact us at <a href="mailto:${appConfig.supportEmail}">${appConfig.supportEmail}</a>
            </p>
        </div>
    `;
    return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════
//                   5. ACCOUNT SECURITY
// ═══════════════════════════════════════════════════════════════

/**
 * Account Strike Warning
 */
export const strikeWarningTemplate = (fullname, strikeCount, reason, freezeDuration = null) => {
    const content = `
        <div class="header" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">
            <h1>⚠️ Account Warning: Strike ${strikeCount}/3</h1>
            <p>Policy violation detected</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>Your account has received a strike due to a violation of our Terms of Service.</p>
            
            <div class="warning-box">
                <strong>📋 Violation Details:</strong>
                <p style="margin-top: 10px;">${reason}</p>
            </div>

            <div class="danger-box">
                <strong>⚠️ Current Strike Status: ${strikeCount}/3</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    ${strikeCount === 1 ? `
                        <li><strong>First Warning</strong> - This is your first strike</li>
                        <li>Please review our Terms of Service carefully</li>
                        <li>Further violations may result in account restrictions</li>
                    ` : ''}
                    ${strikeCount === 2 ? `
                        <li><strong style="color: #f44336;">ACCOUNT FROZEN FOR ${freezeDuration || '48 HOURS'}</strong></li>
                        <li>You cannot post jobs, apply, or message during this period</li>
                        <li>One more strike will result in PERMANENT ACCOUNT SUSPENSION</li>
                        <li>Access will be restored automatically after the freeze period</li>
                    ` : ''}
                    ${strikeCount >= 3 ? `
                        <li><strong style="color: #f44336;">FINAL WARNING - ACCOUNT AT RISK</strong></li>
                        <li>This is your last chance</li>
                        <li>Any further violations will result in PERMANENT BAN</li>
                        <li>No exceptions or appeals after ban</li>
                    ` : ''}
                </ul>
            </div>

            ${strikeCount === 2 ? `
                <div class="info-box">
                    <strong>⏱️ Freeze Period Details:</strong>
                    <ul>
                        <li><strong>Duration:</strong> ${freezeDuration || '48 hours'}</li>
                        <li><strong>Starts:</strong> Immediately</li>
                        <li><strong>Ends:</strong> ${new Date(Date.now() + (freezeDuration ? parseInt(freezeDuration) * 60 * 60 * 1000 : 48 * 60 * 60 * 1000)).toLocaleString()}</li>
                        <li>Your account will be automatically unfrozen</li>
                    </ul>
                </div>
            ` : ''}

            <div class="info-box" style="background: #e3f2fd; border-color: #2196f3;">
                <strong style="color: #1565c0;">📖 What You Should Do:</strong>
                <ul style="color: #1565c0;">
                    <li>Review our <a href="${appConfig.appUrl}/terms" style="color: #1565c0;">Terms of Service</a></li>
                    <li>Understand the community guidelines</li>
                    <li>Avoid any behavior that could lead to further strikes</li>
                    <li>Contact support if you believe this is an error</li>
                </ul>
            </div>

            <center>
                <a href="${appConfig.appUrl}/terms" class="button" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">Review Terms of Service</a>
            </center>

            <p style="margin-top: 30px; color: #666; font-size: 13px;">
                If you believe this strike was issued in error, please contact our appeals team at 
                <a href="mailto:${appConfig.supportEmail}">${appConfig.supportEmail}</a> with your case details.
            </p>
        </div>
    `;
    return baseTemplate(content);
};

/**
 * Account Permanently Banned
 */
export const accountBannedTemplate = (fullname, reason) => {
    const content = `
        <div class="header" style="background: linear-gradient(135deg, #e53935 0%, #d32f2f 100%);">
            <h1>⛔ Account Permanently Suspended</h1>
            <p>Access has been revoked</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>Your ${appConfig.appName} account has been permanently suspended due to severe or repeated violations of our Terms of Service.</p>
            
            <div class="danger-box">
                <strong>🚫 Suspension Reason:</strong>
                <p style="margin-top: 10px;">${reason}</p>
            </div>

            <div class="info-box" style="background: #ffebee; border-color: #f44336;">
                <strong style="color: #c62828;">📜 Account Status:</strong>
                <ul style="color: #c62828;">
                    <li><strong>Status:</strong> Permanently Suspended</li>
                    <li><strong>Access:</strong> Completely revoked</li>
                    <li><strong>Duration:</strong> Permanent (no expiration)</li>
                    <li><strong>Appeal Window:</strong> 14 days from this notice</li>
                </ul>
            </div>

            <div class="info-box">
                <strong>💰 Pending Payments & Funds:</strong>
                <ul>
                    <li>Any pending payments will be processed according to our Terms</li>
                    <li>Funds in escrow will be handled per contractual agreements</li>
                    <li>Completed work payments will be released as scheduled</li>
                    <li>Contact support for specific payment inquiries</li>
                </ul>
            </div>

            <div class="warning-box">
                <strong>⚖️ Appeal Process:</strong>
                <p style="margin-top: 10px;">
                    If you believe this suspension was made in error, you have <strong>14 days</strong> 
                    to submit an appeal. Please email <a href="mailto:${appConfig.supportEmail}" style="color: #e65100;">${appConfig.supportEmail}</a> 
                    with the subject line "Ban Appeal - [Your Username]" and provide:
                </p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Your account details (email, username)</li>
                    <li>Detailed explanation of your case</li>
                    <li>Any supporting evidence or documentation</li>
                </ul>
                <p style="margin-top: 10px;">
                    <strong>Note:</strong> Appeals are reviewed within 5-7 business days. 
                    The decision made after review is final.
                </p>
            </div>

            <div class="info-box" style="background: #f8f9fa; border-color: #dee2e6;">
                <strong>📋 Important Information:</strong>
                <ul>
                    <li>Creating a new account to bypass this ban is prohibited</li>
                    <li>Attempting to circumvent this ban may result in legal action</li>
                    <li>Your data will be retained per our privacy policy</li>
                    <li>Account deletion requests can be made via support</li>
                </ul>
            </div>

            <p style="margin-top: 30px; text-align: center; color: #666;">
                For questions or concerns, contact:<br>
                <a href="mailto:${appConfig.supportEmail}">${appConfig.supportEmail}</a>
            </p>
        </div>
    `;
    return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════
//                   6. PAYMENT NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Payment Received (For Employees)
 */
export const paymentReceivedTemplate = (fullname, amount, projectName, transactionId, clientName) => {
    const content = `
        <div class="header" style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);">
            <h1>💰 Payment Received!</h1>
            <p>You've been paid for your work</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>Great news! A payment has been successfully processed for your completed work.</p>
            
            <div class="success-box">
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 48px; font-weight: bold; color: #4caf50;">
                        ₹${amount.toLocaleString('en-IN')}
                    </div>
                    <div style="color: #666; margin-top: 10px;">Payment Successfully Credited</div>
                </div>
            </div>

            <div class="payment-details">
                <div class="payment-row">
                    <span><strong>Project:</strong></span>
                    <span>${projectName}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Client:</strong></span>
                    <span>${clientName}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Transaction ID:</strong></span>
                    <span style="font-family: monospace; font-size: 12px;">${transactionId}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Date:</strong></span>
                    <span>${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Status:</strong></span>
                    <span style="color: #4caf50; font-weight: bold;">✅ Completed</span>
                </div>
            </div>

            <div class="info-box">
                <strong>💳 What Happens Next?</strong>
                <ul>
                    <li>Funds are now available in your ${appConfig.appName} wallet</li>
                    <li>You can withdraw to your bank account anytime</li>
                    <li>Minimum withdrawal amount: ₹500</li>
                    <li>Processing time: 2-5 business days</li>
                </ul>
            </div>

            <center>
                <a href="${appConfig.appUrl}/wallet" class="button" style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);">View Wallet Balance</a>
            </center>

            <div class="divider"></div>

            <p style="text-align: center; color: #666;">
                Questions about this payment?<br>
                <a href="${appConfig.appUrl}/transactions/${transactionId}">View Transaction Details</a> or 
                <a href="mailto:${appConfig.supportEmail}">Contact Support</a>
            </p>
        </div>
    `;
    return baseTemplate(content);
};

/**
 * Payment Sent (For Clients)
 */
export const paymentSentTemplate = (fullname, amount, projectName, transactionId, employeeName) => {
    const content = `
        <div class="header" style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);">
            <h1>✅ Payment Processed</h1>
            <p>Your payment has been sent</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>Your payment for the completed project has been successfully processed.</p>
            
            <div class="success-box">
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 48px; font-weight: bold; color: #2196f3;">
                        ₹${amount.toLocaleString('en-IN')}
                    </div>
                    <div style="color: #666; margin-top: 10px;">Payment Successfully Sent</div>
                </div>
            </div>

            <div class="payment-details">
                <div class="payment-row">
                    <span><strong>Project:</strong></span>
                    <span>${projectName}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Paid To:</strong></span>
                    <span>${employeeName}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Transaction ID:</strong></span>
                    <span style="font-family: monospace; font-size: 12px;">${transactionId}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Date:</strong></span>
                    <span>${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Payment Method:</strong></span>
                    <span>Razorpay</span>
                </div>
                <div class="payment-row">
                    <span><strong>Status:</strong></span>
                    <span style="color: #4caf50; font-weight: bold;">✅ Completed</span>
                </div>
            </div>

            <div class="info-box">
                <strong>📋 Next Steps:</strong>
                <ul>
                    <li>The editor will receive the funds immediately</li>
                    <li>You'll receive a tax invoice within 24 hours</li>
                    <li>Leave a review to help the community</li>
                    <li>Download your project files if not done already</li>
                </ul>
            </div>

            <center>
                <a href="${appConfig.appUrl}/projects/${projectName}/review" class="button">Leave a Review</a>
            </center>

            <div class="divider"></div>

            <p style="text-align: center; color: #666;">
                Need a receipt or invoice?<br>
                <a href="${appConfig.appUrl}/transactions/${transactionId}">Download Receipt</a>
            </p>
        </div>
    `;
    return baseTemplate(content);
};

/**
 * Payment Refund Processed
 */
export const paymentRefundTemplate = (fullname, amount, projectName, reason, transactionId) => {
    const content = `
        <div class="header" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">
            <h1>🔄 Refund Processed</h1>
            <p>Your payment has been refunded</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>A refund has been processed for your payment. The amount will be credited back to your original payment method.</p>
            
            <div class="success-box" style="background: #fff3e0; border-color: #ff9800;">
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 48px; font-weight: bold; color: #ff9800;">
                        ₹${amount.toLocaleString('en-IN')}
                    </div>
                    <div style="color: #666; margin-top: 10px;">Refund Amount</div>
                </div>
            </div>

            <div class="payment-details">
                <div class="payment-row">
                    <span><strong>Project:</strong></span>
                    <span>${projectName}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Refund Reason:</strong></span>
                    <span>${reason}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Transaction ID:</strong></span>
                    <span style="font-family: monospace; font-size: 12px;">${transactionId}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Refund Date:</strong></span>
                    <span>${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Status:</strong></span>
                    <span style="color: #ff9800; font-weight: bold;">🔄 Processing</span>
                </div>
            </div>

            <div class="info-box">
                <strong>⏱️ Refund Timeline:</strong>
                <ul>
                    <li><strong>Credit/Debit Card:</strong> 5-7 business days</li>
                    <li><strong>UPI/Net Banking:</strong> 2-3 business days</li>
                    <li><strong>Bank Transfer:</strong> 3-5 business days</li>
                    <li>You'll receive a confirmation once the refund is completed</li>
                </ul>
            </div>

            <div class="warning-box">
                <strong>💡 Important Information:</strong>
                <p style="margin-top: 10px;">
                    The refund will be credited to the same payment method used for the original transaction. 
                    If you don't see the refund within the expected timeline, please check with your bank or 
                    contact our support team.
                </p>
            </div>

            <center>
                <a href="${appConfig.appUrl}/transactions/${transactionId}" class="button">View Refund Status</a>
            </center>

            <p style="text-align: center; margin-top: 20px; color: #666;">
                Questions about your refund?<br>
                Contact us at <a href="mailto:${appConfig.supportEmail}">${appConfig.supportEmail}</a>
            </p>
        </div>
    `;
    return baseTemplate(content);
};

/**
 * Payment Failed Notification
 */
export const paymentFailedTemplate = (fullname, amount, projectName, reason) => {
    const content = `
        <div class="header" style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);">
            <h1>❌ Payment Failed</h1>
            <p>There was an issue processing your payment</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>Unfortunately, we were unable to process your payment for the project. Please review the details below and try again.</p>
            
            <div class="danger-box">
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 48px; font-weight: bold; color: #f44336;">
                        ₹${amount.toLocaleString('en-IN')}
                    </div>
                    <div style="color: #c62828; margin-top: 10px; font-weight: bold;">Payment Failed</div>
                </div>
            </div>

            <div class="payment-details">
                <div class="payment-row">
                    <span><strong>Project:</strong></span>
                    <span>${projectName}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Amount:</strong></span>
                    <span>₹${amount.toLocaleString('en-IN')}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Failure Reason:</strong></span>
                    <span style="color: #f44336;">${reason}</span>
                </div>
                <div class="payment-row">
                    <span><strong>Date:</strong></span>
                    <span>${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            <div class="warning-box">
                <strong>🔧 How to Resolve This:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Check if your card/account has sufficient balance</li>
                    <li>Verify your card hasn't expired</li>
                    <li>Ensure you're not exceeding daily transaction limits</li>
                    <li>Try a different payment method</li>
                    <li>Contact your bank if the issue persists</li>
                </ul>
            </div>

            <div class="info-box">
                <strong>💡 Alternative Payment Options:</strong>
                <ul>
                    <li>Credit/Debit Card</li>
                    <li>UPI (Google Pay, PhonePe, Paytm)</li>
                    <li>Net Banking</li>
                    <li>Wallet (Paytm, Mobikwik)</li>
                </ul>
            </div>

            <center>
                <a href="${appConfig.appUrl}/projects/${projectName}/payment" class="button" style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);">Retry Payment</a>
            </center>

            <p style="text-align: center; margin-top: 20px; color: #666;">
                <strong>Note:</strong> Your project will remain on hold until payment is completed.<br>
                Need help? <a href="mailto:${appConfig.supportEmail}">Contact Support</a>
            </p>
        </div>
    `;
    return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════
//                   7. ADDITIONAL NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Account Deletion Confirmation
 */
export const accountDeletionTemplate = (fullname) => {
    const content = `
        <div class="header" style="background: linear-gradient(135deg, #757575 0%, #616161 100%);">
            <h1>👋 Account Deleted</h1>
            <p>We're sad to see you go</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>Your ${appConfig.appName} account has been successfully deleted as per your request.</p>
            
            <div class="info-box" style="background: #f5f5f5; border-color: #9e9e9e;">
                <strong style="color: #424242;">🗑️ What's Been Deleted:</strong>
                <ul style="color: #424242;">
                    <li>Your profile and personal information</li>
                    <li>Project history and communications</li>
                    <li>Saved preferences and settings</li>
                    <li>Portfolio and work samples</li>
                </ul>
            </div>

            <div class="warning-box">
                <strong>📋 Important Information:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Some data may be retained for legal/tax purposes (90 days)</li>
                    <li>You can create a new account anytime using the same email</li>
                    <li>Any pending payments have been processed/refunded</li>
                    <li>This action cannot be undone</li>
                </ul>
            </div>

            <div class="info-box">
                <strong>💬 We'd Love Your Feedback:</strong>
                <p style="margin-top: 10px; color: #1565c0;">
                    Help us improve by sharing why you left. Your feedback is valuable and helps us serve our community better.
                </p>
            </div>

            <center>
                <a href="${appConfig.appUrl}/feedback?type=deletion" class="button" style="background: linear-gradient(135deg, #757575 0%, #616161 100%);">Share Feedback</a>
            </center>

            <div class="divider"></div>

            <p style="text-align: center;">
                <strong>Changed your mind?</strong><br>
                <span style="color: #666;">You're always welcome back! Create a new account at any time.</span><br>
                <a href="${appConfig.appUrl}/signup">Sign Up Again</a>
            </p>

            <p style="text-align: center; margin-top: 20px; color: #666; font-size: 13px;">
                Thank you for being part of the ${appConfig.appName} community. We wish you all the best!
            </p>
        </div>
    `;
    return baseTemplate(content);
};

/**
 * Email Change Verification
 */
export const emailChangeVerificationTemplate = (fullname, newEmail, verificationCode) => {
    const content = `
        <div class="header">
            <h1>📧 Verify New Email</h1>
            <p>Confirm your email change</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>You recently requested to change your ${appConfig.appName} email address to <strong>${newEmail}</strong>.</p>
            <p>To complete this change, please enter the verification code below:</p>
            
            <div class="otp-box">
                <div class="otp-code">${verificationCode}</div>
                <div class="otp-timer">⏱️ Valid for 15 minutes</div>
            </div>

            <div class="warning-box">
                <strong>🔒 Security Notice:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>This code was sent to your NEW email address (${newEmail})</li>
                    <li>Your account email won't change until you verify this code</li>
                    <li>If you didn't request this change, please ignore this email</li>
                    <li>Consider changing your password if you suspect unauthorized access</li>
                </ul>
            </div>

            <center>
                <a href="${appConfig.appUrl}/settings/email/verify?code=${verificationCode}" class="button">Verify Email Change</a>
            </center>

            <p style="color: #666; font-size: 13px; margin-top: 20px;">
                After verification, all future communications will be sent to your new email address.
            </p>
        </div>
    `;
    return baseTemplate(content);
};

/**
 * Low Balance Warning (For Clients)
 */
export const lowBalanceWarningTemplate = (fullname, currentBalance, projectName) => {
    const content = `
        <div class="header" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">
            <h1>⚠️ Low Balance Alert</h1>
            <p>Your wallet balance is running low</p>
        </div>
        <div class="content">
            <p>Hi <strong>${fullname}</strong>,</p>
            <p>This is a friendly reminder that your wallet balance is running low for the ongoing project.</p>
            
            <div class="warning-box">
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 36px; font-weight: bold; color: #ff9800;">
                        ₹${currentBalance.toLocaleString('en-IN')}
                    </div>
                    <div style="color: #e65100; margin-top: 10px; font-weight: bold;">Current Balance</div>
                </div>
            </div>

            <div class="info-box">
                <strong>📊 Project Details:</strong>
                <ul>
                    <li><strong>Project:</strong> ${projectName}</li>
                    <li><strong>Status:</strong> In Progress</li>
                    <li><strong>Recommended Balance:</strong> ₹${(currentBalance * 2).toLocaleString('en-IN')}</li>
                </ul>
            </div>

            <div class="warning-box">
                <strong>💡 Why This Matters:</strong>
                <p style="margin-top: 10px;">
                    Maintaining adequate balance ensures smooth milestone payments and prevents project delays. 
                    We recommend adding funds to avoid any interruptions.
                </p>
            </div>

            <center>
                <a href="${appConfig.appUrl}/wallet/add-funds" class="button" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">Add Funds Now</a>
            </center>

            <p style="text-align: center; margin-top: 20px; color: #666;">
                Questions about payments? <a href="mailto:${appConfig.supportEmail}">Contact Support</a>
            </p>
        </div>
    `;
    return baseTemplate(content);
};





// ═══════════════════════════════════════════════════════════════
//          🎉 APPLICATION ACCEPTED (FOR EMPLOYEES)
// ═══════════════════════════════════════════════════════════════

/**
 * Application Accepted - Employee gets hired
 */
export const applicationAcceptedTemplate = (
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
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);">
      <h1>🎉 Congratulations!</h1>
      <p>Your application has been accepted</p>
    </div>
    <div class="content">
      <p>Hi <strong>${employeeName}</strong>,</p>
      <p>Great news! Your application for the following job has been accepted by the client. You're officially hired!</p>
      
      <div class="success-box">
        <strong>✅ You've Been Hired!</strong>
        <p style="margin-top: 10px;">The client has reviewed your profile and proposal, and they're excited to work with you.</p>
      </div>

      ${jobImage ? `
        <div style="text-align: center; margin: 30px 0;">
          <img src="${jobImage}" alt="${jobTitle}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" />
        </div>
      ` : ''}

      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; margin: 20px 0;">
        <h2 style="margin: 0 0 15px 0; font-size: 24px; color: white;">📋 ${jobTitle}</h2>
        <p style="margin: 0; line-height: 1.8; opacity: 0.95; font-size: 15px;">
          ${jobDescription.length > 300 ? jobDescription.substring(0, 300) + '...' : jobDescription}
        </p>
      </div>

      <div class="payment-details">
        <div class="payment-row">
          <span><strong>💼 Client:</strong></span>
          <span>${clientName}</span>
        </div>
        <div class="payment-row">
          <span><strong>💰 Project Budget:</strong></span>
          <span style="color: #4caf50; font-weight: bold;">₹${budget.toLocaleString('en-IN')}</span>
        </div>
        <div class="payment-row">
          <span><strong>⏱️ Delivery Timeline:</strong></span>
          <span>${deliveryTime}</span>
        </div>
        <div class="payment-row">
          <span><strong>📅 Start Date:</strong></span>
          <span>${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      ${clientMessage ? `
        <div class="info-box" style="background: #e8f5e9; border-color: #4caf50;">
          <strong style="color: #2e7d32;">💬 Message from Client:</strong>
          <p style="color: #2e7d32; margin-top: 10px; font-style: italic; padding: 15px; background: white; border-radius: 8px;">
            "${clientMessage}"
          </p>
        </div>
      ` : ''}

      <div class="info-box">
        <strong>🚀 Next Steps:</strong>
        <ul>
          <li><strong>Step 1:</strong> Review the complete project requirements</li>
          <li><strong>Step 2:</strong> Connect with the client via messaging</li>
          <li><strong>Step 3:</strong> Confirm project milestones and deadlines</li>
          <li><strong>Step 4:</strong> Begin working on the project</li>
          <li><strong>Step 5:</strong> Submit deliverables for review</li>
        </ul>
      </div>

      <div class="info-box" style="background: #fff3e0; border-color: #ff9800;">
        <strong style="color: #e65100;">⭐ Pro Tips for Success:</strong>
        <ul style="color: #e65100;">
          <li>Communicate proactively with your client</li>
          <li>Set clear expectations and deadlines</li>
          <li>Deliver high-quality work on time</li>
          <li>Keep the client updated on progress</li>
          <li>Request feedback and make revisions promptly</li>
        </ul>
      </div>

      <center>
        <a href="${appConfig.appUrl}/projects/${jobId}" class="button" style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);">View Project Details</a>
      </center>

      <div class="divider"></div>

      <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
        <p style="margin: 0 0 10px 0; font-size: 16px; color: #333;">
          <strong>🎯 Ready to Start?</strong>
        </p>
        <p style="margin: 0; color: #666; font-size: 14px;">
          Access your project dashboard and begin your journey to creating amazing work!
        </p>
        <div style="margin-top: 15px;">
          <a href="${appConfig.appUrl}/messages/${jobId}" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-weight: 600;">
            💬 Message Client
          </a>
          <span style="color: #dee2e6;">•</span>
          <a href="${appConfig.appUrl}/projects/${jobId}/files" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-weight: 600;">
            📁 Project Files
          </a>
        </div>
      </div>

      <p style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
        <strong>Need Help?</strong><br>
        Our support team is here for you 24/7<br>
        <a href="mailto:${appConfig.supportEmail}">${appConfig.supportEmail}</a>
      </p>

      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center;">
        <p style="color: white; margin: 0; font-size: 16px; font-weight: 600;">
          🌟 This is the beginning of something great!
        </p>
        <p style="color: white; margin: 10px 0 0; opacity: 0.9; font-size: 14px;">
          We wish you success on this project. Show them what you're capable of!
        </p>
      </div>
    </div>
  `;
  return baseTemplate(content);
};


// ═══════════════════════════════════════════════════════════════
//          💼 APPLICATION REJECTED (FOR EMPLOYEES)
// ═══════════════════════════════════════════════════════════════

/**
 * Application Rejected - Employee not selected
 */
export const applicationRejectedTemplate = (
  employeeName, 
  jobTitle, 
  jobDescription, 
  clientName,
  applicationId,
  clientMessage = null,
  jobImage = null
) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">
      <h1>📋 Application Update</h1>
      <p>Thank you for your interest</p>
    </div>
    <div class="content">
      <p>Hi <strong>${employeeName}</strong>,</p>
      <p>Thank you for taking the time to apply for the following project. We appreciate your interest and the effort you put into your application.</p>
      
      ${jobImage ? `
        <div style="text-align: center; margin: 30px 0;">
          <img src="${jobImage}" alt="${jobTitle}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); opacity: 0.9;" />
        </div>
      ` : ''}

      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; margin: 20px 0;">
        <h2 style="margin: 0 0 15px 0; font-size: 24px; color: white;">📋 ${jobTitle}</h2>
        <p style="margin: 0; line-height: 1.8; opacity: 0.95; font-size: 15px;">
          ${jobDescription.length > 300 ? jobDescription.substring(0, 300) + '...' : jobDescription}
        </p>
      </div>

      <div class="warning-box">
        <strong>📌 Application Status</strong>
        <p style="margin-top: 10px;">
          After careful consideration, the client <strong>${clientName}</strong> has decided to proceed with another candidate whose profile more closely matched their specific requirements for this project.
        </p>
      </div>

      ${clientMessage ? `
        <div class="info-box" style="background: #e3f2fd; border-color: #2196f3;">
          <strong style="color: #1565c0;">💬 Message from Client:</strong>
          <p style="color: #1565c0; margin-top: 10px; font-style: italic; padding: 15px; background: white; border-radius: 8px;">
            "${clientMessage}"
          </p>
        </div>
      ` : ''}

      <div class="info-box" style="background: #e8f5e9; border-color: #4caf50;">
        <strong style="color: #2e7d32;">💪 Don't Be Discouraged!</strong>
        <p style="color: #2e7d32; margin-top: 10px;">
          This decision doesn't reflect on your skills or abilities. Every project has unique requirements, 
          and clients often receive many qualified applications. This is just one opportunity among many!
        </p>
      </div>

      <div class="info-box">
        <strong>🚀 What You Can Do Next:</strong>
        <ul>
          <li><strong>Keep Applying:</strong> More projects are posted every day that might be perfect for you</li>
          <li><strong>Enhance Your Profile:</strong> Add more portfolio samples and update your skills</li>
          <li><strong>Refine Your Proposals:</strong> Tailor each application to the specific job requirements</li>
          <li><strong>Build Your Reputation:</strong> Complete projects successfully to get better reviews</li>
          <li><strong>Stay Active:</strong> Regularly check for new job postings in your expertise</li>
        </ul>
      </div>

      <div class="info-box" style="background: #fff3e0; border-color: #ff9800;">
        <strong style="color: #e65100;">⭐ Tips to Improve Your Success Rate:</strong>
        <ul style="color: #e65100;">
          <li>Respond quickly to job postings (early applications get noticed)</li>
          <li>Write personalized cover letters for each application</li>
          <li>Showcase relevant work samples from your portfolio</li>
          <li>Set competitive and realistic pricing</li>
          <li>Highlight your unique skills and experience</li>
          <li>Maintain a professional and complete profile</li>
        </ul>
      </div>

      <center>
        <a href="${appConfig.appUrl}/jobs" class="button" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">Browse More Jobs</a>
      </center>

      <div class="divider"></div>

      <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 12px; border: 2px solid #dee2e6;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">🎯</div>
          <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold; color: #333;">
            Your Perfect Project is Out There!
          </p>
          <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
            We have <strong>hundreds of new projects posted daily</strong>. The right match is just around the corner. 
            Keep applying, stay positive, and your breakthrough is coming!
          </p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
          <strong>Need Support or Advice?</strong>
        </p>
        <div>
          <a href="${appConfig.appUrl}/help/application-tips" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-weight: 600;">
            📖 Application Tips
          </a>
          <span style="color: #dee2e6;">•</span>
          <a href="${appConfig.appUrl}/help/profile-optimization" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-weight: 600;">
            ⚡ Profile Optimization
          </a>
          <span style="color: #dee2e6;">•</span>
          <a href="mailto:${appConfig.supportEmail}" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-weight: 600;">
            💬 Contact Support
          </a>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 8px; margin-top: 30px; text-align: center;">
        <p style="color: white; margin: 0; font-size: 16px; font-weight: 600;">
          💫 Every "No" Gets You Closer to a "Yes"
        </p>
        <p style="color: white; margin: 15px 0 0; opacity: 0.9; font-size: 14px; line-height: 1.6;">
          Some of our most successful editors faced multiple rejections before landing their breakthrough project. 
          Stay persistent, keep improving, and success will follow!
        </p>
      </div>

      <p style="text-align: center; margin-top: 30px; color: #999; font-size: 13px;">
        Thank you for being part of the ${appConfig.appName} community.<br>
        We believe in your talent and look forward to seeing you succeed!
      </p>
    </div>
  `;
  return baseTemplate(content);
};



// services/Email/emailTemplates.js




// ... (your existing templates)

// ═══════════════════════════════════════════════════════════════
//          💳 SUBSCRIPTION NOTIFICATION TEMPLATES
// ═══════════════════════════════════════════════════════════════

/**
 * Subscription Activated - Simple Notification
 */




export const subscriptionActivatedTemplate = (
  fullname, 
  planName, 
  planPrice, 
  startDate, 
  endDate, 
  features,
  invoiceNumber,
  transactionId
) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);">
      <h1>🎉 Premium Activated!</h1>
      <p>Welcome to ${planName}</p>
    </div>
    <div class="content">
      <p>Hi <strong>${fullname}</strong>,</p>
      <p>Congratulations! Your premium subscription has been successfully activated.</p>
      
      <div class="success-box">
        <div style="text-align: center; margin: 20px 0;">
          <div style="font-size: 48px; font-weight: bold; color: #4caf50;">
            ✅ ${planName}
          </div>
          <div style="color: #666; margin-top: 10px;">Subscription Active</div>
        </div>
      </div>

      <div class="payment-details">
        <div class="payment-row">
          <span><strong>Plan:</strong></span>
          <span>${planName}</span>
        </div>
        <div class="payment-row">
          <span><strong>Amount Paid:</strong></span>
          <span style="color: #4caf50; font-weight: bold;">₹${planPrice.toLocaleString('en-IN')}</span>
        </div>
        <div class="payment-row">
          <span><strong>Valid Until:</strong></span>
          <span>${new Date(endDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div class="payment-row">
          <span><strong>Invoice:</strong></span>
          <span style="font-family: monospace;">${invoiceNumber}</span>
        </div>
        <div class="payment-row">
          <span><strong>Transaction ID:</strong></span>
          <span style="font-family: monospace; font-size: 12px;">${transactionId}</span>
        </div>
      </div>

      <div class="info-box" style="background: #e8f5e9; border-color: #4caf50;">

        <strong style="color: #2e7d32;">🎯 Features Unlocked:</strong>

        <ul style="color: #2e7d32;">
          ${features.verifiedBadge ? '<li>✅ Verified Badge</li>' : ''}
          ${features.unlimitedJobs ? '<li>✅ Unlimited Job Posts</li>' : ''}
          ${features.prioritySupport ? '<li>✅ Priority Support</li>' : ''}
          ${features.priorityListing ? '<li>✅ Priority Listing</li>' : ''}
        </ul>

      </div>

    </div>
  `;
  return baseTemplate(content);
};


/**
 * Subscription Expiring Soon
 */
export const subscriptionExpiringTemplate = (
  fullname, 
  planName, 
  endDate, 
  daysRemaining,
  autoRenewEnabled
) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">
      <h1>⏰ Subscription Expiring Soon</h1>
      <p>Your premium access ends in ${daysRemaining} days</p>
    </div>
    <div class="content">
      <p>Hi <strong>${fullname}</strong>,</p>
      <p>Your <strong>${planName}</strong> subscription will expire soon.</p>
      
      <div class="warning-box">

        <div style="text-align: center; margin: 20px 0;">

          <div style="font-size: 64px; font-weight: bold; color: #ff9800;">
            ${daysRemaining}
          </div>

          <div style="color: #e65100; margin-top: 10px; font-weight: bold;">Days Remaining</div>
        </div>

      </div>

      <div class="payment-details">
        <div class="payment-row">
          <span><strong>Plan:</strong></span>
          <span>${planName}</span>
        </div>
        <div class="payment-row">
          <span><strong>Expiry Date:</strong></span>
          <span style="color: #ff9800; font-weight: bold;">${new Date(endDate).toLocaleDateString('en-IN')}</span>
        </div>
        <div class="payment-row">
          <span><strong>Auto-Renewal:</strong></span>
          <span style="font-weight: bold;">${autoRenewEnabled ? '✅ Enabled' : '❌ Disabled'}</span>
        </div>
      </div>

      ${!autoRenewEnabled ? `
        <center>
          <a href="${appConfig.appUrl}/subscription/renew" class="button" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">
            🔄 Renew Subscription
          </a>
        </center>
      ` : ''}
    </div>
  `;
  return baseTemplate(content);
};

/**
 * Subscription Cancelled
 */
export const subscriptionCancelledTemplate = (
  fullname, 
  planName, 
  endDate,
  reason
) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);">
      <h1>😔 Subscription Cancelled</h1>
      <p>We're sorry to see you go</p>
    </div>
    <div class="content">
      <p>Hi <strong>${fullname}</strong>,</p>
      <p>Your <strong>${planName}</strong> subscription has been cancelled.</p>
      
      <div class="danger-box">
        <strong>📋 Cancellation Details</strong>
        <p style="margin-top: 10px;">Access until: <strong>${new Date(endDate).toLocaleDateString('en-IN')}</strong></p>
        ${reason ? `<p style="margin-top: 5px;">Reason: ${reason}</p>` : ''}
      </div>

      <div class="info-box">
        <strong>💡 Changed Your Mind?</strong>
        <p style="margin-top: 10px;">You can reactivate anytime before expiry.</p>
      </div>

      <center>
        <a href="${appConfig.appUrl}/subscription/reactivate" class="button">
          🔄 Reactivate Subscription
        </a>
      </center>
    </div>
  `;
  return baseTemplate(content);
};

/**
 * Subscription Renewed
 */
export const subscriptionRenewedTemplate = (
  fullname, 
  planName, 
  planPrice, 
  newEndDate,
  invoiceNumber,
  transactionId
) => {
  const content = `
  
    <div class="header" style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);">
      <h1>✅ Subscription Renewed!</h1>
      <p>Your premium access has been extended</p>
    </div>

    <div class="content">

      <p>Hi <strong>${fullname}</strong>,</p>
      <p>Your <strong>${planName}</strong> subscription has been renewed successfully.</p>
      
      <div class="success-box">
        <strong>✅ Renewal Successful</strong>
      </div>

      <div class="payment-details">

        <div class="payment-row">
          <span><strong>Plan:</strong></span>
          <span>${planName}</span>
        </div>

        <div class="payment-row">
          <span><strong>Amount:</strong></span>
          <span style="color: #2196f3; font-weight: bold;">₹${planPrice.toLocaleString('en-IN')}</span>
        </div>

        <div class="payment-row">
          <span><strong>New Expiry:</strong></span>
          <span style="color: #4caf50; font-weight: bold;">${new Date(newEndDate).toLocaleDateString('en-IN')}</span>
        </div>

        <div class="payment-row">
          <span><strong>Invoice:</strong></span>
          <span style="font-family: monospace;">${invoiceNumber}</span>
        </div>

      </div>

    </div>
  `;
  return baseTemplate(content);
};

/**
 * Subscription Payment Failed
 */
export const subscriptionPaymentFailedTemplate = (
  fullname, 
  planName, 
  planPrice,
  endDate,
  reason,
  retryUrl
) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);">
      <h1>❌ Payment Failed</h1>
      <p>Action required to continue subscription</p>
    </div>
    <div class="content">
      <p>Hi <strong>${fullname}</strong>,</p>
      <p>Payment for your <strong>${planName}</strong> renewal failed.</p>
      
      <div class="danger-box">
        <strong>⚠️ Payment Issue</strong>
        <p style="margin-top: 10px;">Amount: ₹${planPrice.toLocaleString('en-IN')}</p>
        <p>Reason: ${reason}</p>
        <p>Expires: <strong>${new Date(endDate).toLocaleDateString('en-IN')}</strong></p>
      </div>

      <center>
        <a href="${retryUrl || `${appConfig.appUrl}/subscription/retry-payment`}" class="button" style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);">
          🔄 Retry Payment
        </a>
      </center>
    </div>
  `;
  return baseTemplate(content);
};




// ═══════════════════════════════════════════════════════════════
//          👮 ADMIN/OFFICIAL ACCOUNT TEMPLATES
// ═══════════════════════════════════════════════════════════════

/**
 * Admin Account Approved - Super Admin approved your application
 */
export const adminApprovalTemplate = (fullname, role, permissions) => {
  const roleDisplay = role === 'super_admin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'Moderator';
  
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <h1>✅ Admin Account Approved!</h1>
      <p>Welcome to the ${appConfig.appName} Admin Team</p>
    </div>
    <div class="content">
      <p>Hi <strong>${fullname}</strong>,</p>
      <p><strong>Congratulations!</strong> Your admin application has been approved. You now have official access to the ${appConfig.appName} administrative platform.</p>
      
      <div class="success-box">
        <div style="text-align: center; margin: 20px 0;">
          <div style="font-size: 48px; margin-bottom: 15px;">👮</div>
          <div style="font-size: 24px; font-weight: bold; color: #4caf50;">
            ${roleDisplay} Access Granted
          </div>
          <div style="color: #666; margin-top: 10px;">Your account is now active</div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; margin: 20px 0;">
        <h2 style="margin: 0 0 15px 0; font-size: 24px; color: white;">🎯 Your Role: ${roleDisplay}</h2>
        <p style="margin: 0; line-height: 1.8; opacity: 0.95; font-size: 15px;">
          As ${role === 'super_admin' ? 'a Super Admin' : role === 'admin' ? 'an Admin' : 'a Moderator'}, 
          you have been entrusted with important responsibilities to help manage and grow the ${appConfig.appName} platform.
        </p>
      </div>

      <div class="info-box" style="background: #e8f5e9; border-color: #4caf50;">
        <strong style="color: #2e7d32;">🔑 Your Permissions:</strong>
        <ul style="color: #2e7d32;">
          ${permissions.map(perm => `<li>✅ ${perm.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>`).join('')}
        </ul>
      </div>

      <div class="info-box">
        <strong>🚀 What You Can Do Now:</strong>
        <ul>
          ${role === 'super_admin' ? `
            <li>Approve or reject admin applications</li>
            <li>Approve or reject user registrations</li>
            <li>Manage all users and admins</li>
            <li>Ban/suspend users</li>
            <li>View analytics and reports</li>
            <li>Access system logs</li>
            <li>Manage platform settings</li>
          ` : role === 'admin' ? `
            <li>Approve or reject user registrations</li>
            <li>Approve new admin applications</li>
            <li>Manage regular users</li>
            <li>Ban/suspend users</li>
            <li>View analytics and reports</li>
            <li>Access activity logs</li>
          ` : `
            <li>Approve or reject user registrations</li>
            <li>Review user profiles</li>
            <li>Monitor platform activity</li>
            <li>Handle user reports</li>
          `}
        </ul>
      </div>

      <div class="warning-box">
        <strong>⚠️ Important Guidelines:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Always act professionally and fairly</li>
          <li>Review all decisions carefully before taking action</li>
          <li>Document important actions with clear reasons</li>
          <li>Respect user privacy and data protection laws</li>
          <li>Report any security issues immediately</li>
          <li>Follow the admin code of conduct at all times</li>
        </ul>
      </div>

      <center>
        <a href="${appConfig.appUrl}/admin/dashboard" class="button" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          🎯 Access Admin Dashboard
        </a>
      </center>

      <div class="divider"></div>

      <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 12px; border: 2px solid #dee2e6;">
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">🤝</div>
          <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold; color: #333;">
            Welcome to the Team!
          </p>
          <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
            You're now part of an elite group responsible for maintaining the quality and integrity of ${appConfig.appName}. 
            We trust you to make fair decisions and help our community thrive.
          </p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
          <strong>Quick Links</strong>
        </p>
        <div>
          <a href="${appConfig.appUrl}/admin/guidelines" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-weight: 600;">
            📖 Admin Guidelines
          </a>
          <span style="color: #dee2e6;">•</span>
          <a href="${appConfig.appUrl}/admin/help" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-weight: 600;">
            💡 Help Center
          </a>
          <span style="color: #dee2e6;">•</span>
          <a href="mailto:${appConfig.supportEmail}" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-weight: 600;">
            📧 Contact Support
          </a>
        </div>
      </div>

      <p style="text-align: center; margin-top: 30px; color: #666; font-size: 13px;">
        Questions about your admin role?<br>
        Contact the Super Admin team at <a href="mailto:admin@${appConfig.appUrl.replace('https://', '').replace('http://', '')}">admin@${appConfig.appUrl.replace('https://', '').replace('http://', '')}</a>
      </p>
    </div>
  `;
  return baseTemplate(content);
};

/**
 * Admin Account Rejected - Application not approved
 */
export const adminRejectionTemplate = (fullname, reason) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">
      <h1>📋 Admin Application Update</h1>
      <p>Regarding your admin application</p>
    </div>
    <div class="content">
      <p>Hi <strong>${fullname}</strong>,</p>
      <p>Thank you for your interest in joining the ${appConfig.appName} admin team. After careful review of your application, we're unable to approve your admin account at this time.</p>
      
      <div class="warning-box">
        <strong>📌 Application Status: Not Approved</strong>
        <p style="margin-top: 15px;"><strong>Reason for decision:</strong></p>
        <p style="margin-top: 10px; padding: 15px; background: white; border-radius: 8px;">
          ${reason || 'Your application did not meet the current requirements for admin access.'}
        </p>
      </div>

      <div class="info-box">
        <strong>💡 What This Means:</strong>
        <ul>
          <li>Your regular user account remains active and unaffected</li>
          <li>You can continue using ${appConfig.appName} as a ${reason?.includes('client') ? 'client' : 'employee'}</li>
          <li>Admin privileges require meeting specific criteria and trust levels</li>
          <li>This decision is based on current platform needs and security requirements</li>
        </ul>
      </div>

      <div class="info-box" style="background: #e3f2fd; border-color: #2196f3;">
        <strong style="color: #1565c0;">🔄 Future Opportunities:</strong>
        <p style="color: #1565c0; margin-top: 10px;">
          While your application wasn't approved this time, we periodically review applications for admin positions. 
          You're welcome to reapply in the future after:
        </p>
        <ul style="color: #1565c0; margin-top: 10px;">
          <li>Building a strong reputation on the platform</li>
          <li>Demonstrating leadership and responsibility</li>
          <li>Gaining more experience with our community</li>
          <li>Contributing positively to the platform</li>
        </ul>
        <p style="color: #1565c0; margin-top: 10px;">
          <strong>Reapplication Period:</strong> You can reapply after <strong>90 days</strong> from this notice.
        </p>
      </div>

      <div class="info-box" style="background: #e8f5e9; border-color: #4caf50;">
        <strong style="color: #2e7d32;">🌟 How to Strengthen Future Applications:</strong>
        <ul style="color: #2e7d32;">
          <li>Complete more projects/jobs successfully</li>
          <li>Maintain excellent user ratings and reviews</li>
          <li>Follow platform guidelines consistently</li>
          <li>Build trust within the community</li>
          <li>Demonstrate problem-solving abilities</li>
          <li>Show commitment to platform values</li>
        </ul>
      </div>

      <div class="divider"></div>

      <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 12px; border: 2px solid #dee2e6; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 15px;">💪</div>
        <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold; color: #333;">
          Keep Growing on ${appConfig.appName}
        </p>
        <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
          Your journey with us doesn't end here. Focus on building your profile, 
          completing quality work, and contributing to our community. Success often comes 
          to those who demonstrate consistency and excellence over time.
        </p>
      </div>

      <center style="margin-top: 30px;">
        <a href="${appConfig.appUrl}/dashboard" class="button" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          Continue to Dashboard
        </a>
      </center>

      <p style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
        <strong>Have Questions?</strong><br>
        If you'd like more specific feedback about your application or need clarification, 
        please contact our admin team at <a href="mailto:admin@${appConfig.appUrl.replace('https://', '').replace('http://', '')}">admin@${appConfig.appUrl.replace('https://', '').replace('http://', '')}</a>
      </p>

      <p style="text-align: center; margin-top: 20px; color: #999; font-size: 13px;">
        Thank you for your interest in helping manage ${appConfig.appName}.<br>
        We appreciate your understanding and continued participation in our community.
      </p>
    </div>
  `;
  return baseTemplate(content);
};

/**
 * Admin Welcome Email - First login after approval
 */
export const adminWelcomeTemplate = (fullname, role) => {
  const roleDisplay = role === 'super_admin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'Moderator';
  
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <h1>🎉 Welcome, ${roleDisplay}!</h1>
      <p>You're officially part of the admin team</p>
    </div>
    <div class="content">
      <p>Hi <strong>${fullname}</strong>,</p>
      <p>Welcome aboard! You're now an official member of the ${appConfig.appName} administrative team.</p>
      
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 12px; color: white; margin: 30px 0; text-align: center;">
        <div style="font-size: 64px; margin-bottom: 20px;">🛡️</div>
        <h2 style="margin: 0 0 15px 0; font-size: 28px; color: white;">Your Admin Journey Begins</h2>
        <p style="margin: 0; line-height: 1.8; opacity: 0.95; font-size: 16px;">
          You've been selected to help maintain quality, fairness, and growth on ${appConfig.appName}. 
          This is a position of trust and responsibility.
        </p>
      </div>

      <div class="info-box">
        <strong>🎯 Your First Steps:</strong>
        <ul>
          <li><strong>Step 1:</strong> Familiarize yourself with the admin dashboard</li>
          <li><strong>Step 2:</strong> Read the admin guidelines and policies</li>
          <li><strong>Step 3:</strong> Review pending user applications</li>
          <li><strong>Step 4:</strong> Set up your work schedule and availability</li>
          <li><strong>Step 5:</strong> Introduce yourself to the admin team</li>
        </ul>
      </div>

      <div class="info-box" style="background: #fff3e0; border-color: #ff9800;">
        <strong style="color: #e65100;">⚡ Quick Tips for Success:</strong>
        <ul style="color: #e65100;">
          <li>Always be fair and objective in your decisions</li>
          <li>Document your actions with clear reasoning</li>
          <li>When in doubt, consult senior admins</li>
          <li>Respond to queries promptly</li>
          <li>Keep user privacy and security paramount</li>
          <li>Stay updated on platform policies</li>
        </ul>
      </div>

      <center>
        <a href="${appConfig.appUrl}/admin/onboarding" class="button" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          🚀 Start Admin Onboarding
        </a>
      </center>

      <div class="divider"></div>

      <div style="background: #e8f5e9; padding: 25px; border-radius: 12px; border-left: 4px solid #4caf50;">
        <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #2e7d32;">
          🤝 Admin Code of Conduct
        </p>
        <ul style="color: #2e7d32; margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>Treat all users with respect and professionalism</li>
          <li>Make decisions based on evidence, not assumptions</li>
          <li>Maintain confidentiality of sensitive information</li>
          <li>Report conflicts of interest immediately</li>
          <li>Never abuse admin powers for personal gain</li>
          <li>Collaborate with fellow admins constructively</li>
        </ul>
      </div>

      <p style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
        <strong>Need Help Getting Started?</strong><br>
        <a href="${appConfig.appUrl}/admin/training">Admin Training Center</a> • 
        <a href="${appConfig.appUrl}/admin/guidelines">Guidelines & Policies</a> • 
        <a href="mailto:${appConfig.supportEmail}">Contact Senior Admin</a>
      </p>
    </div>
  `;
  return baseTemplate(content);
};




// ═══════════════════════════════════════════════════════════════
//          🎯 JOB MATCH NOTIFICATION (FOR EMPLOYEES)
// ═══════════════════════════════════════════════════════════════

export const jobMatchTemplate = (
  employeeName,
  jobTitle,
  needFor,
  currency,
  price,
  requiredSkills,
  clientName,
  jobId
) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <h1>🎯 New Job Match!</h1>
      <p>A job matching your skills just dropped</p>
    </div>
    <div class="content">
      <p>Hi <strong>${employeeName}</strong>,</p>
      <p>A new <strong>${needFor}</strong> job was just posted that matches your skills. Be one of the first to apply!</p>

      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; margin: 20px 0;">
        <h2 style="margin: 0 0 10px 0; font-size: 24px; color: white;">📋 ${jobTitle}</h2>
        <p style="margin: 0; opacity: 0.9; font-size: 15px;">Posted by <strong>${clientName}</strong></p>
      </div>

      <div class="payment-details">
        <div class="payment-row">
          <span><strong>💼 Job Type:</strong></span>
          <span>${needFor}</span>
        </div>
        <div class="payment-row">
          <span><strong>💰 Budget:</strong></span>
          <span style="color: #4caf50; font-weight: bold;">${currency} ${Number(price).toLocaleString('en-IN')}</span>
        </div>
        <div class="payment-row">
          <span><strong>🎯 Required Skills:</strong></span>
          <span>${requiredSkills.join(', ')}</span>
        </div>
      </div>

      <div class="info-box" style="background: #e8f5e9; border-color: #4caf50;">
        <strong style="color: #2e7d32;">⚡ Apply Early — Get Noticed!</strong>
        <p style="color: #2e7d32; margin-top: 10px;">
          Clients review the first few applications most carefully.
          Be quick and write a personalized proposal to stand out!
        </p>
      </div>

      <center>
        <a href="${appConfig.appUrl}/jobs/${jobId}" class="button"
           style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          🚀 View &amp; Apply Now
        </a>
      </center>

      <p style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        You received this because your skills match this job posting.<br>
        <a href="${appConfig.appUrl}/settings/notifications">Manage Notification Preferences</a>
      </p>
    </div>
  `;
  return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════
//          📩 NEW APPLICATION RECEIVED (FOR CLIENTS)
// ═══════════════════════════════════════════════════════════════

export const newApplicationTemplate = (
  clientName,
  applicantName,
  jobTitle,
  jobId,
  applicantSkills = []
) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);">
      <h1>📩 New Application!</h1>
      <p>Someone just applied to your job</p>
    </div>
    <div class="content">
      <p>Hi <strong>${clientName}</strong>,</p>
      <p><strong>${applicantName}</strong> has just submitted an application for your job posting.</p>

      <div style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); padding: 30px; border-radius: 12px; color: white; margin: 20px 0;">
        <h2 style="margin: 0 0 10px 0; font-size: 24px; color: white;">📋 ${jobTitle}</h2>
        <p style="margin: 0; opacity: 0.9; font-size: 15px;">New application from <strong>${applicantName}</strong></p>
      </div>

      ${applicantSkills.length > 0 ? `
        <div class="info-box">
          <strong>🛠️ Applicant Skills:</strong>
          <p style="margin-top: 10px;">${applicantSkills.join(' &bull; ')}</p>
        </div>
      ` : ''}

      <div class="info-box" style="background: #e3f2fd; border-color: #2196f3;">
        <strong style="color: #1565c0;">⚡ Review Quickly:</strong>
        <p style="color: #1565c0; margin-top: 10px;">
          Responding quickly encourages talented editors to stay engaged.
          The best candidates often have multiple offers — don't miss out!
        </p>
      </div>

      <center>
        <a href="${appConfig.appUrl}/jobs/${jobId}/applications" class="button"
           style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);">
          👀 Review Application
        </a>
      </center>

      <p style="text-align: center; margin-top: 20px; color: #666; font-size: 13px;">
        Questions? <a href="mailto:${appConfig.supportEmail}">Contact Support</a>
      </p>
    </div>
  `;
  return baseTemplate(content);
};

// ═══════════════════════════════════════════════════════════════
//          🎉 JOB COMPLETED (FOR BOTH CLIENT + EMPLOYEE)
// ═══════════════════════════════════════════════════════════════

export const jobCompletedTemplate = (userName, jobTitle, role, jobId) => {
  const isClient = role === 'client';

  const content = `
    <div class="header" style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);">
      <h1>🎉 Job Completed!</h1>
      <p>${isClient ? 'Your project has been delivered' : 'Great work — project complete!'}</p>
    </div>
    <div class="content">
      <p>Hi <strong>${userName}</strong>,</p>
      <p>
        ${isClient
          ? `The job <strong>"${jobTitle}"</strong> has been successfully completed by your hired editor.`
          : `The job <strong>"${jobTitle}"</strong> has been marked as complete by the client.`
        }
      </p>

      <div class="success-box">
        <div style="text-align: center; margin: 20px 0;">
          <div style="font-size: 64px;">🎉</div>
          <div style="font-size: 24px; font-weight: bold; color: #4caf50; margin-top: 10px;">
            Successfully Completed
          </div>
          <div style="color: #666; margin-top: 8px; font-size: 14px;">
            ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      <div class="payment-details">
        <div class="payment-row">
          <span><strong>Job Title:</strong></span>
          <span>${jobTitle}</span>
        </div>
        <div class="payment-row">
          <span><strong>Status:</strong></span>
          <span style="color: #4caf50; font-weight: bold;">✅ Completed</span>
        </div>
      </div>

      ${isClient ? `
        <div class="info-box" style="background: #e8f5e9; border-color: #4caf50;">
          <strong style="color: #2e7d32;">⭐ Leave a Review:</strong>
          <p style="color: #2e7d32; margin-top: 10px;">
            Help other clients by sharing your experience. Your review helps great editors 
            grow their careers on ${appConfig.appName}!
          </p>
        </div>
        <center>
          <a href="${appConfig.appUrl}/jobs/${jobId}/review" class="button"
             style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);">
            ⭐ Leave a Review
          </a>
        </center>
      ` : `
        <div class="info-box" style="background: #e8f5e9; border-color: #4caf50;">
          <strong style="color: #2e7d32;">💰 Payment Released:</strong>
          <p style="color: #2e7d32; margin-top: 10px;">
            The project payment has been released to your wallet.
            You can withdraw it to your bank account anytime.
          </p>
        </div>
        <center>
          <a href="${appConfig.appUrl}/wallet" class="button"
             style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);">
            💰 View Wallet
          </a>
        </center>
      `}

      <p style="text-align: center; margin-top: 30px; color: #666; font-size: 13px;">
        Need help? <a href="mailto:${appConfig.supportEmail}">${appConfig.supportEmail}</a>
      </p>
    </div>
  `;
  return baseTemplate(content);
};



// services/Email/paymentEmailTemplates.js



/**
 * ════════════════════════════════════════════════════════════════
 *              💰 PAYMENT EMAIL TEMPLATES
 *         Professional Invoices & Receipts with GST
 * ════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
//              BASE INVOICE TEMPLATE (WITH GST)
// ═══════════════════════════════════════════════════════════════
const invoiceTemplate = (content, invoiceData) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - ${invoiceData.invoiceNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
        }
        .email-wrapper {
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .header-left h1 {
            font-size: 28px;
            margin-bottom: 5px;
        }
        .header-left p {
            opacity: 0.9;
            font-size: 14px;
        }
        .header-right {
            text-align: right;
        }
        .invoice-badge {
            background: rgba(255,255,255,0.2);
            padding: 8px 20px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        .invoice-number {
            font-size: 20px;
            font-weight: bold;
        }
        .content {
            padding: 40px 30px;
        }
        
        /* Invoice Specific Styles */
        .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e0e0e0;
        }
        .invoice-party {
            flex: 1;
        }
        .invoice-party h3 {
            color: #667eea;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        .invoice-party p {
            margin: 5px 0;
            font-size: 14px;
            line-height: 1.8;
        }
        .invoice-party strong {
            font-size: 16px;
            display: block;
            margin-bottom: 5px;
        }
        
        /* Table Styles */
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        .invoice-table thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .invoice-table th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .invoice-table th:last-child,
        .invoice-table td:last-child {
            text-align: right;
        }
        .invoice-table tbody tr {
            border-bottom: 1px solid #e0e0e0;
        }
        .invoice-table tbody tr:hover {
            background: #f8f9fa;
        }
        .invoice-table td {
            padding: 15px;
            font-size: 14px;
        }
        .invoice-table .item-description {
            color: #666;
            font-size: 13px;
            margin-top: 5px;
        }
        
        /* Totals Section */
        .invoice-totals {
            margin-top: 30px;
            margin-left: auto;
            width: 350px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 20px;
            font-size: 14px;
        }
        .total-row.subtotal {
            background: #f8f9fa;
            border-radius: 8px 8px 0 0;
        }
        .total-row.tax {
            background: #f8f9fa;
            border-top: 1px solid #e0e0e0;
        }
        .total-row.discount {
            background: #e8f5e9;
            color: #2e7d32;
        }
        .total-row.grand-total {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 18px;
            font-weight: bold;
            border-radius: 0 0 8px 8px;
            padding: 20px;
        }
        
        /* GST Breakdown */
        .gst-breakdown {
            background: #e3f2fd;
            border: 1px solid #2196f3;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        .gst-breakdown h4 {
            color: #1565c0;
            margin-bottom: 15px;
            font-size: 16px;
        }
        .gst-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
            color: #1565c0;
        }
        .gst-row strong {
            font-weight: 600;
        }
        
        /* Payment Info */
        .payment-info {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        .payment-info h4 {
            color: #333;
            margin-bottom: 15px;
            font-size: 16px;
        }
        .payment-detail {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
            border-bottom: 1px solid #e0e0e0;
        }
        .payment-detail:last-child {
            border-bottom: none;
        }
        .payment-detail .label {
            color: #666;
        }
        .payment-detail .value {
            font-weight: 600;
            font-family: monospace;
        }
        
        /* Notes Section */
        .notes-section {
            background: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
        }
        .notes-section h4 {
            color: #e65100;
            margin-bottom: 10px;
            font-size: 14px;
            text-transform: uppercase;
        }
        .notes-section p {
            color: #e65100;
            font-size: 13px;
            line-height: 1.8;
        }
        
        /* Terms & Conditions */
        .terms-section {
            background: #f8f9fa;
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
            font-size: 12px;
            color: #666;
        }
        .terms-section h4 {
            color: #333;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .terms-section ul {
            padding-left: 20px;
            margin: 10px 0;
        }
        .terms-section li {
            margin: 5px 0;
        }
        
        /* Stamp Section */
        .stamp-section {
            text-align: right;
            margin-top: 40px;
            padding: 20px;
        }
        .stamp {
            display: inline-block;
            border: 2px solid #667eea;
            padding: 15px 25px;
            border-radius: 8px;
            text-align: center;
        }
        .stamp-text {
            font-size: 12px;
            color: #667eea;
            font-weight: 600;
            text-transform: uppercase;
        }
        .stamp-signature {
            margin-top: 30px;
            font-size: 14px;
        }
        
        /* Footer */
        .invoice-footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
            font-size: 13px;
            color: #666;
        }
        .invoice-footer p {
            margin: 5px 0;
        }
        
        /* Download Button */
        .download-section {
            text-align: center;
            margin: 30px 0;
        }
        .download-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        /* Print Styles */
        @media print {
            .email-wrapper {
                background: white;
                padding: 0;
            }
            .download-section {
                display: none;
            }
        }
        
        @media only screen and (max-width: 600px) {
            .header {
                flex-direction: column;
            }
            .header-right {
                text-align: left;
                margin-top: 20px;
            }
            .invoice-header {
                flex-direction: column;
            }
            .invoice-party {
                margin-bottom: 20px;
            }
            .invoice-totals {
                width: 100%;
            }
            .invoice-table {
                font-size: 12px;
            }
            .invoice-table th,
            .invoice-table td {
                padding: 10px 5px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="container">
            ${content}
        </div>
    </div>
</body>
</html>
`;

// ═══════════════════════════════════════════════════════════════
//          1️⃣ CLIENT: PAYMENT SUCCESS + INVOICE (WITH GST)
// ═══════════════════════════════════════════════════════════════

export const clientPaymentSuccessInvoiceTemplate = ({
  clientName,
  clientEmail,
  clientAddress,
  clientGSTIN,
  invoiceNumber,
  invoiceDate,
  dueDate,
  projectName,
  projectDescription,
  employeeName,
  amount,
  platformFee,
  gstPercentage = 18,
  cgst,
  sgst,
  igst,
  totalAmount,
  paymentId,
  orderId,
  paymentMethod,
  paymentDate,
  companyDetails = {
    name: appConfig.appName,
    address: "123 Business Park, Tech City, Mumbai - 400001",
    gstin: "27AABCU9603R1ZX",
    pan: "AABCU9603R",
    email: appConfig.supportEmail,
    phone: "+91 1234567890",
  }
}) => {
  const content = `
    <div class="header">
      <div class="header-left">
        <h1>${companyDetails.name}</h1>
        <p>Professional Video Editing Platform</p>
      </div>
      <div class="header-right">
        <div class="invoice-badge">TAX INVOICE</div>
        <div class="invoice-number">#${invoiceNumber}</div>
      </div>
    </div>

    <div class="content">
      <!-- Invoice Header with Parties -->
      <div class="invoice-header">
        <div class="invoice-party">
          <h3>From (Service Provider)</h3>
          <strong>${companyDetails.name}</strong>
          <p>${companyDetails.address}</p>
          <p><strong>GSTIN:</strong> ${companyDetails.gstin}</p>
          <p><strong>PAN:</strong> ${companyDetails.pan}</p>
          <p><strong>Email:</strong> ${companyDetails.email}</p>
          <p><strong>Phone:</strong> ${companyDetails.phone}</p>
        </div>

        <div class="invoice-party">
          <h3>Bill To (Customer)</h3>
          <strong>${clientName}</strong>
          <p>${clientEmail}</p>
          ${clientAddress ? `<p>${clientAddress}</p>` : ''}
          ${clientGSTIN ? `<p><strong>GSTIN:</strong> ${clientGSTIN}</p>` : '<p><em>Unregistered (No GSTIN)</em></p>'}
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <p style="font-size: 14px; color: #666;"><strong>Invoice Date:</strong> ${new Date(invoiceDate).toLocaleDateString('en-IN')}</p>
          <p style="font-size: 14px; color: #666;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString('en-IN')}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 14px; color: #666;"><strong>Payment Status:</strong> <span style="color: #4caf50; font-weight: bold;">✅ PAID</span></p>
          <p style="font-size: 14px; color: #666;"><strong>Payment Date:</strong> ${new Date(paymentDate).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      <!-- Services Table -->
      <table class="invoice-table">
        <thead>
          <tr>
            <th style="width: 50%;">Description</th>
            <th style="width: 15%;">HSN/SAC</th>
            <th style="width: 15%;">Qty</th>
            <th style="width: 20%;">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${projectName}</strong>
              <div class="item-description">${projectDescription}</div>
              <div class="item-description"><em>Editor: ${employeeName}</em></div>
            </td>
            <td>998599</td>
            <td>1</td>
            <td style="text-align: right;">₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td>
              <strong>Platform Service Fee</strong>
              <div class="item-description">Transaction processing & platform maintenance</div>
            </td>
            <td>998599</td>
            <td>1</td>
            <td style="text-align: right;">₹${platformFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>

      <!-- GST Breakdown -->
      <div class="gst-breakdown">
        <h4>📊 GST Breakdown (@ ${gstPercentage}%)</h4>
        ${cgst && sgst ? `
          <div class="gst-row">
            <span>CGST @ ${gstPercentage/2}%</span>
            <strong>₹${cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
          </div>
          <div class="gst-row">
            <span>SGST @ ${gstPercentage/2}%</span>
            <strong>₹${sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
          </div>
        ` : ''}
        ${igst ? `
          <div class="gst-row">
            <span>IGST @ ${gstPercentage}%</span>
            <strong>₹${igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
          </div>
        ` : ''}
        <div class="gst-row" style="border-top: 2px solid #2196f3; margin-top: 10px; padding-top: 10px;">
          <span><strong>Total GST</strong></span>
          <strong>₹${(cgst + sgst + igst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>

      <!-- Totals -->
      <div class="invoice-totals">
        <div class="total-row subtotal">
          <span>Subtotal</span>
          <strong>₹${(amount + platformFee).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div class="total-row tax">
          <span>GST (${gstPercentage}%)</span>
          <strong>₹${(cgst + sgst + igst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div class="total-row grand-total">
          <span>TOTAL AMOUNT PAID</span>
          <strong>₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>

      <!-- Amount in Words -->
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 14px; color: #666;">
          <strong>Amount in Words:</strong> 
          <span style="color: #333; text-transform: capitalize;">Rupees ${numberToWords(totalAmount)} Only</span>
        </p>
      </div>

      <!-- Payment Information -->
      <div class="payment-info">
        <h4>💳 Payment Details</h4>
        <div class="payment-detail">
          <span class="label">Payment Method:</span>
          <span class="value">${paymentMethod}</span>
        </div>
        <div class="payment-detail">
          <span class="label">Transaction ID:</span>
          <span class="value">${paymentId}</span>
        </div>
        <div class="payment-detail">
          <span class="label">Order ID:</span>
          <span class="value">${orderId}</span>
        </div>
        <div class="payment-detail">
          <span class="label">Payment Date:</span>
          <span class="value">${new Date(paymentDate).toLocaleString('en-IN')}</span>
        </div>
        <div class="payment-detail">
          <span class="label">Status:</span>
          <span class="value" style="color: #4caf50; font-weight: bold;">✅ PAID</span>
        </div>
      </div>

      <!-- Notes -->
      <div class="notes-section">
        <h4>📝 Important Notes</h4>
        <p>
          • This is a computer-generated invoice and does not require a physical signature.<br>
          • Payment has been processed through Razorpay payment gateway.<br>
          • For any queries regarding this invoice, please contact us at ${companyDetails.email}<br>
          • Please retain this invoice for your tax records.
        </p>
      </div>

      <!-- Terms & Conditions -->
      <div class="terms-section">
        <h4>Terms & Conditions</h4>
        <ul>
          <li>All payments are processed through Razorpay</li>
          <li>Platform fee is non-refundable</li>
          <li>Project amount will be held in escrow until completion</li>
          <li>Refunds (if applicable) will be processed as per our refund policy</li>
          <li>Subject to Mumbai Jurisdiction</li>
        </ul>
      </div>

      <!-- Digital Stamp -->
      <div class="stamp-section">
        <div class="stamp">
          <div class="stamp-text">Authorized Signatory</div>
          <div class="stamp-signature">
            <p style="margin-top: 20px; font-style: italic; color: #667eea;">For ${companyDetails.name}</p>
          </div>
        </div>
      </div>

      <!-- Download Button -->
      <div class="download-section">
        <a href="${appConfig.appUrl}/invoices/${invoiceNumber}/download" class="download-button">
          📄 Download PDF Invoice
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="invoice-footer">
      <p><strong>${companyDetails.name}</strong></p>
      <p>${companyDetails.address}</p>
      <p>GSTIN: ${companyDetails.gstin} | PAN: ${companyDetails.pan}</p>
      <p>Email: ${companyDetails.email} | Phone: ${companyDetails.phone}</p>
      <p style="margin-top: 15px; font-size: 12px; color: #999;">
        This is a system-generated invoice. For queries, contact support.
      </p>
    </div>
  `;

  return invoiceTemplate(content, { invoiceNumber });
};

// ═══════════════════════════════════════════════════════════════
//       HELPER: Convert Number to Words (Indian System)
// ═══════════════════════════════════════════════════════════════
function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num === 0) return 'Zero';

  let words = '';
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = Math.floor((num % 1000) / 100);
  const remainder = num % 100;

  if (crore > 0) words += numberToWords(crore) + ' Crore ';
  if (lakh > 0) words += numberToWords(lakh) + ' Lakh ';
  if (thousand > 0) words += numberToWords(thousand) + ' Thousand ';
  if (hundred > 0) words += ones[hundred] + ' Hundred ';

  if (remainder >= 20) {
    words += tens[Math.floor(remainder / 10)] + ' ';
    if (remainder % 10 > 0) words += ones[remainder % 10];
  } else if (remainder >= 10) {
    words += teens[remainder - 10];
  } else if (remainder > 0) {
    words += ones[remainder];
  }

  return words.trim();
}



// services/Email/paymentEmailTemplates.js

// ... (your existing invoice template code)

// ═══════════════════════════════════════════════════════════════
//     💳 SUBSCRIPTION PAYMENT TEMPLATES (ADD BELOW INVOICES)
// ═══════════════════════════════════════════════════════════════

/**
 * Subscription Payment Invoice - Premium Subscription
 */
export const subscriptionPaymentInvoiceTemplate = ({
  clientName,
  clientEmail,
  clientAddress,
  clientGSTIN,
  invoiceNumber,
  invoiceDate,
  planName,
  planType,
  planPrice,
  startDate,
  endDate,
  gstPercentage = 18,
  cgst,
  sgst,
  igst,
  totalAmount,
  paymentId,
  orderId,
  paymentMethod,
  paymentDate,
  companyDetails = {
    name: appConfig.appName,
    address: "123 Business Park, Tech City, Mumbai - 400001",
    gstin: "27AABCU9603R1ZX",
    pan: "AABCU9603R",
    email: appConfig.supportEmail,
    phone: "+91 1234567890",
  }
}) => {
  const content = `
    <div class="header">
      <div class="header-left">
        <h1>${companyDetails.name}</h1>
        <p>Professional Video Editing Platform</p>
      </div>
      <div class="header-right">
        <div class="invoice-badge">SUBSCRIPTION INVOICE</div>
        <div class="invoice-number">#${invoiceNumber}</div>
      </div>
    </div>

    <div class="content">
      <!-- Invoice Header -->
      <div class="invoice-header">
        <div class="invoice-party">
          <h3>From (Service Provider)</h3>
          <strong>${companyDetails.name}</strong>
          <p>${companyDetails.address}</p>
          <p><strong>GSTIN:</strong> ${companyDetails.gstin}</p>
          <p><strong>PAN:</strong> ${companyDetails.pan}</p>
          <p><strong>Email:</strong> ${companyDetails.email}</p>
          <p><strong>Phone:</strong> ${companyDetails.phone}</p>
        </div>

        <div class="invoice-party">
          <h3>Bill To (Customer)</h3>
          <strong>${clientName}</strong>
          <p>${clientEmail}</p>
          ${clientAddress ? `<p>${clientAddress}</p>` : ''}
          ${clientGSTIN ? `<p><strong>GSTIN:</strong> ${clientGSTIN}</p>` : '<p><em>Unregistered (No GSTIN)</em></p>'}
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <p style="font-size: 14px; color: #666;"><strong>Invoice Date:</strong> ${new Date(invoiceDate).toLocaleDateString('en-IN')}</p>
          <p style="font-size: 14px; color: #666;"><strong>Subscription Period:</strong> ${new Date(startDate).toLocaleDateString('en-IN')} - ${new Date(endDate).toLocaleDateString('en-IN')}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 14px; color: #666;"><strong>Payment Status:</strong> <span style="color: #4caf50; font-weight: bold;">✅ PAID</span></p>
          <p style="font-size: 14px; color: #666;"><strong>Payment Date:</strong> ${new Date(paymentDate).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      <!-- Services Table -->
      <table class="invoice-table">
        <thead>
          <tr>
            <th style="width: 50%;">Description</th>
            <th style="width: 15%;">HSN/SAC</th>
            <th style="width: 15%;">Period</th>
            <th style="width: 20%;">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${planName} Subscription</strong>
              <div class="item-description">Premium platform access with enhanced features</div>
              <div class="item-description"><em>Plan Type: ${planType}</em></div>
            </td>
            <td>998599</td>
            <td>30 Days</td>
            <td style="text-align: right;">₹${planPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>

      <!-- GST Breakdown -->
      <div class="gst-breakdown">
        <h4>📊 GST Breakdown (@ ${gstPercentage}%)</h4>
        ${cgst && sgst ? `
          <div class="gst-row">
            <span>CGST @ ${gstPercentage/2}%</span>
            <strong>₹${cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
          </div>
          <div class="gst-row">
            <span>SGST @ ${gstPercentage/2}%</span>
            <strong>₹${sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
          </div>
        ` : ''}
        ${igst ? `
          <div class="gst-row">
            <span>IGST @ ${gstPercentage}%</span>
            <strong>₹${igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
          </div>
        ` : ''}
        <div class="gst-row" style="border-top: 2px solid #2196f3; margin-top: 10px; padding-top: 10px;">
          <span><strong>Total GST</strong></span>
          <strong>₹${((cgst || 0) + (sgst || 0) + (igst || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>

      <!-- Totals -->
      <div class="invoice-totals">
        <div class="total-row subtotal">
          <span>Subtotal</span>
          <strong>₹${planPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div class="total-row tax">
          <span>GST (${gstPercentage}%)</span>
          <strong>₹${((cgst || 0) + (sgst || 0) + (igst || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div class="total-row grand-total">
          <span>TOTAL AMOUNT PAID</span>
          <strong>₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>

      <!-- Amount in Words -->
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 14px; color: #666;">
          <strong>Amount in Words:</strong> 
          <span style="color: #333; text-transform: capitalize;">Rupees ${numberToWords(totalAmount)} Only</span>
        </p>
      </div>

      <!-- Payment Information -->
      <div class="payment-info">
        <h4>💳 Payment Details</h4>
        <div class="payment-detail">
          <span class="label">Payment Method:</span>
          <span class="value">${paymentMethod}</span>
        </div>
        <div class="payment-detail">
          <span class="label">Transaction ID:</span>
          <span class="value">${paymentId}</span>
        </div>
        <div class="payment-detail">
          <span class="label">Order ID:</span>
          <span class="value">${orderId}</span>
        </div>
        <div class="payment-detail">
          <span class="label">Payment Date:</span>
          <span class="value">${new Date(paymentDate).toLocaleString('en-IN')}</span>
        </div>
        <div class="payment-detail">
          <span class="label">Status:</span>
          <span class="value" style="color: #4caf50; font-weight: bold;">✅ PAID</span>
        </div>
      </div>

      <!-- Subscription Details -->
      <div class="payment-info" style="background: #e8f5e9; border: 1px solid #4caf50;">
        <h4 style="color: #2e7d32;">🎯 Subscription Details</h4>
        <div class="payment-detail">
          <span class="label">Plan:</span>
          <span class="value">${planName}</span>
        </div>
        <div class="payment-detail">
          <span class="label">Valid From:</span>
          <span class="value">${new Date(startDate).toLocaleDateString('en-IN')}</span>
        </div>
        <div class="payment-detail">
          <span class="label">Valid Until:</span>
          <span class="value">${new Date(endDate).toLocaleDateString('en-IN')}</span>
        </div>
        <div class="payment-detail">
          <span class="label">Auto-Renewal:</span>
          <span class="value">Enabled</span>
        </div>
      </div>

      <!-- Notes -->
      <div class="notes-section">
        <h4>📝 Important Notes</h4>
        <p>
          • This is a computer-generated invoice for subscription services.<br>
          • Payment has been processed through Razorpay payment gateway.<br>
          • Subscription will auto-renew unless cancelled before expiry date.<br>
          • For cancellation or queries, contact us at ${companyDetails.email}<br>
          • Please retain this invoice for your tax records.
        </p>
      </div>

      <!-- Terms & Conditions -->
      <div class="terms-section">
        <h4>Terms & Conditions</h4>
        <ul>
          <li>All payments are processed through Razorpay</li>
          <li>Subscription fees are non-refundable after activation</li>
          <li>Auto-renewal can be cancelled anytime before expiry</li>
          <li>Premium features are active for the subscription period only</li>
          <li>Subject to Mumbai Jurisdiction</li>
        </ul>
      </div>

      <!-- Digital Stamp -->
      <div class="stamp-section">
        <div class="stamp">
          <div class="stamp-text">Authorized Signatory</div>
          <div class="stamp-signature">
            <p style="margin-top: 20px; font-style: italic; color: #667eea;">For ${companyDetails.name}</p>
          </div>
        </div>
      </div>

      <!-- Download Button -->
      <div class="download-section">
        <a href="${appConfig.appUrl}/invoices/subscription/${invoiceNumber}/download" class="download-button">
          📄 Download PDF Invoice
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="invoice-footer">
      <p><strong>${companyDetails.name}</strong></p>
      <p>${companyDetails.address}</p>
      <p>GSTIN: ${companyDetails.gstin} | PAN: ${companyDetails.pan}</p>
      <p>Email: ${companyDetails.email} | Phone: ${companyDetails.phone}</p>
      <p style="margin-top: 15px; font-size: 12px; color: #999;">
        This is a system-generated invoice. For queries, contact support.
      </p>
    </div>
  `;

  return invoiceTemplate(content, { invoiceNumber });
};

/**
 * Subscription Refund Credit Note
 */
export const subscriptionRefundCreditNoteTemplate = ({
  clientName,
  clientEmail,
  clientGSTIN,
  creditNoteNumber,
  originalInvoiceNumber,
  issueDate,
  planName,
  refundAmount,
  refundReason,
  gstPercentage = 18,
  cgst,
  sgst,
  igst,
  totalRefund,
  refundMethod,
  refundDate,
  companyDetails = {
    name: appConfig.appName,
    address: "123 Business Park, Tech City, Mumbai - 400001",
    gstin: "27AABCU9603R1ZX",
    pan: "AABCU9603R",
    email: appConfig.supportEmail,
    phone: "+91 1234567890",
  }
}) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">
      <div class="header-left">
        <h1>${companyDetails.name}</h1>
        <p>Professional Video Editing Platform</p>
      </div>
      <div class="header-right">
        <div class="invoice-badge">CREDIT NOTE</div>
        <div class="invoice-number">#${creditNoteNumber}</div>
      </div>
    </div>

    <div class="content">
      <!-- Header -->
      <div class="invoice-header">
        <div class="invoice-party">
          <h3>From (Service Provider)</h3>
          <strong>${companyDetails.name}</strong>
          <p>${companyDetails.address}</p>
          <p><strong>GSTIN:</strong> ${companyDetails.gstin}</p>
          <p><strong>PAN:</strong> ${companyDetails.pan}</p>
          <p><strong>Email:</strong> ${companyDetails.email}</p>
          <p><strong>Phone:</strong> ${companyDetails.phone}</p>
        </div>

        <div class="invoice-party">
          <h3>Credit To (Customer)</h3>
          <strong>${clientName}</strong>
          <p>${clientEmail}</p>
          ${clientGSTIN ? `<p><strong>GSTIN:</strong> ${clientGSTIN}</p>` : ''}
        </div>
      </div>

      <!-- Credit Note Details -->
      <div style="background: #fff3e0; border: 2px solid #ff9800; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          <div>
            <p style="margin: 5px 0;"><strong>Credit Note Date:</strong> ${new Date(issueDate).toLocaleDateString('en-IN')}</p>
            <p style="margin: 5px 0;"><strong>Original Invoice:</strong> #${originalInvoiceNumber}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 5px 0;"><strong>Reason:</strong></p>
            <p style="margin: 5px 0; color: #e65100;">${refundReason}</p>
          </div>
        </div>
      </div>

      <!-- Refund Table -->
      <table class="invoice-table">
        <thead>
          <tr>
            <th style="width: 60%;">Description</th>
            <th style="width: 20%;">HSN/SAC</th>
            <th style="width: 20%;">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Subscription Refund - ${planName}</strong>
              <div class="item-description">Pro-rated refund for unused subscription period</div>
            </td>
            <td>998599</td>
            <td style="text-align: right;">₹${refundAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>

      <!-- GST Reversal -->
      <div class="gst-breakdown" style="background: #ffebee; border-color: #f44336;">
        <h4 style="color: #c62828;">📊 GST Reversal (@ ${gstPercentage}%)</h4>
        ${cgst && sgst ? `
          <div class="gst-row" style="color: #c62828;">
            <span>CGST @ ${gstPercentage/2}%</span>
            <strong>₹${cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
          </div>
          <div class="gst-row" style="color: #c62828;">
            <span>SGST @ ${gstPercentage/2}%</span>
            <strong>₹${sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
          </div>
        ` : ''}
        ${igst ? `
          <div class="gst-row" style="color: #c62828;">
            <span>IGST @ ${gstPercentage}%</span>
            <strong>₹${igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
          </div>
        ` : ''}
        <div class="gst-row" style="border-top: 2px solid #f44336; margin-top: 10px; padding-top: 10px; color: #c62828;">
          <span><strong>Total GST Refund</strong></span>
          <strong>₹${((cgst || 0) + (sgst || 0) + (igst || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>

      <!-- Totals -->
      <div class="invoice-totals">
        <div class="total-row subtotal">
          <span>Refund Amount</span>
          <strong>₹${refundAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div class="total-row tax">
          <span>GST Refund (${gstPercentage}%)</span>
          <strong>₹${((cgst || 0) + (sgst || 0) + (igst || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div class="total-row grand-total" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">
          <span>TOTAL REFUND AMOUNT</span>
          <strong>₹${totalRefund.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>

      <!-- Amount in Words -->
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 14px; color: #666;">
          <strong>Amount in Words:</strong> 
          <span style="color: #333; text-transform: capitalize;">Rupees ${numberToWords(totalRefund)} Only</span>
        </p>
      </div>

      <!-- Refund Information -->
      <div class="payment-info">
        <h4>🔄 Refund Details</h4>
        <div class="payment-detail">
          <span class="label">Refund Method:</span>
          <span class="value">${refundMethod}</span>
        </div>
        <div class="payment-detail">
          <span class="label">Processing Date:</span>
          <span class="value">${new Date(refundDate).toLocaleDateString('en-IN')}</span>
        </div>
        <div class="payment-detail">
          <span class="label">Expected Credit:</span>
          <span class="value">5-7 Business Days</span>
        </div>
        <div class="payment-detail">
          <span class="label">Status:</span>
          <span class="value" style="color: #ff9800; font-weight: bold;">🔄 PROCESSING</span>
        </div>
      </div>

      <!-- Notes -->
      <div class="notes-section">
        <h4>📝 Important Information</h4>
        <p>
          • This credit note is issued against original invoice #${originalInvoiceNumber}<br>
          • Refund amount will be credited to your original payment method<br>
          • Processing time: 5-7 business days for bank transfers<br>
          • GST credit will be reversed in your tax records<br>
          • For queries, contact ${companyDetails.email}
        </p>
      </div>

      <!-- Digital Stamp -->
      <div class="stamp-section">
        <div class="stamp" style="border-color: #ff9800;">
          <div class="stamp-text" style="color: #ff9800;">Authorized Signatory</div>
          <div class="stamp-signature">
            <p style="margin-top: 20px; font-style: italic; color: #ff9800;">For ${companyDetails.name}</p>
          </div>
        </div>
      </div>

      <!-- Download Button -->
      <div class="download-section">
        <a href="${appConfig.appUrl}/credit-notes/${creditNoteNumber}/download" class="download-button" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">
          📄 Download Credit Note
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="invoice-footer">
      <p><strong>${companyDetails.name}</strong></p>
      <p>${companyDetails.address}</p>
      <p>GSTIN: ${companyDetails.gstin} | PAN: ${companyDetails.pan}</p>
      <p>Email: ${companyDetails.email} | Phone: ${companyDetails.phone}</p>
    </div>
  `;

  return invoiceTemplate(content, { invoiceNumber: creditNoteNumber });
};



// NEW ================================================================================

// ─────────────────────────────────────────────────────────────
// 34. Escrow Created — employee notified
// ─────────────────────────────────────────────────────────────
export const escrowCreatedTemplate = (
  employeeName,
  clientName,
  jobTitle,
  amount,
  escrowId
) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <h1>🔔 New Job Escrow Created</h1>
      <p>A client has created an escrow for your work</p>
    </div>
    <div class="content">
      <p>Hi <strong>${employeeName}</strong>,</p>
      <p><strong>${clientName}</strong> has created an escrow for the following job and is completing payment. You'll receive a confirmation once funds are secured.</p>

      <div class="info-box" style="background: #ede7f6; border-color: #7e57c2;">
        <strong style="color: #4527a0;">📋 Job Details</strong>
        <ul style="color: #4527a0;">
          <li><strong>Job Title:</strong> ${jobTitle}</li>
          <li><strong>Amount:</strong> ₹${Number(amount).toLocaleString('en-IN')}</li>
          <li><strong>Escrow ID:</strong> <span style="font-family: monospace;">${escrowId}</span></li>
          <li><strong>Status:</strong> Awaiting Payment</li>
        </ul>
      </div>

      <div class="info-box">
        <strong>⏳ What Happens Next?</strong>
        <ul>
          <li>Client completes payment — you'll get a funded confirmation</li>
          <li>Start work once you receive the funded email</li>
          <li>Submit work when complete for client review</li>
          <li>Payment is released to your wallet upon approval</li>
        </ul>
      </div>

      <center>
        <a href="${appConfig.appUrl}/escrow/${escrowId}" class="button">View Escrow Details</a>
      </center>
    </div>
  `;
  return baseTemplate(content);
};

// ─────────────────────────────────────────────────────────────
// 35. Escrow Funded — employee notified, start work
// ─────────────────────────────────────────────────────────────
export const escrowFundedTemplate = (
  employeeName,
  clientName,
  jobTitle,
  amount,
  escrowId
) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);">
      <h1>✅ Escrow Funded — Start Working!</h1>
      <p>Payment is secured. You're protected.</p>
    </div>
    <div class="content">
      <p>Hi <strong>${employeeName}</strong>,</p>
      <p><strong>${clientName}</strong> has successfully funded the escrow. Your payment of <strong>₹${Number(amount).toLocaleString('en-IN')}</strong> is now locked and secured. You can safely begin working!</p>

      <div class="success-box">
        <div style="text-align: center; margin: 20px 0;">
          <div style="font-size: 48px; font-weight: bold; color: #4caf50;">
            ₹${Number(amount).toLocaleString('en-IN')}
          </div>
          <div style="color: #666; margin-top: 8px;">Secured in Escrow — Guaranteed for You</div>
        </div>
      </div>

      <div class="payment-details">
        <div class="payment-row">
          <span><strong>Job Title:</strong></span>
          <span>${jobTitle}</span>
        </div>
        <div class="payment-row">
          <span><strong>Client:</strong></span>
          <span>${clientName}</span>
        </div>
        <div class="payment-row">
          <span><strong>Escrow ID:</strong></span>
          <span style="font-family: monospace; font-size: 12px;">${escrowId}</span>
        </div>
        <div class="payment-row">
          <span><strong>Status:</strong></span>
          <span style="color: #4caf50; font-weight: bold;">✅ Funded</span>
        </div>
      </div>

      <div class="info-box" style="background: #e8f5e9; border-color: #4caf50;">
        <strong style="color: #2e7d32;">🚀 You're Protected — Here's How:</strong>
        <ul style="color: #2e7d32;">
          <li>Funds are locked — client cannot take them back without dispute</li>
          <li>Complete your work and submit it for review</li>
          <li>Client approves → funds released to your wallet instantly</li>
          <li>Premium members can contest any reversal attempts</li>
        </ul>
      </div>

      <center>
        <a href="${appConfig.appUrl}/escrow/${escrowId}" class="button"
           style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);">
          🚀 View Job & Start Working
        </a>
      </center>
    </div>
  `;
  return baseTemplate(content);
};

// ─────────────────────────────────────────────────────────────
// 36. Work Delivered — client notified to review and release
// ─────────────────────────────────────────────────────────────
export const workDeliveredTemplate = (
  clientName,
  employeeName,
  jobTitle,
  amount,
  escrowId
) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);">
      <h1>📦 Work Delivered!</h1>
      <p>Review the work and release payment</p>
    </div>
    <div class="content">
      <p>Hi <strong>${clientName}</strong>,</p>
      <p><strong>${employeeName}</strong> has marked the work as delivered for your job. Please review the deliverables and release the payment if you're satisfied.</p>

      <div class="info-box" style="background: #e3f2fd; border-color: #2196f3;">
        <strong style="color: #1565c0;">📋 Job Details</strong>
        <ul style="color: #1565c0;">
          <li><strong>Job:</strong> ${jobTitle}</li>
          <li><strong>Editor:</strong> ${employeeName}</li>
          <li><strong>Escrow Amount:</strong> ₹${Number(amount).toLocaleString('en-IN')}</li>
          <li><strong>Escrow ID:</strong> <span style="font-family: monospace;">${escrowId}</span></li>
        </ul>
      </div>

      <div class="info-box">
        <strong>✅ To Release Payment:</strong>
        <ul>
          <li>Review the delivered work carefully</li>
          <li>If satisfied, click "Release Payment" below</li>
          <li>Funds will be credited to the editor immediately</li>
          <li>If unsatisfied, request revisions via the job chat</li>
        </ul>
      </div>

      <div class="warning-box">
        <strong>⚠️ Not Satisfied?</strong>
        <p style="margin-top: 10px;">
          Do not release payment until you are fully satisfied.
          Premium members can reverse the payment within the dispute window if needed.
          Contact support if you're unable to resolve issues with the editor.
        </p>
      </div>

      <center>
        <a href="${appConfig.appUrl}/escrow/${escrowId}" class="button">
          👀 Review &amp; Release Payment
        </a>
      </center>
    </div>
  `;
  return baseTemplate(content);
};

// ─────────────────────────────────────────────────────────────
// 37. Escrow Reversed — employee notified, window to contest
// ─────────────────────────────────────────────────────────────
export const escrowReversedTemplate = (
  employeeName,
  clientName,
  jobTitle,
  amount,
  escrowId
) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">
      <h1>⚠️ Payment Reversal Requested</h1>
      <p>You can contest this — act fast</p>
    </div>
    <div class="content">
      <p>Hi <strong>${employeeName}</strong>,</p>
      <p><strong>${clientName}</strong> has requested a reversal on the escrow payment for the job below. If you believe you have delivered the work as agreed, you can contest this reversal.</p>

      <div class="warning-box">
        <strong>📋 Reversal Details</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Job:</strong> ${jobTitle}</li>
          <li><strong>Amount at Risk:</strong> ₹${Number(amount).toLocaleString('en-IN')}</li>
          <li><strong>Requested By:</strong> ${clientName}</li>
          <li><strong>Escrow ID:</strong> <span style="font-family: monospace;">${escrowId}</span></li>
        </ul>
      </div>

      <div class="danger-box">
        <strong>⏰ Contest Window is Open</strong>
        <p style="margin-top: 10px;">
          You have a limited window to contest this reversal.
          <strong>Premium members only</strong> can hold the reversal and escalate to admin dispute resolution.
          If you do nothing, the reversal may proceed automatically.
        </p>
      </div>

      <div class="info-box">
        <strong>🛡️ How to Protect Your Payment:</strong>
        <ul>
          <li>If you're a <strong>Premium member</strong> — click "Contest Reversal" below</li>
          <li>Admin will review evidence from both sides within 72 hours</li>
          <li>Gather proof of delivery (files, timestamps, chat messages)</li>
          <li>Contact support immediately if you need help</li>
        </ul>
      </div>

      <center>
        <a href="${appConfig.appUrl}/escrow/${escrowId}" class="button"
           style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">
          🛡️ Contest This Reversal
        </a>
      </center>

      <p style="text-align: center; margin-top: 20px; color: #666; font-size: 13px;">
        Not a Premium member?
        <a href="${appConfig.appUrl}/subscription">Upgrade to Premium</a> to protect your earnings.
      </p>
    </div>
  `;
  return baseTemplate(content);
};

// ─────────────────────────────────────────────────────────────
// 38. Escrow Disputed — admin + client notified
// ─────────────────────────────────────────────────────────────
export const escrowDisputedTemplate = (
  recipientName,
  recipientRole,
  employeeName,
  clientName,
  jobTitle,
  amount,
  escrowId
) => {
  const isAdmin = recipientRole === 'admin';

  const content = `
    <div class="header" style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);">
      <h1>🚨 Escrow Dispute ${isAdmin ? '— Admin Action Required' : 'Filed'}</h1>
      <p>${isAdmin ? 'A dispute requires your resolution' : 'Your reversal has been contested'}</p>
    </div>
    <div class="content">
      <p>Hi <strong>${recipientName}</strong>,</p>
      <p>
        ${isAdmin
          ? `A dispute has been filed on an escrow. <strong>${employeeName}</strong> has contested a reversal requested by <strong>${clientName}</strong>. Please review and resolve within 72 hours.`
          : `<strong>${employeeName}</strong> has contested your reversal request. The dispute has been escalated to admin for review. You will be notified of the decision.`
        }
      </p>

      <div class="danger-box">
        <strong>📋 Dispute Details</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>Job:</strong> ${jobTitle}</li>
          <li><strong>Amount in Dispute:</strong> ₹${Number(amount).toLocaleString('en-IN')}</li>
          <li><strong>Client:</strong> ${clientName}</li>
          <li><strong>Employee:</strong> ${employeeName}</li>
          <li><strong>Escrow ID:</strong> <span style="font-family: monospace;">${escrowId}</span></li>
        </ul>
      </div>

      ${isAdmin ? `
        <div class="warning-box">
          <strong>⚖️ Admin Actions Available:</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li><strong>release_to_employee</strong> — Employee wins, funds released</li>
            <li><strong>refund_to_client</strong> — Client wins, full refund issued</li>
            <li><strong>split</strong> — Funds split between both parties</li>
          </ul>
          <p style="margin-top: 10px; color: #e65100;">
            <strong>⏰ Resolution required within 72 hours.</strong>
          </p>
        </div>
        <center>
          <a href="${appConfig.appUrl}/admin/escrow/${escrowId}/resolve" class="button"
             style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);">
            ⚖️ Resolve Dispute
          </a>
        </center>
      ` : `
        <div class="info-box">
          <strong>⏳ What Happens Now:</strong>
          <ul>
            <li>Admin will review evidence from both sides</li>
            <li>Resolution will be made within 72 hours</li>
            <li>Both parties will be notified of the final decision</li>
            <li>Funds will be distributed per admin decision</li>
          </ul>
        </div>
        <center>
          <a href="${appConfig.appUrl}/escrow/${escrowId}" class="button">View Escrow Details</a>
        </center>
      `}
    </div>
  `;
  return baseTemplate(content);
};

// ─────────────────────────────────────────────────────────────
// 39. Dispute Resolved — both parties notified of decision
// ─────────────────────────────────────────────────────────────
export const disputeResolvedTemplate = (
  recipientName,
  recipientRole,
  jobTitle,
  decision,
  amount,
  escrowId
) => {
  const isClient   = recipientRole === 'client';
  const isWinner   = (isClient && decision === 'refund_to_client') ||
                     (!isClient && decision === 'release_to_employee');
  const isSplit    = decision === 'split';

  const decisionLabel = {
    release_to_employee: 'Payment Released to Employee',
    refund_to_client:    'Refund Issued to Client',
    split:               'Amount Split Between Both Parties',
  }[decision] || decision;

  const outcomeStyle = isWinner
    ? 'background: #e8f5e9; border-color: #4caf50;'
    : isSplit
    ? 'background: #e3f2fd; border-color: #2196f3;'
    : 'background: #fff3e0; border-color: #ff9800;';

  const outcomeColor = isWinner ? '#2e7d32' : isSplit ? '#1565c0' : '#e65100';

  const content = `
    <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <h1>⚖️ Dispute Resolved</h1>
      <p>Admin has made a final decision</p>
    </div>
    <div class="content">
      <p>Hi <strong>${recipientName}</strong>,</p>
      <p>The admin team has reviewed the dispute for the escrow below and made a final decision.</p>

      <div class="info-box" style="${outcomeStyle}">
        <div style="text-align: center; margin: 15px 0;">
          <div style="font-size: 36px; margin-bottom: 10px;">
            ${isWinner ? '🎉' : isSplit ? '🤝' : '😔'}
          </div>
          <div style="font-size: 20px; font-weight: bold; color: ${outcomeColor};">
            ${decisionLabel}
          </div>
        </div>
      </div>

      <div class="payment-details">
        <div class="payment-row">
          <span><strong>Job:</strong></span>
          <span>${jobTitle}</span>
        </div>
        <div class="payment-row">
          <span><strong>Amount:</strong></span>
          <span>₹${Number(amount).toLocaleString('en-IN')}</span>
        </div>
        <div class="payment-row">
          <span><strong>Decision:</strong></span>
          <span style="font-weight: bold; color: ${outcomeColor};">${decisionLabel}</span>
        </div>
        <div class="payment-row">
          <span><strong>Escrow ID:</strong></span>
          <span style="font-family: monospace; font-size: 12px;">${escrowId}</span>
        </div>
        <div class="payment-row">
          <span><strong>Decided By:</strong></span>
          <span>${appConfig.appName} Admin Team</span>
        </div>
      </div>

      <div class="info-box">
        <strong>📋 What This Means for You:</strong>
        <p style="margin-top: 10px;">
          ${isClient && decision === 'refund_to_client'
            ? 'A full refund has been processed to your original payment method. You will receive a credit note by email shortly. Expect funds in 5-7 business days.'
            : isClient && decision === 'release_to_employee'
            ? 'The payment has been released to the editor. This decision is final based on the evidence reviewed.'
            : isClient && decision === 'split'
            ? 'A portion of the escrow has been refunded to you. Check the split details on the escrow page.'
            : !isClient && decision === 'release_to_employee'
            ? 'The full payment has been credited to your wallet. You can withdraw anytime.'
            : !isClient && decision === 'refund_to_client'
            ? 'The admin has decided to refund the client. This decision is final based on the evidence reviewed.'
            : 'A portion of the escrow has been credited to your wallet based on the admin split decision.'
          }
        </p>
      </div>

      <div class="warning-box">
        <strong>⚠️ This Decision is Final</strong>
        <p style="margin-top: 10px;">
          Admin decisions are final and cannot be appealed after 72 hours.
          If you believe there was an error, contact
          <a href="mailto:${appConfig.supportEmail}">${appConfig.supportEmail}</a>
          within 24 hours.
        </p>
      </div>

      <center>
        <a href="${appConfig.appUrl}/escrow/${escrowId}" class="button">View Escrow Details</a>
      </center>
    </div>
  `;
  return baseTemplate(content);
};

// ─────────────────────────────────────────────────────────────
// 43. Withdrawal Requested — employee notified
// ─────────────────────────────────────────────────────────────
export const withdrawalRequestedTemplate = (
  fullname,
  amount,
  withdrawalId
) => {
  const content = `
    <div class="header" style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);">
      <h1>🏦 Withdrawal Request Received</h1>
      <p>Your payout is being processed</p>
    </div>
    <div class="content">
      <p>Hi <strong>${fullname}</strong>,</p>
      <p>We've received your withdrawal request and the payout is now being processed via Razorpay.</p>

      <div class="success-box" style="background: #e3f2fd; border-color: #2196f3;">
        <div style="text-align: center; margin: 20px 0;">
          <div style="font-size: 48px; font-weight: bold; color: #2196f3;">
            ₹${Number(amount).toLocaleString('en-IN')}
          </div>
          <div style="color: #666; margin-top: 8px;">Withdrawal In Progress</div>
        </div>
      </div>

      <div class="payment-details">
        <div class="payment-row">
          <span><strong>Withdrawal ID:</strong></span>
          <span style="font-family: monospace; font-size: 12px;">${withdrawalId}</span>
        </div>
        <div class="payment-row">
          <span><strong>Amount:</strong></span>
          <span>₹${Number(amount).toLocaleString('en-IN')}</span>
        </div>
        <div class="payment-row">
          <span><strong>Requested At:</strong></span>
          <span>${new Date().toLocaleString('en-IN')}</span>
        </div>
        <div class="payment-row">
          <span><strong>Status:</strong></span>
          <span style="color: #2196f3; font-weight: bold;">⏳ Processing</span>
        </div>
      </div>

      <div class="info-box">
        <strong>⏱️ What Happens Next:</strong>
        <ul>
          <li>Razorpay will process the payout to your registered bank account</li>
          <li>You'll receive a <strong>success email</strong> once it's credited</li>
          <li>Typical processing time: <strong>2–5 business days</strong></li>
          <li>If the payout fails you'll be notified and the amount returned to your wallet</li>
        </ul>
      </div>

      <div class="warning-box">
        <strong>💡 Please Note:</strong>
        <p style="margin-top: 10px;">
          Once a withdrawal is initiated it cannot be cancelled.
          Ensure your registered bank account details are correct.
          For urgent issues contact <a href="mailto:${appConfig.supportEmail}">${appConfig.supportEmail}</a>
        </p>
      </div>

      <center>
        <a href="${appConfig.appUrl}/withdrawal/${withdrawalId}" class="button">
          Track Withdrawal Status
        </a>
      </center>
    </div>
  `;
  return baseTemplate(content);
};



// Email/emailService.js — ADD this new function

// emailTemplates.js
// ✅ CORRECT — just returns HTML string, no sending, no async, no transporter

export const sendNewApplicationNotification = (
  clientName,
  employeeName,
  employeeUsername,
  jobTitle,
  jobId,
  applicationId,
  proposedBudget     = null,
  coverLetterPreview = null,
  employeeProfilePic = null,
) => {
  // ✅ Pure function — just returns HTML
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Application</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f2f5; color: #1a1a2e; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 32px; text-align: center; }
    .header-icon { width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 16px; }
    .header h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin-bottom: 6px; }
    .header p  { color: rgba(255,255,255,0.85); font-size: 14px; }
    .body { padding: 36px 32px; }
    .greeting { font-size: 16px; color: #4a4a6a; margin-bottom: 24px; line-height: 1.6; }
    .greeting strong { color: #1a1a2e; }
    .applicant-card { background: #f8f9ff; border: 1.5px solid #e0e3ff; border-radius: 12px; padding: 24px; margin-bottom: 24px; display: flex; align-items: flex-start; gap: 16px; }
    .applicant-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #fff; flex-shrink: 0; overflow: hidden; }
    .applicant-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .applicant-info h3 { font-size: 18px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
    .applicant-info .username { font-size: 13px; color: #667eea; margin-bottom: 2px; }
    .applicant-info .label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .job-card { background: #fff9f0; border: 1.5px solid #ffe4b0; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px; }
    .job-card .job-label { font-size: 11px; color: #e07a00; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; margin-bottom: 6px; }
    .job-card .job-title { font-size: 18px; font-weight: 700; color: #1a1a2e; }
    .stats-row { display: flex; gap: 12px; margin-bottom: 24px; }
    .stat-box { flex: 1; background: #f8f9ff; border-radius: 10px; padding: 16px; text-align: center; border: 1px solid #e8eaff; }
    .stat-box .stat-value { font-size: 20px; font-weight: 700; color: #667eea; }
    .stat-box .stat-label { font-size: 11px; color: #888; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .cover-preview { background: #f4f6ff; border-left: 4px solid #667eea; border-radius: 0 10px 10px 0; padding: 16px 20px; margin-bottom: 28px; }
    .cover-preview .cover-label { font-size: 11px; color: #667eea; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 8px; }
    .cover-preview p { font-size: 14px; color: #4a4a6a; line-height: 1.7; font-style: italic; }
    .cta-wrap { text-align: center; margin-bottom: 28px; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: #ffffff !important; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-size: 15px; font-weight: 600; letter-spacing: 0.3px; box-shadow: 0 4px 16px rgba(102,126,234,0.4); }
    .divider { border: none; border-top: 1px solid #eee; margin: 20px 0; }
    .footer { background: #f8f9ff; padding: 24px 32px; text-align: center; }
    .footer p { font-size: 12px; color: #aaa; line-height: 1.8; }
    .footer a { color: #667eea; text-decoration: none; }
  </style>
</head>
<body>
<div class="wrapper">

  <div class="header">
    <div class="header-icon">📬</div>
    <h1>New Job Application</h1>
    <p>Someone wants to work with you</p>
  </div>

  <div class="body">

    <p class="greeting">
      Hi <strong>${clientName}</strong>,<br/>
      Great news! You have received a new application on one of your posted jobs.
    </p>

    <div class="applicant-card">
      <div class="applicant-avatar">
        ${employeeProfilePic
          ? `<img src="${employeeProfilePic}" alt="${employeeName}" />`
          : employeeName.charAt(0).toUpperCase()
        }
      </div>
      <div class="applicant-info">
        <div class="label">Applicant</div>
        <h3>${employeeName}</h3>
        <div class="username">@${employeeUsername}</div>
      </div>
    </div>

    <div class="job-card">
      <div class="job-label">Applied For</div>
      <div class="job-title">📋 ${jobTitle}</div>
    </div>

    ${proposedBudget ? `
    <div class="stats-row">
      <div class="stat-box">
        <div class="stat-value">₹${Number(proposedBudget).toLocaleString('en-IN')}</div>
        <div class="stat-label">Proposed Budget</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">📄</div>
        <div class="stat-label">Resume Attached</div>
      </div>
    </div>
    ` : ''}

    ${coverLetterPreview ? `
    <div class="cover-preview">
      <div class="cover-label">Cover Letter Preview</div>
      <p>"${coverLetterPreview}"</p>
    </div>
    ` : ''}

    <div class="cta-wrap">
      <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/client/applicants?job=${jobId}&application=${applicationId}" class="cta-btn">
        👀 View Application
      </a>
    </div>

    <hr class="divider" />

    <p style="font-size:13px; color:#888; text-align:center;">
      You can accept or reject this application from your dashboard.<br/>
      All communication stays within the EditCraft platform.
    </p>

  </div>

  <div class="footer">
    <p>
      © ${new Date().getFullYear()} EditCraft &nbsp;·&nbsp;
      <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/client/dashboard">Dashboard</a>
      &nbsp;·&nbsp;
      <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/unsubscribe">Unsubscribe</a>
    </p>
    <p style="margin-top:6px;">This email was sent because you posted a job on EditCraft.</p>
  </div>

</div>
</body>
</html>`;
};




// ─────────────────────────────────────────────────────────────
// emailTemplates.js  —  ADD THIS TEMPLATE FUNCTION
// ─────────────────────────────────────────────────────────────

export const jobClosingSoonTemplate = (
  employeeName,
  jobTitle,
  needFor,
  currency,
  price,
  requiredSkills,
  clientName,
  jobId,
  hoursLeft
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Job Closing Soon</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;overflow:hidden;
                      box-shadow:0 2px 12px rgba(0,0,0,0.08);max-width:600px;width:100%;">

          <!-- URGENCY BANNER -->
          <tr>
            <td style="background:#f97316;padding:16px 32px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.5px;">
                ⏳ This job closes in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''} — Apply now!
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px 32px;">

              <p style="margin:0 0 8px;font-size:15px;color:#374151;">
                Hi <strong>${employeeName}</strong>,
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
                A job that matches your skills is closing soon. Don't miss your chance!
              </p>

              <!-- JOB CARD -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#fafafa;border:1px solid #e5e7eb;
                            border-radius:10px;padding:0;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:#111827;">
                      ${jobTitle}
                    </p>
                    <p style="margin:0 0 16px;font-size:13px;color:#9ca3af;">
                      Posted by ${clientName} &nbsp;·&nbsp; ${needFor}
                    </p>

                    <!-- BUDGET -->
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                      <tr>
                        <td style="background:#dcfce7;border-radius:6px;
                                   padding:6px 14px;font-size:15px;
                                   font-weight:700;color:#15803d;">
                          ${currency} ${Number(price).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </table>

                    <!-- SKILLS -->
                    <p style="margin:0 0 8px;font-size:13px;font-weight:600;
                               color:#374151;text-transform:uppercase;letter-spacing:0.5px;">
                      Required Skills
                    </p>
                    <p style="margin:0;font-size:14px;color:#6b7280;">
                      ${Array.isArray(requiredSkills) ? requiredSkills.join(' · ') : requiredSkills}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${process.env.CLIENT_URL || 'https://yourapp.com'}/jobs/${jobId}"
                       style="display:inline-block;background:#f97316;color:#ffffff;
                              font-size:16px;font-weight:700;padding:14px 36px;
                              border-radius:8px;text-decoration:none;letter-spacing:0.3px;">
                      Apply Before It Closes →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f9fafb;padding:20px 32px;
                        border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                You're receiving this because your skills match this job.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;
