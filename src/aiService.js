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
    Create a 7-day weekly workout plan, including 2 rest days, for a user with the following profile:
    - Primary Goal: ${motive}
    - Experience Level: ${level}
    - Current Height: ${latestBmi?.height || 'Not provided'} cm
    - Current Weight: ${latestBmi?.weight || 'Not provided'} kg
    - Current BMI: ${latestBmi?.bmi || 'Not provided'}
    - Specific Requests: "${suggestions || 'None'}"

    Tailor the intensity and types of exercises based on their current stats and goals.
    The plan should be structured with clear headings for each day.
    For each exercise, specify the name, number of sets, and number of reps.
    Provide a brief note about a warm-up.
    Format the response clearly using markdown. Use '#' for the main title, '##' for day titles, and '*' for list items.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating workout plan:", error);
    return "Sorry, I couldn't generate a workout plan at the moment. Please try again later.";
  }
};

/**
 * Generates a 7-day diet plan using the Gemini API based on user preferences.
 * @param {object} preferences - The user's preferences for the diet plan.
 * @returns {Promise<string>} A formatted string containing the diet plan.
 */
export const generateDietPlan = async ({ motive, mealType, budget, suggestions }) => {
  const prompt = `
    Create a sample 7-day diet plan for an active person with the following preferences:
    - Primary Goal: ${motive}
    - Meal Preference: ${mealType}
    - Budget: ${budget}
    - Specific Requests: "${suggestions || 'None'}"

    The plan should be balanced and include three main meals and two snacks for each day.
    For each meal, suggest food items that fit the preferences.
    Provide estimated macronutrient goals for the week.
    Include a note about hydration.
    Format the response clearly using markdown. Use '#' for the main title, '##' for day titles, '###' for meal times, and '*' for food items.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error)
  {
    console.error("Error generating diet plan:", error);
    return "Sorry, I couldn't generate a diet plan at the moment. Please try again later.";
  }
};
