import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key securely from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Initialize the specific Gemini model we'll be using
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

/**
 * Generates a 7-day workout plan using the Gemini API based on user preferences.
 * @param {object} preferences - The user's preferences for the workout plan.
 * @param {string} preferences.motive - The user's primary goal (e.g., 'fat loss').
 * @param {string} preferences.level - The user's experience level (e.g., 'beginner').
 * @param {string} preferences.suggestions - Any specific user requests.
 * @returns {Promise<string>} A formatted string containing the workout plan.
 */
export const generateWorkoutPlan = async ({ motive, level, suggestions }) => {
  const prompt = `
    Create a 7-day weekly workout plan, explicitly including 2 rest days, with the following user preferences:
    - Primary Goal: ${motive}
    - Experience Level: ${level}
    - Specific Requests: "${suggestions || 'None'}"

    The plan should be structured with clear headings for each day (e.g., Day 1, Day 2, Rest Day).
    For each exercise on workout days, specify the name, number of sets, and number of reps, appropriate for the user's level.
    If the user requested a specific split like "per day one body part only", adhere to that.
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
 * @param {string} preferences.motive - The user's goal (e.g., 'weight loss', 'muscle gain').
 * @param {string} preferences.mealType - The user's meal preference (e.g., 'vegetarian', 'non-vegetarian').
 * @param {string} preferences.budget - The user's budget (e.g., 'low', 'medium', 'high').
 * @returns {Promise<string>} A formatted string containing the diet plan.
 */
export const generateDietPlan = async ({ motive, mealType, budget }) => {
  const prompt = `
    Create a sample 7-day diet plan for an active person with the following preferences:
    - Primary Goal: ${motive}
    - Meal Preference: ${mealType}
    - Budget: ${budget}

    The plan should be balanced and include three main meals (Breakfast, Lunch, Dinner) and two snacks for each day.
    For each meal, suggest 2-3 food item options that fit the specified budget and meal type.
    Provide estimated macronutrient goals (Protein, Carbs, Fats) for the week.
    Include a note about the importance of hydration.
    Format the response clearly using markdown. Use '#' for the main title, '##' for day titles (e.g., ## Day 1: Monday), '###' for meal times, and '*' for food items.
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
