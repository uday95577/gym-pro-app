// This is a Vercel Serverless Function.
// We are now using modern ES Module syntax (import/export).

import Razorpay from 'razorpay';

export default async function handler(req, res) {
  // We only accept POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // We now expect more details from the frontend
  const { amount, currency, planName, userId } = req.body;

  if (!amount || !currency || !planName || !userId) {
    return res.status(400).json({ error: 'Missing required payment details.' });
  }

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
    // Add notes for better tracking in the Razorpay dashboard
    notes: {
      userId: userId,
      planName: planName,
    }
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
