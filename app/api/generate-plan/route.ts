import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq AI Client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Check if API key is set
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // 1. Parse the data sent from the frontend form
    const data = await req.json();
    const {
      name,
      age,
      height,
      weight,
      gender,
      goal,
      level,
      location,
      diet,
      medicalHistory,
      stressLevel,
    } = data;

    // 2. Construct the Prompt Engineering
    // We keep your strict output formatting instructions
    const prompt = `
Act as a professional elite fitness coach and nutritionist.
Create a personalized 7-day workout and diet plan for the following person.

Profile:
- Name: ${name}
- Age: ${age}
- Gender: ${gender}
- Height: ${height} cm
- Weight: ${weight} kg
- Fitness Goal: ${goal}
- Experience Level: ${level}
- Available Location: ${location}
- Dietary Preference: ${diet}
- Medical History: ${medicalHistory || "None"}
- Stress Level: ${stressLevel || "Normal"}

OUTPUT FORMAT (VERY IMPORTANT):
Do NOT deviate from this format ever never. Follow it EXACTLY.
Dont add anything from your side.
Return the plan ONLY in clean Markdown using EXACTLY this structure:

# Personalized Fitness Plan for ${name}

## Introduction
<Short intro about the person and overall philosophy>

### Day 1: <Short Day Title>
#### Workout
* ...
* ...
#### Meals
* Breakfast: ...
* Lunch: ...
* Snack: ...
* Dinner: ...

### Day 2: <Short Day Title>
#### Workout
* ...
#### Meals
* Breakfast: ...
* Lunch: ...
* Snack: ...
* Dinner: ...

... (repeat the same pattern up to Day 7) ...

## Key Considerations & Tips for Your Journey
* ...
* ...
* ...

## Motivational Quote
*"Your short motivational quote here"*

RULES:
- Use ONLY the headings shown above.
- Do NOT add extra top-level sections.
- Use \`*\` for bullet points.
- Respect the "${location}" and "${diet}" constraints.
`;

    // 3. Call the Groq AI Model
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      // "llama-3.3-70b-versatile" is currently the best Groq model for complex formatting
      model: "llama-3.3-70b-versatile", 
      temperature: 0.5,
      max_tokens: 6000, // Increased limit to ensure full 7-day plan isn't cut off
    });

    // Extract the response text safely
    const text = completion.choices[0]?.message?.content || "";

    // 4. Return the generated plan to the frontend
    return NextResponse.json({ plan: text });

  } catch (error) {
    console.error("Groq Generation Error:", error);

    // Provide more detailed error messages (Production Level)
    let errorMessage = "Failed to generate plan. Please try again.";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "API key is not configured. Please contact support.";
      } else if (error.message.includes("401")) {
        errorMessage = "Invalid API Key provided.";
      } else if (error.message.includes("429")) {
        // Handle Rate Limiting gracefully
        errorMessage = "System is experiencing high traffic. Please try again in a minute.";
        statusCode = 429;
      } else if (error.message.includes("503")) {
        errorMessage = "AI Service is temporarily unavailable. Please try again later.";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}