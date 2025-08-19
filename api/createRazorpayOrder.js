// This is a Vercel Serverless Function.
// It runs in a secure Node.js environment.

const Razorpay = require('razorpay');

export default async function handler(req, res) {
  // We only accept POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { amount, currency } = req.body;

  // Initialize Razorpay using the secret keys stored securely in Vercel
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount,
    currency: currency,
    receipt: `receipt_order_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    // Send the successful order details back to the frontend
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({ error: 'Could not create a payment order.' });
  }
}
