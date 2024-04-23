import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useState } from 'react'

function App() {
	const [cost, setCost] = useState('500')

	function loadScript(src) {
		return new Promise((resolve) => {
			const script = document.createElement("script");
			script.src = src;
			script.onload = () => {
				resolve(true);
			};
			script.onerror = () => {
				resolve(false);
			};
			document.body.appendChild(script);
		});
	}

	async function displayRazorpay() {
		const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

		if (!res) {
			alert("Razorpay SDK failed to load. Are you online?");
			return;
		}

		const hostingDomain = process.env.REACT_APP_BACKEND_HOSTING_DOMAIN
		const amountVal = (cost * 100)

		// Creating a new order
		const result = await axios.post(`${hostingDomain}/api/order/createOrder`,
			{
				"amount": amountVal,
				"currency": "INR"
			}
		)

		if (!result) {
			alert("Server error. Are you online?");
			return;
		}

		// console.log('on createOrder:');
		// console.log(result);

		// Getting the order details back
		const { amount, id: order_id, currency } = result.data;

		const options = {
			key: process.env.REACT_APP_KEY_ID,
			amount: amount.toString(),
			currency: currency,
			name: "SS corp.",
			description: "Test Transaction",
			image: { logo },
			order_id: order_id,
			handler: async function (response) {
				const data = {
					// orderCreationId: order_id,
					payment_id: response.razorpay_payment_id,
					order_id: response.razorpay_order_id,
					razorpay_signature: response.razorpay_signature,
				};
				// console.log('on payment:');
				// console.log(data);

				const result = await axios.post(`${hostingDomain}/api/order/verifyOrder`, data)
				// console.log('on verifyOrder:');
				// console.log(result);
				alert(result.data.message);
			},
			prefill: {
				name: "XXXXX XXXX",
				email: "xxxxxxx@xxx.xx",
				contact: "9999999999",
			},
			notes: {
				address: "Xxxx xxxx xxxxx xxx xxxx",
			},
			theme: {
				color: "#61dafb",
			},
		};

		const paymentObject = new window.Razorpay(options);
		paymentObject.open();

		paymentObject.on("payment.failed", function (response) {
			console.log(response);
			alert("This step of Payment Failed");
		});
	}

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>Buy now!</p>
				<span>Cost:- <input type="number" id="amount" name="amount" value={cost} onChange={(e) => setCost(e.target.value)} /> Rupees</span><br />
				<button className="App-link" onClick={displayRazorpay}>
					Pay ₹{cost}
				</button>
			</header>
		</div>
	);
}

export default App;
