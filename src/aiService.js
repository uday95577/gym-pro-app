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
    Format the response clearly using markdown. Use '#' for the main title, '##' for day titles, and '*' for list items. The exercise name should be the first thing after the '*'.
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
    Format the response clearly using markdown. Use '#' for the main title, '##' for day titles, '###' for meal times, and '*' for food items. The food item name should be the first thing after the '*'.
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

/**
 * Generates alternative exercises for a given exercise.
 * @param {string} exerciseName - The name of the exercise to get variations for.
 * @returns {Promise<string>} A string containing a list of alternative exercises.
 */
export const getExerciseVariations = async (exerciseName) => {
  const prompt = `
    Provide 2-3 alternative exercises or variations for the following exercise: "${exerciseName}".
    List them in a simple, comma-separated format. For example: "Incline Dumbbell Press, Decline Push-ups, Cable Flys".
    Do not add any extra text or headings.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error getting exercise variations:", error);
    return "Could not find variations at this time.";
  }
};

/**
 * --- NEW FUNCTION ---
 * Gets a response from the AI chatbot.
 * @param {string} userQuery - The user's question.
 * @param {Array} history - The previous conversation history.
 * @returns {Promise<string>} The chatbot's response.
 */
export const getChatbotResponse = async (userQuery, history) => {
  const chat = model.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 200,
    },
  });

  const prompt = `
    You are a friendly and knowledgeable fitness and nutrition chatbot for an app called GymPro.
    Your goal is to answer the user's questions in a clear, concise, and encouraging way.
    You can answer in any language the user asks in.
    Keep your answers relatively short.
    User's question: "${userQuery}"
  `;

  try {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return "I'm sorry, I'm having a little trouble right now. Please try again in a moment.";
  }
};
