"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { ProfileInfoCard } from "@/components/fitness/ProfileInfoCard";
import { PersonalizedPlanIntro } from "@/components/fitness/PersonalizedPlanIntro";
import { DayPlanCard } from "@/components/fitness/DayPlanCard";
import { TipsAndSuccessSection } from "@/components/fitness/TipsAndSuccessSection";
import { ImageGeneratorModal } from "@/components/fitness/ImageGeneratorModal"; // [ADDED] Import Modal
import { parsePlanMarkdown, ParsedPlan } from "@/utils/parsePlanMarkdown";
import { extractItemsFromMarkdown } from "@/utils/extractItems"; // [ADDED] Import Parser
import AppNavbar from "@/components/AppNavbar";

import {
  Sparkles,
  Loader2,
  FileText,
  Download,
  ChevronRight,
} from "lucide-react";

// [ADDED] Interface for generated items (images)
interface GeneratedItem {
  name: string;
  imageUrl: string | null;
  isLoading: boolean;
}

interface FitnessData {
  userProfile: {
    name: string;
    age: number;
    height: number;
    weight: number;
    gender: string;
    goal: string;
    level: string;
    location: string;
    diet: string;
    medicalHistory?: string;
    stressLevel?: string;
  };
  plan: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const [fitnessData, setFitnessData] = useState<FitnessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [parsedPlan, setParsedPlan] = useState<ParsedPlan | null>(null);
  const [defaultAccordionValue, setDefaultAccordionValue] = useState<
    string | undefined
  >(undefined);

  // --- [ADDED] IMAGE GENERATION STATE ---
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDayTitle, setCurrentDayTitle] = useState("");
  const [workoutItems, setWorkoutItems] = useState<GeneratedItem[]>([]);
  const [mealItems, setMealItems] = useState<GeneratedItem[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("fitnessplan");
    if (storedData) {
      try {
        const data = JSON.parse(storedData) as FitnessData;
        setFitnessData(data);

        const parsed = parsePlanMarkdown(data.plan);
        setParsedPlan(parsed);

        console.log("Parsed Plan:", parsed);
      } catch (error) {
        console.error("Failed to parse fitness data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Set default accordion open to "intro" on large screens (Tailwind lg = 1024px)
    const mq = window.matchMedia("(min-width: 1024px)");

    const apply = () => {
      setDefaultAccordionValue(mq.matches ? "intro" : undefined);
    };

    apply(); // run once on mount

    // keep it responsive if user resizes the window
    mq.addEventListener?.("change", apply);
    return () => {
      mq.removeEventListener?.("change", apply);
    };
  }, []);

  // --- [ADDED] IMAGE GENERATION HANDLERS ---

  // 1. Main handler triggered by the "Image" button in DayPlanCard
  const handleGenerateImage = async (title: string, markdown: string) => {
    setCurrentDayTitle(title);

    // Parse the markdown to find workout names and meal names
    const { workouts, meals } = extractItemsFromMarkdown(markdown);

    // Initialize state with loading placeholders
    setWorkoutItems(
      workouts.map((name) => ({ name, imageUrl: null, isLoading: true }))
    );
    setMealItems(
      meals.map((name) => ({ name, imageUrl: null, isLoading: true }))
    );

    setModalOpen(true);

    // Trigger API calls in parallel (fire and forget)
    workouts.forEach((name, index) => {
      generateSingleImage(name, "workout", index, title);
    });

    meals.forEach((name, index) => {
      generateSingleImage(name, "meal", index, title);
    });
  };

  // 2. Helper to generate a single image and update state
  const generateSingleImage = async (
    name: string,
    type: "workout" | "meal",
    index: number,
    dayTitle: string
  ) => {
    try {
      // Construct prompt context based on type
      const promptContext =
        type === "workout"
          ? `fitness exercise, gym workout action shot, ${name}, cinematic lighting, 4k`
          : `delicious food photography, healthy meal, ${name}, professional lighting, 8k`;

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: promptContext,
          title: dayTitle, // Used for logging or context if needed
        }),
      });

      const data = await response.json();

      if (data.image) {
        // Update the specific item in state with the generated image
        if (type === "workout") {
          setWorkoutItems((prev) => {
            const newArr = [...prev];
            if (newArr[index]) {
              newArr[index] = {
                ...newArr[index],
                imageUrl: data.image,
                isLoading: false,
              };
            }
            return newArr;
          });
        } else {
          setMealItems((prev) => {
            const newArr = [...prev];
            if (newArr[index]) {
              newArr[index] = {
                ...newArr[index],
                imageUrl: data.image,
                isLoading: false,
              };
            }
            return newArr;
          });
        }
      } else {
        throw new Error("No image data returned");
      }
    } catch (error) {
      console.error(`Failed to generate ${name}`, error);
      // Mark as failed (not loading, no image)
      const updateError = (prev: GeneratedItem[]) => {
        const newArr = [...prev];
        if (newArr[index]) {
          newArr[index] = { ...newArr[index], isLoading: false };
        }
        return newArr;
      };
      if (type === "workout") setWorkoutItems(updateError);
      else setMealItems(updateError);
    }
  };

  // LOADING SCREEN ----------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white items-center justify-center text-center p-6">
        <Loader2 className="w-14 h-14 animate-spin text-indigo-400 mb-6" />
        <h2 className="text-2xl sm:text-3xl font-semibold">
          Loading your plan...
        </h2>
        <p className="text-slate-400 mt-2">
          Sit back while we unpack your AI-generated fitness journey.
        </p>
      </div>
    );
  }

  // NO DATA FOUND ----------------------------------
  if (!fitnessData || !parsedPlan) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
        <AppNavbar />

        <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <Sparkles className="w-12 h-12 text-indigo-400 mb-4 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
            No fitness plan found
          </h2>
          <p className="text-slate-400 mb-6 max-w-sm">
            Looks like you haven&apos;t generated a plan yet. Start by telling
            FlexAI Coach about yourself.
          </p>

          <Button
            onClick={() => router.push("/create-plan")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 text-sm sm:text-base rounded-xl shadow-lg shadow-indigo-500/40"
          >
            Go to planner
          </Button>
        </main>
      </div>
    );
  }

  // MAIN RESULTS DASHBOARD ----------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      <AppNavbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 space-y-8 lg:space-y-10">
          {/* Top heading + actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs sm:text-sm text-indigo-200">
                <Sparkles className="h-4 w-4" />
                <span>Here&apos;s your AI-personalized 7-day plan</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Dashboard for {fitnessData.userProfile.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Explore your profile, workouts, diet, and tips. Click on each
                section to expand and dive deeper into your plan.
              </p>
            </div>

            {/* Top-right actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/create-plan")}
                className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800/80 text-xs sm:text-sm gap-1.5"
              >
                <ChevronRight className="h-4 w-4" />
                New plan
              </Button>
              <Button
                onClick={() => {
                  const doc = new jsPDF();
                  const text = fitnessData.plan;

                  const lines = doc.splitTextToSize(text, 180);
                  doc.text(lines, 10, 10);

                  doc.save(
                    `${fitnessData.userProfile.name}-fitness-plan.pdf`
                  );
                }}
                className="bg-indigo-500 hover:bg-indigo-600 text-xs sm:text-sm gap-1.5 shadow-lg shadow-indigo-500/40"
              >
                <Download className="h-4 w-4" />
                Download plan
              </Button>
            </div>
          </div>

          {/* GRID LAYOUT: Left = profile, Right = accordion dashboard */}
          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.8fr)] gap-6 lg:gap-8">
            {/* LEFT: USER PROFILE CARD */}
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 shadow-xl shadow-black/40">
                <ProfileInfoCard userProfile={fitnessData.userProfile} />
              </div>

              {/* Quick summary card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-indigo-300" />
                  <p className="text-sm font-semibold">Plan snapshot</p>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  Goal:{" "}
                  <span className="font-medium">
                    {fitnessData.userProfile.goal}
                  </span>{" "}
                  · Level:{" "}
                  <span className="font-medium">
                    {fitnessData.userProfile.level}
                  </span>{" "}
                  · Location:{" "}
                  <span className="font-medium">
                    {fitnessData.userProfile.location}
                  </span>
                </p>
                {fitnessData.userProfile.diet && (
                  <p className="text-xs sm:text-sm text-slate-300">
                    Diet preference:{" "}
                    <span className="font-medium">
                      {fitnessData.userProfile.diet}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT: DASHBOARD ACCORDION */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-4 sm:p-5 md:p-6 shadow-lg dark:shadow-xl dark:shadow-black/40">
              <Accordion
                type="single"
                collapsible
                className="space-y-3"
                defaultValue={defaultAccordionValue}
              >
                {/* INTRO SECTION */}
                <AccordionItem
                  value="intro"
                  className="border-b border-slate-800/70"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold text-slate-100 hover:no-underline">
                    Overview & introduction
                  </AccordionTrigger>
                  <AccordionContent className="pt-3">
                    <PersonalizedPlanIntro markdown={parsedPlan.intro} />
                  </AccordionContent>
                </AccordionItem>

                {/* DAYS SECTION - NESTED ACCORDION */}
                <AccordionItem
                  value="days"
                  className="border-b border-slate-800/70"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold text-slate-100 hover:no-underline">
                    7-day workout & diet plan
                  </AccordionTrigger>
                  <AccordionContent className="pt-3 space-y-4">
                    <p className="text-xs sm:text-sm text-slate-400 mb-1">
                      Click &quot;Show all days&quot; to view the list, then
                      expand any day to reveal its detailed schedule.
                    </p>

                    <Accordion type="single" collapsible className="space-y-2">
                      {/* wrapper "all days" */}
                      <AccordionItem value="all-days">
                        <AccordionTrigger className="text-xs sm:text-sm font-medium text-slate-100 hover:no-underline rounded-xl px-3 py-2 bg-slate-900/80 border border-slate-800">
                          Show all days
                        </AccordionTrigger>
                        <AccordionContent className="pt-3 space-y-3">
                          <Accordion
                            type="single"
                            collapsible
                            className="space-y-2"
                          >
                            {parsedPlan.days.map((day, idx) => (
                              <AccordionItem
                                key={idx}
                                value={`day-${idx}`}
                                className="border border-slate-800 rounded-2xl bg-slate-950/60"
                              >
                                <AccordionTrigger className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-100 hover:no-underline">
                                  {day.title}
                                </AccordionTrigger>
                                <AccordionContent className="px-3 pb-3 pt-1">
                                  <DayPlanCard
                                    title={day.title}
                                    markdown={day.content}
                                    // [ADDED] Pass the image generation handler
                                    onGenerateImage={handleGenerateImage}
                                  />
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>

                {/* TIPS SECTION */}
                <AccordionItem value="tips">
                  <AccordionTrigger className="text-sm sm:text-base font-semibold text-slate-100 hover:no-underline">
                    Key considerations & tips
                  </AccordionTrigger>
                  <AccordionContent className="pt-3">
                    <TipsAndSuccessSection
                      markdown={parsedPlan.tipsAndSuccess}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>

      {/* [ADDED] RENDER THE IMAGE GENERATOR MODAL */}
      <ImageGeneratorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        dayTitle={currentDayTitle}
        workouts={workoutItems}
        meals={mealItems}
      />
    </div>
  );
}