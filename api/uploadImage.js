// This is a Vercel Serverless Function for securely uploading images.
import { v2 as cloudinary } from 'cloudinary';
import { formidable } from 'formidable';

// Configure Cloudinary using your secret keys stored in Vercel environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Vercel's config to tell it not to parse the body, as we need the raw file stream
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    const file = files.image[0]; // Assumes the uploaded file is named 'image'

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'gym-pro-app', // Optional: organize uploads into a specific folder
    });

    // Send the secure URL of the uploaded image back to the frontend
    res.status(200).json({ secure_url: result.secure_url });

  } catch (error) {
    console.error("Image upload failed:", error);
    res.status(500).json({ error: 'Image upload failed.' });
  }
}
