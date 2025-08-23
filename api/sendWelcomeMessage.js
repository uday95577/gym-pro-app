import twilio from 'twilio';

// Initialize Twilio client using Vercel environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioWhatsappNumber = process.env.TWILIO_PHONE_NUMBER;

export default async function handler(req, res) {
  // Security: Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { memberName, memberPhone, gymName } = req.body;

  // Basic validation
  if (!memberName || !memberPhone || !gymName) {
    return res.status(400).json({ error: 'Missing required information.' });
  }

  try {
    const messageBody = `Welcome to ${gymName}, ${memberName}! We're excited to have you join our community. Your fitness journey starts now!`;

    // Send the message using the Twilio API
    await twilioClient.messages.create({
      to: `whatsapp:${memberPhone}`,
      from: twilioWhatsappNumber,
      body: messageBody,
    });

    console.log(`Welcome message sent to ${memberPhone}`);
    res.status(200).json({ message: 'Welcome message sent successfully.' });

  } catch (error) {
    console.error("Error sending welcome message:", error);
    res.status(500).json({ error: 'Failed to send welcome message.' });
  }
}
