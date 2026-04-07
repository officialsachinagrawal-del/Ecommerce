const Razorpay = require('razorpay')
const crypto = require('crypto')

const getRazorpayConfig = () => {
    const key_id = (process.env.RAZORPAY_KEY_ID || '').trim()
    const key_secret = (process.env.RAZORPAY_KEY_SECRET || '').trim()

    return { key_id, key_secret }
}

const getRazorpayInstance = () => {
    const { key_id, key_secret } = getRazorpayConfig()

    if (!key_id || !key_secret) {
        return null
    }

    return new Razorpay({ key_id, key_secret })
}

exports.createRazorpayOrder = async (req, res) => {
    try {
        const amount = Number(req.body.amount)

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Invalid payment amount' })
        }

        const razorpay = getRazorpayInstance()

        if (!razorpay) {
            return res.status(500).json({ error: 'Razorpay is not configured on server' })
        }

        const order = await razorpay.orders.create({
            amount: Math.round(amount),
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`
        })

        return res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Failed to create Razorpay order' })
    }
}

exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
        const { key_secret } = getRazorpayConfig()

        if (!key_secret) {
            return res.status(500).json({ error: 'Razorpay is not configured on server' })
        }

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing Razorpay payment verification fields' })
        }

        const generatedSignature = crypto
            .createHmac('sha256', key_secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        const isValid = generatedSignature === razorpay_signature

        if (!isValid) {
            return res.status(400).json({ success: false, error: 'Payment verification failed' })
        }

        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Failed to verify Razorpay payment' })
    }
}

exports.sendRazorpayKey = (req, res) => {
    const { key_id } = getRazorpayConfig()
    res.status(200).json({ razorpayKey: key_id || '' })
}




