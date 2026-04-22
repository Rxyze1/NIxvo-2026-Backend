// Controllers/Subscription/subscription.controller.js

import SubscriptionService from '../../Service/Subscription/subscription.service.js';
import User                from '../../Models/USER-Auth/User-Auth.-Model.js';
import Subscription        from '../../Models/Subscription/Subscription.Model.js';
import { RAZORPAY_EVENTS, IS_LIVE,PAYMENT_ENABLED}      from '../../Config/razorpay.js';
import { handleCertificateWebhook }      from '../../Service/Certificate/CertificateWebhookHandler.js';
import {
  sendSubscriptionActivated,
  sendSubscriptionRenewed,
  sendSubscriptionCancelled,
  sendSubscriptionPaymentFailed,
} from '../../Email/emailService.js';


// ─────────────────────────────────────────────────────────────
// 1️⃣  INITIATE SUBSCRIPTION
// ─────────────────────────────────────────────────────────────
export const initiateSubscription = async (req, res) => {
  try {
    const userId   = req.userId;
    const userType = req.userType;
    const { plan, billingCycle = 'monthly' } = req.body;

    // ── Validate inputs ───────────────────────────────────────
    if (!plan)
      return res.status(400).json({ success: false, message: '❌ Plan is required' });

    if (!['premium'].includes(plan))
      return res.status(400).json({ success: false, message: '❌ Invalid plan. Valid plans: premium' });

    if (!['monthly', 'yearly'].includes(billingCycle))
      return res.status(400).json({ success: false, message: '❌ Invalid billing cycle. Valid: monthly, yearly' });



    // Need to oof  when we go live  hey Ai ai Look at this 
    
        // ── ✨ PAYMENT SYSTEM CONTROL (Backend-only toggle) ─────
    const PAYMENT_ENABLED = process.env.PAYMENT_ENABLED === 'true';

    if (!PAYMENT_ENABLED) {
      return res.status(503).json({
        success: false,
        code:    'PAYMENTS_TEMPORARILY_DISABLED',
        message: '⚠️ Payment system is being upgraded — please try again soon',
        data: {
          status: 'maintenance',
          estimatedAvailability: '24-48 hours',
          next: {
            action:  'retry_later',
            message: 'We\'re switching to live payments. Premium features will be available shortly!',
          },
          supportEmail: 'support@yourapp.com',
        },
      });
    }

    // ── Check for existing subscription ───────────────────────  ← This line stays the same








    // ── Check for existing subscription ───────────────────────
    const existingSub = await Subscription.findOne({ userId });

    if (existingSub) {

      // ── Already active ──────────────────────────────────────
      if (existingSub.subscriptionStatus === 'active') {
        // ✅ null guard on planExpiresAt
        const expiresAt      = existingSub.planExpiresAt
          ? new Date(existingSub.planExpiresAt)
          : null;
        const daysRemaining  = expiresAt
          ? Math.max(1, Math.ceil((expiresAt - new Date()) / (1000 * 60 * 60 * 24)))
          : 0;

        return res.status(400).json({
          success: false,
          code:    'ALREADY_SUBSCRIBED',
          message: '❌ You already have an active subscription',
          data: {
            plan:         existingSub.plan,
            status:       existingSub.subscriptionStatus,
            expiresAt:    existingSub.planExpiresAt,
            daysRemaining,
            next: {
              action:  'manage',
              message: 'You can cancel your subscription from settings',
            },
          },
        });
      }

      // ── Payment authenticated but not yet charged ───────────
      if (existingSub.subscriptionStatus === 'authenticated') {
        const paymentUrl = existingSub.razorpaySubscriptionId
          ? `https://rzp.io/i/${existingSub.razorpaySubscriptionId}`
          : null;

        return res.status(200).json({
          success: false,
          code:    'PAYMENT_PENDING',
          message: '⏳ Payment not completed — please complete your payment',
          data: {
            plan:           existingSub.plan,
            status:         existingSub.subscriptionStatus,
            subscriptionId: existingSub._id,
            payment: paymentUrl ? {
              paymentUrl,
              razorpaySubscriptionId: existingSub.razorpaySubscriptionId,
              razorpayKey: IS_LIVE
                ? process.env.RAZORPAY_KEY_ID
                : process.env.RAZORPAY_TEST_KEY_ID,
              method: 'razorpay',
              mode:   IS_LIVE ? 'live' : 'test',
            } : null,
            next: {
              action:      paymentUrl ? 'open_payment'    : 'contact_support',
              redirectUrl: paymentUrl,
              message:     paymentUrl
                ? 'Click below to complete your payment'
                : 'Contact support if payment issue persists',
            },
          },
        });
      }

      // ── Cancelled but paid access still valid ───────────────
      if (existingSub.subscriptionStatus === 'cancelled') {
        // ✅ FIX: null planExpiresAt treated as epoch (already expired)
        const expiresAt      = existingSub.planExpiresAt
          ? new Date(existingSub.planExpiresAt)
          : new Date(0);
        const stillHasAccess = new Date() < expiresAt;

        if (stillHasAccess) {
          return res.status(400).json({
            success: false,
            code:    'CANCELLED_BUT_ACTIVE',
            message: '⚠️ You cancelled but still have premium access until your billing period ends',
            data: {
              plan:          existingSub.plan,
              status:        existingSub.subscriptionStatus,
              accessUntil:   existingSub.planExpiresAt,
              // ✅ FIX: clamp to minimum 1
              daysRemaining: Math.max(1, Math.ceil(
                (expiresAt - new Date()) / (1000 * 60 * 60 * 24)
              )),
              next: {
                action:  'wait',
                message: 'You can re-subscribe after your current period ends',
              },
            },
          });
        }
      }

      // ── Stale subscription — delete and allow retry ─────────
      // Reaches here for: pending | halted | expired | cancelled (access gone)
      await Subscription.deleteOne({ userId });
      console.log(`🗑️ Deleted stale subscription (${existingSub.subscriptionStatus}) — allowing retry`);
    }

    // ── Create Razorpay + DB subscription ─────────────────────
    const razorpayData = await SubscriptionService.createRazorpaySubscription(
      userId, userType, plan, billingCycle
    );

    const subscription = await SubscriptionService.createSubscription(
      userId, userType, plan, billingCycle
    );

    const razorpayKey = IS_LIVE
      ? process.env.RAZORPAY_KEY_ID
      : process.env.RAZORPAY_TEST_KEY_ID;

    const paymentUrl = `https://rzp.io/i/${razorpayData.razorpaySubscriptionId}`;

    console.log(`✅ Subscription initiated for user ${userId}`);

    return res.status(201).json({
      success: true,
      message: '✅ Subscription initiated — complete payment on Razorpay',
      data: {
        subscriptionId: subscription._id,
        plan,
        billingCycle,
        status:         subscription.subscriptionStatus,
        price:          subscription.planPrice,
        currency:       'INR',
        createdAt:      subscription.createdAt,
        payment: {
          razorpaySubscriptionId: razorpayData.razorpaySubscriptionId,
          razorpayKey,
          paymentUrl,
          method: 'razorpay',
          mode:   IS_LIVE ? 'live' : 'test',
        },
        next: {
          action:      'open_payment',
          redirectUrl: paymentUrl,
          message:     'Complete your payment to activate premium',
          expiresIn:   '30 minutes',
        },
      },
    });

  } catch (error) {
    console.error('❌ initiateSubscription error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate subscription',
    });
  }
};


// ─────────────────────────────────────────────────────────────
// 2️⃣  GET MY SUBSCRIPTION
// ─────────────────────────────────────────────────────────────
export const getMySubscription = async (req, res) => {
  try {
    const userId = req.userId;
    const sub    = await SubscriptionService.getSubscription(userId);

    if (!sub) {
      return res.status(200).json({
        success: true,
        message: 'No active subscription',
        data: { plan: 'free', status: 'none', isPremium: false },
      });
    }

    // ✅ null guard — never pass null/undefined into Date arithmetic
    const expiresAt = sub.planExpiresAt ? new Date(sub.planExpiresAt) : null;
    const now       = new Date();

    const isPremium =
      sub.plan !== 'free' &&
      ['active', 'cancelled'].includes(sub.subscriptionStatus) &&
      expiresAt !== null &&
      now < expiresAt;

    // ✅ clamp to 1 — "0 days" never surfaces while isPremium is true
    const daysRemaining = isPremium && expiresAt
      ? Math.max(1, Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)))
      : 0;

    const isPaymentPending = ['pending', 'authenticated'].includes(sub.subscriptionStatus);
    const paymentUrl       = isPaymentPending && sub.razorpaySubscriptionId
      ? `https://rzp.io/i/${sub.razorpaySubscriptionId}`
      : null;

    return res.status(200).json({
      success: true,
      data: {
        _id:                sub._id,
        plan:               sub.plan,
        status:             sub.subscriptionStatus,
        isPremium,
        billingCycle:       sub.billingCycle,
        planPrice:          sub.planPrice,
        currency:           'INR',
        planActivatedAt:    sub.planActivatedAt,
        planExpiresAt:      sub.planExpiresAt,
        nextBillingDate:    sub.nextBillingDate,
        daysRemaining,
        isAutoRenewEnabled: sub.isAutoRenewEnabled,
        features:           isPremium ? sub.features : null,

        statusLabel:
          sub.subscriptionStatus === 'active'        ? 'Active'           :
          sub.subscriptionStatus === 'authenticated' ? 'Payment Pending'  :
          sub.subscriptionStatus === 'pending'       ? 'Awaiting Payment' :
          sub.subscriptionStatus === 'halted'        ? 'Payment Failed'   :
          sub.subscriptionStatus === 'cancelled'     ? 'Cancelled'        :
          sub.subscriptionStatus === 'expired'       ? 'Expired'          :
          'Inactive',

        ...(isPaymentPending && {
          payment: {
            paymentUrl,
            razorpaySubscriptionId: sub.razorpaySubscriptionId,
            razorpayKey: IS_LIVE
              ? process.env.RAZORPAY_KEY_ID
              : process.env.RAZORPAY_TEST_KEY_ID,
            method: 'razorpay',
            mode:   IS_LIVE ? 'live' : 'test',
          },
          next: {
            action:      paymentUrl ? 'open_payment'    : 'contact_support',
            redirectUrl: paymentUrl || null,
            message:     paymentUrl
              ? 'Complete your payment to activate premium'
              : 'Contact support to resolve your payment issue',
          },
        }),

        // ✅ daysRemaining >= 1 prevents "expires in 0 days" edge case
        ...(isPremium && daysRemaining >= 1 && daysRemaining <= 7 && {
          renewalAlert: {
            message:   `Your subscription expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`,
            expiresAt: sub.planExpiresAt,
            action:    'renew',
          },
        }),
      },
    });

  } catch (error) {
    console.error('❌ getMySubscription error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch subscription' });
  }
};


// ─────────────────────────────────────────────────────────────
// 3️⃣  CANCEL SUBSCRIPTION
// ─────────────────────────────────────────────────────────────
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.userId;
    const { reason = 'User initiated cancellation' } = req.body;

    const sub  = await SubscriptionService.cancelSubscription(userId, reason, 'user');
    const user = await User.findById(userId);

    if (user) {
      try {
        await sendSubscriptionCancelled(
          user.email, user.fullname, sub.plan, sub.planExpiresAt, reason
        );
      } catch (emailErr) {
        console.warn('⚠️ Cancellation email failed:', emailErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: '✅ Subscription cancelled successfully',
      data: {
        plan:        sub.plan,
        status:      sub.subscriptionStatus,
        cancelledAt: sub.cancelledAt,
        accessUntil: sub.planExpiresAt,
      },
    });
  } catch (error) {
    console.error('❌ cancelSubscription error:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to cancel subscription',
    });
  }
};


// ─────────────────────────────────────────────────────────────
// 4️⃣  WEBHOOK HANDLER
// ─────────────────────────────────────────────────────────────
export const handleWebhook = async (req, res) => {
  const event = req.body;

  console.log(`\n🔔 WEBHOOK: ${event.event}`);

  // Respond immediately — Razorpay requires 200 within 5 s
  res.status(200).json({ success: true, received: true });

  try {
    switch (event.event) {

      case RAZORPAY_EVENTS.SUB_AUTHENTICATED: {
        await SubscriptionService.handleSubscriptionAuthenticated(event);
        console.log('✅ Handled: subscription.authenticated');
        break;
      }
      case RAZORPAY_EVENTS.SUB_ACTIVATED: {
        const sub = await SubscriptionService.handleSubscriptionActivated(event);
        try {
          const subscription = event.payload.subscription.entity;
          const { userId }   = subscription.notes;
          const user         = await User.findById(userId);
          if (user && sub) {
            
            // ✅ FIX: Update the User document to PREMIUM
            await User.findByIdAndUpdate(userId, {
              plan: sub.plan || 'premium',
              subscriptionStatus: 'active',
            });

            await sendSubscriptionActivated(
              user.email, user.fullname, sub.plan, sub.planPrice,
              sub.planActivatedAt, sub.planExpiresAt, sub.features,
              `INV-${sub._id.toString().slice(-8).toUpperCase()}`,
              subscription.id
            );
          }
        } catch (emailErr) {
          console.warn('⚠️ Activation email failed:', emailErr.message);
        }
        console.log('✅ Handled: subscription.activated — user is now PREMIUM');
        break;
      }
      case RAZORPAY_EVENTS.SUB_CHARGED: {
        const sub = await SubscriptionService.handleSubscriptionCharged(event);
        try {
          const subscription = event.payload.subscription.entity;
          const payment      = event.payload.payment.entity;
          const { userId }   = subscription.notes;
          const user         = await User.findById(userId);
          if (user && sub) {
            await sendSubscriptionRenewed(
              user.email, user.fullname, sub.plan, sub.planPrice,
              sub.planExpiresAt,
              `INV-${sub._id.toString().slice(-8).toUpperCase()}`,
              payment.id
            );
          }
        } catch (emailErr) {
          console.warn('⚠️ Renewal email failed:', emailErr.message);
        }
        console.log('✅ Handled: subscription.charged — renewed');
        break;
      }

      case RAZORPAY_EVENTS.SUB_CANCELLED:
      case RAZORPAY_EVENTS.SUB_COMPLETED: {
        const sub = await SubscriptionService.handleSubscriptionCancelled(event);
        try {
          const subscription = event.payload.subscription.entity;
          const { userId }   = subscription.notes;
          const user         = await User.findById(userId);
          if (user && sub) {
            await sendSubscriptionCancelled(
              user.email, user.fullname, sub.plan,
              sub.planExpiresAt, 'Cancelled via Razorpay'
            );
          }
        } catch (emailErr) {
          console.warn('⚠️ Cancellation email failed:', emailErr.message);
        }
        console.log('✅ Handled: subscription.cancelled');
        break;
      }

      case RAZORPAY_EVENTS.SUB_HALTED: {
        const sub = await SubscriptionService.handleSubscriptionFailed(event);
        try {
          const subscription = event.payload.subscription.entity;
          const { userId }   = subscription.notes;
          const user         = await User.findById(userId);
          if (user && sub) {
            await sendSubscriptionPaymentFailed(
              user.email, user.fullname, sub.plan, sub.planPrice,
              sub.planExpiresAt, 'Payment declined by bank', null
            );
          }
        } catch (emailErr) {
          console.warn('⚠️ Payment failed email failed:', emailErr.message);
        }
        console.log('✅ Handled: subscription.halted');
        break;
      }

      case RAZORPAY_EVENTS.ORDER_PAID:
      case RAZORPAY_EVENTS.PAYMENT_CAPTURED: {
        const handled = await handleCertificateWebhook(event.event, event.payload);
        if (handled) console.log('✅ Handled: certificate payment');
        else         console.log('ℹ️ order.paid — not a certificate payment');
        break;
      }

      default:
        console.log(`ℹ️ Unhandled webhook event: ${event.event}`);
    }

  } catch (error) {
    console.error(`❌ Webhook processing error [${event.event}]:`, error.message);
  }
};


// ─────────────────────────────────────────────────────────────
// 5️⃣  GET PLANS — Protected (Returns features based on userType)
// ─────────────────────────────────────────────────────────────



const UI_FEATURES = {
  client: {
    free: [
      "Limited job posts per month",
      "Basic applicant view",
      "Standard support",
    ],
    premium: [
      "Unlimited applicant access",
      { text: "Premium badge on profile", badge: true },
      "Priority job visibility",
      "Direct messaging with talent",
      "Increased trust & credibility",
      "Bulk upload resumes",
    ],
  },
  
  employee: {
    free: [
      "Limited job applications per month",
      "Standard profile visibility",
      "Standard support",
    ],
    premium: [
      "Unlimited job applications",
      { text: "Featured profile badge", badge: true },
      "Priority support",
      "Priority job visibility",
      "Higher chances of getting hired",
      "Direct messaging with clients",
      "Increased trust & credibility",
    ],
  },
};



export const getPlans = async (req, res) => {
  try {
    const userType = req.userType;

    if (!userType || !['client', 'employee'].includes(userType)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing user type' });
    }

    const userPlans = UI_FEATURES[userType] || {};

    return res.status(200).json({
      success: true,
      data: {
        userType: userType,
        free: {
          price: 0,
          label: 'Free',
          features: userPlans.free || [],
        },
        premium: {
          price: userType === 'client' ? 49 : 149,
          label: 'Premium',
          features: userPlans.premium || [],
        },
      },
    });

  } catch (error) {
    console.error('❌ getPlans error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch plans' });
  }
};