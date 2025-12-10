"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Dumbbell, Sparkles } from "lucide-react";

// SCHEMA (unchanged)
const fitnessFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 120, "Age must be between 1 and 120").transform(val => Number(val)),
  height: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1, "Height must be valid").transform(val => Number(val)),
  weight: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1, "Weight must be valid").transform(val => Number(val)),
  gender: z.enum(["Male", "Female", "Other"]),
  goal: z.enum(["Weight Loss", "Muscle Gain", "Maintenance"]),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  location: z.enum(["Home", "Gym", "Outdoor"]),
  diet: z.enum(["Veg", "Non-Veg", "Vegan", "Eggitarian", "No Preference"]),
  medicalHistory: z.string().optional(),
  stressLevel: z.string().optional(),
});

type FitnessFormData = z.infer<typeof fitnessFormSchema>;

export default function FitnessFormPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(fitnessFormSchema),
    defaultValues: {
      name: "",
      age: "",
      height: "",
      weight: "",
      gender: undefined,
      goal: undefined,
      level: undefined,
      location: undefined,
      diet: undefined,
      medicalHistory: "",
      stressLevel: "",
    },
  });

  async function onSubmit(data: any) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to generate plan");
        setIsLoading(false);
        return;
      }

      localStorage.setItem(
        "fitnessplan",
        JSON.stringify({
          userProfile: data,
          plan: result.plan,
        })
      );

      router.push("/results");
    } catch (error) {
      console.error(error);
      alert("Failed to generate plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="
        min-h-screen 
        bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50
        flex flex-col items-center justify-center
        px-6 py-10
      "
    >
      {/* HEADER */}
      <div className="mb-10 text-center animate-fadeIn">
        <div className="flex justify-center mb-3">
          <Dumbbell className="w-12 h-12 text-indigo-600 animate-pulse" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          AI Fitness Planner
        </h1>
        <p className="text-gray-600 mt-2 max-w-sm mx-auto">
          Get a personalized workout & nutrition plan powered by AI.
        </p>
      </div>

      {/* FORM CARD */}
      <div
        className="
          w-full max-w-xl 
          bg-white/80 backdrop-blur-xl 
          shadow-xl rounded-3xl 
          p-8 sm:p-10 
          border border-white/40
          animate-fadeInSlow
        "
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="rounded-xl focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age / Height / Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="25" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Height (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="175" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="70" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender / Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Fitness Goal</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                        <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Level / Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Workout Location</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Gym">Gym</SelectItem>
                        <SelectItem value="Outdoor">Outdoor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Diet */}
            <FormField
              control={form.control}
              name="diet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Dietary Preference</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select diet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Veg">Veg</SelectItem>
                      <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                      <SelectItem value="Vegan">Vegan</SelectItem>
                      <SelectItem value="Eggitarian">Eggitarian</SelectItem>
                      <SelectItem value="No Preference">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Medical History */}
            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Medical History (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any injuries or conditions?"
                      className="rounded-xl resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stress Level */}
            <FormField
              control={form.control}
              name="stressLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Stress Level (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Low / Medium / High" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="
                w-full 
                bg-indigo-600 hover:bg-indigo-700 
                text-white 
                text-lg py-4 
                rounded-xl shadow-lg 
                transition-all
              "
            >
              {isLoading ? "Generating..." : "Generate Plan"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
