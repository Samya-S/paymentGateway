const express = require('express');
// const Razorpay = require('razorpay')

const dotenv = require('dotenv');
dotenv.config();

const key_id = process.env.key_id
const key_secret = process.env.key_secret

// const razorpay = new Razorpay({
//     key_id: key_id,
//     key_secret: key_secret
// })

const app = express();
const PORT = process.env.PORT || '5000';

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(express.json()) // to use req.body
app.use(require("cors")())

// available routes
app.use('/api/order', require('./routes/order'))

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT} at http://localhost:${PORT}`)
    // console.log({key_id, key_secret})
})
