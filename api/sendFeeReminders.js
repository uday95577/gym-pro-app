// This is a Vercel Serverless Function that will be run on a schedule (Cron Job).
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import twilio from 'twilio';

// --- Secure Initialization ---
// Initialize Firebase Admin SDK using Vercel environment variables
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
if (!initializeApp.length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}
const db = getFirestore();

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioWhatsappNumber = process.env.TWILIO_PHONE_NUMBER; // e.g., 'whatsapp:+14155238886'

export default async function handler(req, res) {
  // Add a security check to ensure this can only be run by Vercel's Cron system
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  console.log("Running daily fee reminder job...");

  try {
    const today = new Date();
    const reminderDate = new Date();
    // Set the target date to 6 days from now
    reminderDate.setDate(today.getDate() + 6);

    const gymsSnapshot = await db.collection('gyms').get();
    const remindersToSend = [];

    for (const gymDoc of gymsSnapshot.docs) {
      const membersSnapshot = await gymDoc.ref.collection('members').get();
      for (const memberDoc of membersSnapshot.docs) {
        const member = memberDoc.data();
        const dueDate = member.feeDueDate?.toDate();

        // Check if the due date is exactly 6 days from now
        if (dueDate && 
            dueDate.getFullYear() === reminderDate.getFullYear() &&
            dueDate.getMonth() === reminderDate.getMonth() &&
            dueDate.getDate() === reminderDate.getDate()) {
          
          if (member.phone) { // Ensure the member has a phone number
            remindersToSend.push({
              to: `whatsapp:${member.phone}`, // Assumes phone number is stored with country code, e.g., +919876543210
              from: twilioWhatsappNumber,
              body: `Hi ${member.name}, this is a friendly reminder from ${gymDoc.data().gymName} that your monthly fee is due on ${dueDate.toLocaleDateString()}. Thank you!`,
            });
          }
        }
      }
    }

    // Send all reminder messages
    for (const message of remindersToSend) {
      await twilioClient.messages.create(message);
      console.log(`Message sent to ${message.to}`);
    }

    res.status(200).json({ message: `${remindersToSend.length} reminders sent successfully.` });

  } catch (error) {
    console.error("Error sending fee reminders:", error);
    res.status(500).json({ error: 'Failed to send reminders.' });
  }
}
