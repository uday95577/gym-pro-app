import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key securely from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Initialize the specific Gemini model we'll be using
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

/**
 * Generates a 7-day workout plan using the Gemini API based on user preferences and BMI.
 * @param {object} preferences - The user's preferences for the workout plan.
 * @returns {Promise<string>} A formatted string containing the workout plan.
 */
export const generateWorkoutPlan = async ({ motive, level, suggestions, latestBmi }) => {
  const prompt = `
    Create a 7-day weekly workout plan in simple, easy-to-understand language (you can use Hinglish terms). Include 2 rest days. The user's profile is:
    - Main Goal (Motive): ${motive}
    - Level: ${level}
    - Current BMI Data: ${latestBmi ? `${latestBmi.bmi} BMI, ${latestBmi.weight} kg, ${latestBmi.height} cm` : 'Not provided'}
    - User's Special Request: "${suggestions || 'None'}"

    Please make the plan very practical for someone in India. Use common exercise names.
    For example, instead of complex names, use terms like 'Chest Press (Bench Press)', 'Dand Baithak (Squats)', 'Pull-ups'.
    Structure the plan with clear headings for each day. For each exercise, specify sets and reps.
    Format the response clearly using markdown. Use '#' for the main title, '##' for day titles, and '*' for list items.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating workout plan:", error);
    return "Sorry, abhi workout plan nahi ban pa raha hai. Thodi der baad try karein.";
  }
};

/**
 * Generates a 7-day diet plan using the Gemini API based on user preferences.
 * @param {object} preferences - The user's preferences for the diet plan.
 * @returns {Promise<string>} A formatted string containing the diet plan.
 */
export const generateDietPlan = async ({ motive, mealType, budget, suggestions }) => {
  const prompt = `
    Create a simple 7-day Indian diet plan (desi khana) in easy-to-understand language (Hinglish). The user's preferences are:
    - Main Goal (Motive): ${motive}
    - Food Type: ${mealType}
    - Budget: ${budget}
    - User's Special Request: "${suggestions || 'None'}"

    The plan must include common Indian household foods like dal, roti, sabzi, chawal, dahi, paneer, etc.
    Structure it with three main meals and two snacks for each day. Use simple meal names like 'Nashta (Breakfast)', 'Dopeher ka Khana (Lunch)', and 'Raat ka Khana (Dinner)'.
    For each meal, suggest 2-3 common desi food options.
    Include a note about drinking plenty of water (paani).
    Format the response clearly using markdown. Use '#' for the main title, '##' for day titles, '###' for meal times, and '*' for food items.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error)
  {
    console.error("Error generating diet plan:", error);
    return "Sorry, abhi diet plan nahi ban pa raha hai. Thodi der baad try karein.";
  }
};

/**
 * Generates a short, motivational fitness quote using the Gemini API.
 * @returns {Promise<string>} A string containing the motivational quote.
 */
export const generateMotivationalQuote = async () => {
  const prompt = `
    Generate a short, powerful, and original motivational quote in Hinglish related to fitness and gym discipline.
    The quote should be no more than two sentences long.
    Do not include quotation marks in the response.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating motivational quote:", error);
    return "Jo workout aaj nahi kiya, woh kal bhi nahi hoga. Just do it!";
  }
};
