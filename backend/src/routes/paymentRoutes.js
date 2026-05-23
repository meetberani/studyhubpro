const express = require('express');
const router = express.Router();
const {
  getUPIDetails,
  requestPremium,
  adminGetPendingPayments,
  adminVerifyPayment,
  createOrder,
  verifySignature,
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// User payment flows
router.get('/upi-info', protect, getUPIDetails);
router.post('/unlock', protect, upload.single('screenshot'), requestPremium);

// Razorpay direct gateway flows
router.post('/razorpay/order', protect, createOrder);
router.post('/razorpay/verify', protect, verifySignature);

// Admin validation flows
router.get('/admin/pending', protect, admin, adminGetPendingPayments);
router.put('/admin/:id/verify', protect, admin, adminVerifyPayment);

module.exports = router;
