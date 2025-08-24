import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import twilio from 'twilio';

// Securely initialize Firebase and Twilio
if (!getApps().length) {
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

  const { gymId, message } = req.body;

  if (!gymId || !message) {
    return res.status(400).json({ error: 'Missing gym ID or message.' });
  }

  console.log(`Starting broadcast for gym: ${gymId}`);

  try {
    const membersRef = db.collection('gyms').doc(gymId).collection('members');
    const membersSnapshot = await membersRef.get();

    if (membersSnapshot.empty) {
      return res.status(200).json({ message: 'No members to send message to.' });
    }

    const promises = [];
    membersSnapshot.forEach(doc => {
      const member = doc.data();
      if (member.phone) {
        const promise = twilioClient.messages.create({
          to: `whatsapp:${member.phone}`,
          from: twilioWhatsappNumber,
          body: message,
        });
        promises.push(promise);
      }
    });

    await Promise.all(promises);

    console.log(`Broadcast sent to ${promises.length} members.`);
    res.status(200).json({ message: `Message sent to ${promises.length} members successfully.` });

  } catch (error) {
    console.error("Error sending broadcast:", error);
    res.status(500).json({ error: 'Failed to send broadcast.' });
  }
}
