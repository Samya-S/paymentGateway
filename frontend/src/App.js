import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
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

		/********************/
		const hostingDomain = 'http://localhost:5000'
		// const amountVal = 50000
		/********************/

		// creating a new order
		// const result = await axios.post("http://localhost:5000/payment/orders");
		const result = await axios.post(`${hostingDomain}/api/order/createOrder`,
			{
				"amount": "96000",
				"currency": "INR"
			}
		)
		// const result = await fetch(`http://localhost:5000/api/order/createOrder`, {
		// 	method: 'POST', // or 'PUT'
		// 	headers: {
		// 		"Content-Type": "application/json"
		// 	},
		// 	body: JSON.stringify({
		// 		amount: '50000',
		// 		currency: "INR"
		// 	})
		// });

		// const resp = await result.json()
		console.log(result.data)

		if (!result) {
			alert("Server error. Are you online?");
			return;
		}

		// // Getting the order details back
		const { amount, id: order_id, currency } = result.data;

		const options = {
			key: "rzp_test_9ECvrYnzj2MSB5", // Enter the Key ID generated from the Dashboard
			amount: amount.toString(),
			currency: currency,
			name: "Soumya Corp.",
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

				// const result = await axios.post("http://localhost:5000/payment/success", data);
				const result = await fetch(`${hostingDomain}/api/order/verifyOrder`, {
					method: 'POST', // or 'PUT'
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				});
				const resp = await result.json()
				console.log(resp)
				alert(resp.message);
			},
			prefill: {
				name: "Soumya Dey",
				email: "SoumyaDey@example.com",
				contact: "9999999999",
			},
			notes: {
				address: "Soumya Dey Corporate Office",
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
			{/* <span>
				Cost:- <input type="number" id="amount" name="amount" /> Rupees
				<button id="pay-button">Pay Now</button>
			</span> */}
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>Buy React now!</p>
				<button className="App-link" onClick={displayRazorpay}>
					Pay ₹500
				</button>
			</header>
		</div>
	);
}

export default App;
