// src/lib/schemas.ts
import { z } from "zod";

// Define the exact list of options the user must choose from
const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;
const GOAL_OPTIONS = ["Weight Loss", "Muscle Gain", "Maintenance"] as const;
const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"] as const;
const LOCATION_OPTIONS = ["Home", "Gym", "Outdoor"] as const;
const DIET_OPTIONS = ["Veg", "Non-Veg", "Vegan", "Keto", "No Preference"] as const;

// Helper function to define the select field schema clearly
const createSelectSchema = <T extends readonly string[]>(options: T, message: string) => 
    z.string().min(1, { message: message }).pipe(z.enum(options));


export const fitnessFormSchema = z.object({
  // Required Text/Number fields (No change)
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().min(16).max(99, { message: "Age must be between 16 and 99." }),
  height: z.coerce.number().min(50).max(250, { message: "Height (cm) must be between 50 and 250." }),
  weight: z.coerce.number().min(30).max(300, { message: "Weight (kg) must be between 30 and 300." }),
  
  // Required Select fields (FIX APPLIED HERE)
  gender: createSelectSchema(GENDER_OPTIONS, "Please select your gender."),
  goal: createSelectSchema(GOAL_OPTIONS, "Please select your primary fitness goal."),
  level: createSelectSchema(LEVEL_OPTIONS, "Please select your current fitness level."),
  location: createSelectSchema(LOCATION_OPTIONS, "Please select your preferred workout location."),
  diet: createSelectSchema(DIET_OPTIONS, "Please select your dietary preference."),

  // Optional fields (No change)
  medicalHistory: z.string().optional(),
  stressLevel: z.string().optional(),
});

export type FitnessFormData = z.infer<typeof fitnessFormSchema>;

// Export the options for use in the component (No change)
export const FormOptions = {
    GENDER_OPTIONS,
    GOAL_OPTIONS,
    LEVEL_OPTIONS,
    LOCATION_OPTIONS,
    DIET_OPTIONS,
}