// // lib/profileService.ts
// import { supabase } from "@/lib/supabaseClient";

// // Shape of data we expect from the form
// export interface ProfileInput {
//   name: string;
//   age: number;
//   height: number;
//   weight: number;
//   gender: "Male" | "Female" | "Other";
//   goal: "Weight Loss" | "Muscle Gain" | "Maintenance";
//   level: "Beginner" | "Intermediate" | "Advanced";
//   location: "Home" | "Gym" | "Outdoor";
//   diet: "Veg" | "Non-Veg" | "Vegan" | "Eggitarian" | "No Preference";
//   medicalHistory?: string;
//   stressLevel?: string;
// }

// /**
//  * Calls Supabase RPC to upsert profile for the current user.
//  * RPC name: save_profile
//  * Must be defined in Supabase DB.
//  */
// export async function upsertProfile(profile: ProfileInput) {
//   // Map TS field names → RPC argument names
//   const payload = {
//     p_name: profile.name,
//     p_age: profile.age,
//     p_height: profile.height,
//     p_weight: profile.weight,
//     p_gender: profile.gender,
//     p_goal: profile.goal,
//     p_level: profile.level,
//     p_location: profile.location,
//     p_diet: profile.diet,
//     p_medical_history: profile.medicalHistory ?? null,
//     p_stress_level: profile.stressLevel ?? null,
//   };

//   const { data, error } = await supabase.rpc("save_profile", payload);

//   if (error) {
//     console.error("Error in upsertProfile RPC:", error);
//     throw error;
//   }

//   return data; // profile row returned from RPC
// }
// lib/profileService.ts
import { supabase } from "@/lib/supabaseClient";

export interface ProfileInput {
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: "Male" | "Female" | "Other";
  goal: "Weight Loss" | "Muscle Gain" | "Maintenance";
  level: "Beginner" | "Intermediate" | "Advanced";
  location: "Home" | "Gym" | "Outdoor";
  diet: "Veg" | "Non-Veg" | "Vegan" | "Eggitarian" | "No Preference";
  medicalHistory?: string;
  stressLevel?: string;
}

// What comes back from Supabase "profiles" table
export interface ProfileRow extends ProfileInput {
  id: string;
  medical_history: string | null;
  stress_level: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Upsert profile for the current user via RPC (save_profile).
 */
export async function upsertProfile(profile: ProfileInput) {
  const payload = {
    p_name: profile.name,
    p_age: profile.age,
    p_height: profile.height,
    p_weight: profile.weight,
    p_gender: profile.gender,
    p_goal: profile.goal,
    p_level: profile.level,
    p_location: profile.location,
    p_diet: profile.diet,
    p_medical_history: profile.medicalHistory ?? null,
    p_stress_level: profile.stressLevel ?? null,
  };

  const { data, error } = await supabase.rpc("save_profile", payload);

  if (error) {
    console.error("Error in upsertProfile RPC:", error);
    throw error;
  }

  return data as ProfileRow;
}

/**
 * Fetch the current user's profile from Supabase "profiles" table.
 */
export async function fetchProfile() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }

  return data as ProfileRow;
}
