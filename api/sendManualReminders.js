import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import twilio from 'twilio';

// Securely initialize Firebase and Twilio
if (!initializeApp.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioWhatsappNumber = process.env.TWILIO_PHONE_NUMBER;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { gymId, gymName } = req.body;

  if (!gymId || !gymName) {
    return res.status(400).json({ error: 'Missing gym information.' });
  }

  console.log(`Starting manual reminder process for ${gymName}...`);

  try {
    const today = new Date();
    const membersRef = db.collection('gyms').doc(gymId).collection('members');
    const membersSnapshot = await membersRef.get();

    const remindersToSend = [];

    membersSnapshot.forEach(doc => {
      const member = doc.data();
      const dueDate = member.feeDueDate?.toDate();

      if (dueDate) {
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // Find members whose fee is overdue or due within the next 7 days
        if (daysDiff <= 7) {
          if (member.phone) {
            const messageBody = daysDiff < 0
              ? `Hi ${member.name}, this is a reminder from ${gymName} that your monthly fee was due on ${dueDate.toLocaleDateString()}. Please submit it at your earliest convenience.`
              : `Hi ${member.name}, this is a friendly reminder from ${gymName} that your monthly fee is due on ${dueDate.toLocaleDateString()}. Thank you!`;
            
            remindersToSend.push({
              to: `whatsapp:${member.phone}`,
              from: twilioWhatsappNumber,
              body: messageBody,
            });
          }
        }
      }
    });

    if (remindersToSend.length === 0) {
      return res.status(200).json({ message: 'No members have upcoming or overdue fees.' });
    }

    // Send all reminder messages
    for (const message of remindersToSend) {
      await twilioClient.messages.create(message);
      console.log(`Reminder sent to ${message.to}`);
    }

    res.status(200).json({ message: `${remindersToSend.length} reminders sent successfully.` });

  } catch (error) {
    console.error("Error sending manual reminders:", error);
    res.status(500).json({ error: 'Failed to send reminders.' });
  }
}
