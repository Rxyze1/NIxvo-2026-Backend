// Config/razorpay.js               //// == NO RAZORPAY X UNTIL Pvt or LLp Registration done  HERE ==

import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

// ─────────────────────────────────────────────────────────────
// MODE — determined once at startup
// ─────────────────────────────────────────────────────────────

export const PAYMENT_ENABLED = process.env.PAYMENT_ENABLED === 'true';

const IS_LIVE = process.env.RAZORPAY_LIVE_MODE === 'true';

const KEY_ID     = IS_LIVE ? process.env.RAZORPAY_KEY_ID     : process.env.RAZORPAY_TEST_KEY_ID;
const KEY_SECRET = IS_LIVE ? process.env.RAZORPAY_KEY_SECRET : process.env.RAZORPAY_TEST_KEY_SECRET;

// ─────────────────────────────────────────────────────────────
// ENV VALIDATION
// Fail at startup — not mid-transaction
// ─────────────────────────────────────────────────────────────
const BASE_REQUIRED = [
  'RAZORPAY_WEBHOOK_SECRET',
  'RAZORPAY_PLAN_CLIENT_PREMIUM',
  'RAZORPAY_PLAN_EMPLOYEE_PREMIUM',
];

const MODE_REQUIRED = IS_LIVE
  ? ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET']
  : ['RAZORPAY_TEST_KEY_ID', 'RAZORPAY_TEST_KEY_SECRET'];

const ALL_REQUIRED = [...BASE_REQUIRED, ...MODE_REQUIRED];
const missing      = ALL_REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `[Razorpay] Missing required environment variables:\n  ${missing.join('\n  ')}`
  );
}

if (!KEY_ID || !KEY_SECRET) {
  throw new Error(
    `[Razorpay] ${IS_LIVE ? 'Live' : 'Test'} keys are missing. ` +
    `Set ${IS_LIVE ? 'RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET' : 'RAZORPAY_TEST_KEY_ID + RAZORPAY_TEST_KEY_SECRET'} in .env`
  );
}

// ─────────────────────────────────────────────────────────────
// INSTANCE
// ─────────────────────────────────────────────────────────────
export const razorpay = new Razorpay({
  key_id:     KEY_ID,
  key_secret: KEY_SECRET,
});

// ─────────────────────────────────────────────────────────────
// STARTUP BANNER
// ─────────────────────────────────────────────────────────────
console.log('');
console.log('════════════════════════════════════════════════════');
console.log('💳  RAZORPAY INITIALISED');
console.log('════════════════════════════════════════════════════');
console.log(`🔑  Key ID   : ${KEY_ID.substring(0, 12)}...`);
console.log(`🔐  Secret   : ✅ Configured`);
console.log(`🌍  Mode     : ${IS_LIVE ? '🔴 LIVE — real payments' : '🟡 TEST — no real payments'}`);
console.log(`💳  Payments : ${PAYMENT_ENABLED ? '✅ ENABLED' : '🔴 DISABLED (feature flag off)'}`);
console.log(`⚙️   Node env : ${process.env.NODE_ENV || 'development'}`);
console.log('════════════════════════════════════════════════════');
console.log('');

// ─────────────────────────────────────────────────────────────
// EXPORT IS_LIVE — used in escrow.service + wallet.service
// ─────────────────────────────────────────────────────────────
export { IS_LIVE, KEY_ID, KEY_SECRET };

// ─────────────────────────────────────────────────────────────
// CERTIFICATE PRICING
// One-time order payments — NOT subscription plans
// ₹99 for Basic, ₹199 for Pro
// These are used in Certificate.getPrice() and order creation
// ─────────────────────────────────────────────────────────────
export const CERTIFICATE_PRICES = {
  basic: 99,
  pro:   199,
};

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// Use in controllers/services instead of hardcoding strings
// ─────────────────────────────────────────────────────────────
export const RAZORPAY_EVENTS = {
  // ── Payment ──
  PAYMENT_AUTHORIZED: 'payment.authorized',
  PAYMENT_CAPTURED:   'payment.captured',
  PAYMENT_FAILED:     'payment.failed',

  // ── Order ──
  ORDER_PAID:         'order.paid',

  // ── Refund ──
  REFUND_CREATED:     'refund.created',
  REFUND_PROCESSED:   'refund.processed',
  REFUND_FAILED:      'refund.failed',

  // // ── Payout (RazorpayX) ──
  // PAYOUT_PROCESSED:   'payout.processed',
  // PAYOUT_FAILED:      'payout.failed',
  // PAYOUT_REVERSED:    'payout.reversed',

  // ── Subscription ──
  SUB_AUTHENTICATED:  'subscription.authenticated',
  SUB_ACTIVATED:      'subscription.activated',
  SUB_CHARGED:        'subscription.charged',
  SUB_PENDING:        'subscription.pending',
  SUB_HALTED:         'subscription.halted',
  SUB_CANCELLED:      'subscription.cancelled',
  SUB_EXPIRED:        'subscription.expired',
  SUB_COMPLETED:      'subscription.completed',
};

export const RAZORPAY_STATUS = {
  PAYMENT: {
    CREATED:    'created',
    AUTHORIZED: 'authorized',
    CAPTURED:   'captured',
    REFUNDED:   'refunded',
    FAILED:     'failed',
  },
  ORDER: {
    CREATED:   'created',
    ATTEMPTED: 'attempted',
    PAID:      'paid',
  },
  REFUND: {
    PENDING:   'pending',
    PROCESSED: 'processed',
    FAILED:    'failed',
  },
};

// ─────────────────────────────────────────────────────────────
// PAYMENT TYPES
// Stamp on every order's notes.type so the webhook
// can route to the correct handler
// ─────────────────────────────────────────────────────────────
export const PAYMENT_TYPES = {
  SUBSCRIPTION:        'subscription',
  CERTIFICATE_BASIC:   'certificate_basic',
  CERTIFICATE_PRO:     'certificate_pro',
};