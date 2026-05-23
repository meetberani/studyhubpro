const Razorpay = require('razorpay');

// Dual-mode Razorpay client
// If keys are provided in .env, it initializes active integration; otherwise, it falls back to a sandbox simulator mode
const isRazorpayConfigured = !!(
  process.env.RAZORPAY_KEY_ID && 
  process.env.RAZORPAY_KEY_SECRET &&
  process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id'
);

let razorpay = null;

if (isRazorpayConfigured) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('Razorpay SDK payment engine loaded successfully in production mode.');
} else {
  console.log('Razorpay SDK payment engine loaded in SANDBOX SIMULATION mode (Local UPI screenshots preferred).');
}

/**
 * Creates a standard Razorpay Order
 * @param {number} amount - Amount in INR
 * @param {string} receiptId - Unique order receipt ID
 */
const createRazorpayOrder = async (amount, receiptId) => {
  if (!isRazorpayConfigured) {
    console.log(`[Mock Razorpay] Creating simulated order for ₹${amount}`);
    return {
      id: `order_mock_${Date.now()}`,
      entity: 'order',
      amount: amount * 100, // in paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency: 'INR',
      receipt: receiptId,
      status: 'created',
      mock: true,
    };
  }

  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: receiptId,
    };
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    throw error;
  }
};

/**
 * Verify Razorpay payment signature
 */
const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  if (!isRazorpayConfigured) {
    console.log('[Mock Razorpay] Verifying signature in sandbox mode.');
    return true; // Simulate pass
  }

  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(orderId + "|" + paymentId);
  const generatedSignature = hmac.digest('hex');

  return generatedSignature === signature;
};

module.exports = {
  razorpay,
  createRazorpayOrder,
  verifyRazorpaySignature,
  isRazorpayConfigured,
};
