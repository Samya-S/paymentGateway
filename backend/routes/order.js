const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay')
const crypto = require('crypto')


const key_id = process.env.key_id
const key_secret = process.env.key_secret

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
        // STEP 7: Receive Payment Data 
        const { order_id, payment_id, razorpay_signature } = req.body;
        // const razorpay_signature = req.headers['x-razorpay-signature'];

        const keySecret = key_secret;

        // STEP 8: Verification & Send Response to User 

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

// ROUTE 2: refund using: POST "/api/order/refund"
router.post('/refund/:id', async (req, res) => {
    try {
        const razorpayInstance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        });

        //Verify the payment Id first, then access the Razorpay API. 
        const options = {
            // payment_id: req.body.paymentId,
            amount: req.body.amount,
        };

        const razorpayResponse = razorpayInstance.payments.refund(req.params.id, options);
        res.json(razorpayResponse)
    }
    catch (error) {
        console.log(error);
        res.status(error.status).send(error.message);
    }
})

module.exports = router;