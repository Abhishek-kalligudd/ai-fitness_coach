// lib/profileService.ts
import { supabase } from "@/lib/supabaseClient";

// Shape of data we expect from the form
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

/**
 * Calls Supabase RPC to upsert profile for the current user.
 * RPC name: save_profile
 * Must be defined in Supabase DB.
 */
export async function upsertProfile(profile: ProfileInput) {
  // Map TS field names → RPC argument names
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

  return data;
}

export interface ProfileRow {
  id: string;
  name: string | null;
  age: number | null;
  height: number | null;
  weight: number | null;
  gender: string | null;
  goal: string | null;
  level: string | null;
  location: string | null;
  diet: string | null;
  medical_history: string | null;
  stress_level: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export async function fetchProfile(): Promise<ProfileRow | null> {
  // Get the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error getting user:", userError);
    throw userError;
  }

  if (!user) return null;

  // Fetch profile row for this user.id
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    // Return null if no profile found
    if (error.code === "PGRST116") return null;
    console.error("Error fetching profile:", error);
    throw error;
  }

  return data;
}
