const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth')
const { createRazorpayOrder, verifyRazorpayPayment, sendRazorpayKey } = require('../controller/paymentController')

router.route('/payment/razorpay/order').post(auth, createRazorpayOrder)
router.route('/payment/razorpay/verify').post(auth, verifyRazorpayPayment)
router.route('/razorpay/key').get(sendRazorpayKey)

module.exports = router;