const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay')
const crypto = require('crypto')


const key_id = process.env.RZPAY_KEY_ID
const key_secret = process.env.RZPAY_KEY_SECRET


// ROUTE 1: creating an order using: POST "/api/order/createOrder"
router.post('/createOrder', async (req, res) => {
    try {
        const razorpayInstance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        });

        // STEP 1:
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        function generateString(length) {
            let result = ' ';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            return result;
        }
        // setting up options for razorpay order.
        const options = {
            amount: req.body.amount,
            currency: req.body.currency,
            receipt: generateString(15)
        };

        // STEP 2:
        const response = await razorpayInstance.orders.create(options)
        res.json(response)
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});


// ROUTE 2: verifying an order using: POST "/api/order/verifyOrder"
router.post('/verifyOrder', (req, res) => {
    try {
        /* Receive Payment Data */
        const { order_id, payment_id, razorpay_signature } = req.body;
        // const razorpay_signature = req.headers['x-razorpay-signature'];

        const keySecret = key_secret;


        /* Verification & Send Response to User */

        // Creating hmac object 
        let hmac = crypto.createHmac('sha256', keySecret);

        // Passing the data to be hashed 
        hmac.update(order_id + "|" + payment_id);

        // Creating the hmac in the required format 
        const generated_signature = hmac.digest('hex');

        if (razorpay_signature === generated_signature) {
            res.json({ success: true, message: "Payment has been verified" })
        }
        else {
            res.json({ success: false, message: "Payment verification failed" })
        }
    }
    catch (error) {
        console.log(error);
        res.status(error.status).send(error.message);
    }
});

// ROUTE 3: refund using: POST "/api/order/refund/:id"
router.post('/refund/:id', async (req, res) => {
    try {
        const razorpayInstance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        });

        /* TODO: need to verify the payment Id first, then access the Razorpay API. */

        const options = {
            // payment_id: req.body.paymentId,
            amount: req.body.amount,
        };

        const razorpayResponse = await razorpayInstance.payments.refund(req.params.id, options);
        res.json(razorpayResponse)
    }
    catch (error) {
        console.log(error);
        res.status(error.status).send(error.message);
    }
})

// ROUTE 4: getPaymentLink using: POST "/api/order/getPaymentLink"
router.post('/getPaymentLink', async (req, res) => {
    try {
        const razorpayInstance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        });

        // fuction to generate unix timestamp which is 30 minutes past the current time
        function getUnixTime() {
            const date = new Date();
            const unixTime = Math.floor(date.getTime() / 1000) + 1800;
            return unixTime;
        }

        // function to generate random reference id which is unique every time
        function generateReferenceId() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = ' ';
            const charactersLength = characters.length;
            for (let i = 0; i < 8; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        const order = {
            amount: req.body.amount,
            currency: req.body.currency,
            accept_partial: false,
            expire_by: getUnixTime(),   // 30 minutes past the current time
            reference_id: generateReferenceId(),    // need to be unique every time
            description: req.body.description,
            customer: req.body.customer,
            notify: {
                sms: true,
                email: true
            },
            reminder_enable: true,
            options: {
                checkout: {
                    theme: {
                        hide_topbar: true
                    }
                }
            }
        }

        const razorpayResponse = await razorpayInstance.paymentLink.create(order);
        res.json(razorpayResponse)
    }
    catch (error) {
        console.log(error);
        res.status(error.status).send(error.message);
    }
})

module.exports = router;