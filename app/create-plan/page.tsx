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

import {Sparkles } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";

// SCHEMA (unchanged)
const fitnessFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z
    .string()
    .refine(
      (val) =>
        !isNaN(Number(val)) &&
        Number(val) >= 1 &&
        Number(val) <= 120,
      "Age must be between 1 and 120"
    )
    .transform((val) => Number(val)),
  height: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 1,
      "Height must be valid"
    )
    .transform((val) => Number(val)),
  weight: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 1,
      "Weight must be valid"
    )
    .transform((val) => Number(val)),
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      {/* NAVBAR (same style as landing page) */}
      <AppNavbar />


      {/* MAIN CONTENT */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          {/* HEADER / INTRO */}
          <div className="mb-8 sm:mb-10 text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs sm:text-sm text-indigo-200 mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Answer a few questions to build your plan</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Tell FlexAI Coach about you
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              Share your basic details, goals, and preferences. We’ll generate a
              fully personalized 7-day workout and diet plan — no templates, no
              guesswork.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="w-full bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-black/40 px-5 py-6 sm:px-7 sm:py-8">            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-100">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="rounded-xl bg-slate-950/60 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
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
                        <FormLabel className="font-semibold text-slate-100">
                          Age
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="25"
                            {...field}
                            className="rounded-xl bg-slate-950/60 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                          />
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
                        <FormLabel className="font-semibold text-slate-100">
                          Height (cm)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="175"
                            {...field}
                            className="rounded-xl bg-slate-950/60 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                          />
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
                        <FormLabel className="font-semibold text-slate-100">
                          Weight (kg)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="70"
                            {...field}
                            className="rounded-xl bg-slate-950/60 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                          />
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
                        <FormLabel className="font-semibold text-slate-100">
                          Gender
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? undefined}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-xl bg-slate-950/60 border-slate-700 text-slate-100 focus:ring-indigo-500 focus:ring-1">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
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
                        <FormLabel className="font-semibold text-slate-100">
                          Fitness Goal
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? undefined}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-xl bg-slate-950/60 border-slate-700 text-slate-100 focus:ring-indigo-500 focus:ring-1">
                              <SelectValue placeholder="Select goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                            <SelectItem value="Weight Loss">
                              Weight Loss
                            </SelectItem>
                            <SelectItem value="Muscle Gain">
                              Muscle Gain
                            </SelectItem>
                            <SelectItem value="Maintenance">
                              Maintenance
                            </SelectItem>
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
                        <FormLabel className="font-semibold text-slate-100">
                          Experience Level
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? undefined}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-xl bg-slate-950/60 border-slate-700 text-slate-100 focus:ring-indigo-500 focus:ring-1">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">
                              Intermediate
                            </SelectItem>
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
                        <FormLabel className="font-semibold text-slate-100">
                          Workout Location
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? undefined}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-xl bg-slate-950/60 border-slate-700 text-slate-100 focus:ring-indigo-500 focus:ring-1">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
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
                      <FormLabel className="font-semibold text-slate-100">
                        Dietary Preference
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl bg-slate-950/60 border-slate-700 text-slate-100 focus:ring-indigo-500 focus:ring-1">
                            <SelectValue placeholder="Select diet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                          <SelectItem value="Veg">Veg</SelectItem>
                          <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                          <SelectItem value="Vegan">Vegan</SelectItem>
                          <SelectItem value="Eggitarian">Eggitarian</SelectItem>
                          <SelectItem value="No Preference">
                            No Preference
                          </SelectItem>
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
                      <FormLabel className="font-semibold text-slate-100">
                        Medical History (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any injuries or conditions?"
                          className="rounded-xl resize-none bg-slate-950/60 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
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
                      <FormLabel className="font-semibold text-slate-100">
                        Stress Level (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Low / Medium / High"
                          {...field}
                          className="rounded-xl bg-slate-950/60 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-base sm:text-lg py-3.5 rounded-xl shadow-lg shadow-indigo-500/40 transition-all"
                >
                  {isLoading ? "Generating your plan..." : "Generate my 7-day plan"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
