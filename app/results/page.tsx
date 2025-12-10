"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { parsePlanMarkdown, ParsedPlan } from "@/utils/parsePlanMarkdown";

import {
  Sparkles,
  Loader2,
  Dumbbell,
  FileText,
  Download,
  ChevronRight,
} from "lucide-react";

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
  const [defaultAccordionValue, setDefaultAccordionValue] = useState<string | undefined>(undefined);

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

  // LOADING SCREEN ----------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white items-center justify-center text-center p-6">
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
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        {/* NAVBAR */}
        <header className="w-full border-b border-slate-800/60 backdrop-blur sticky top-0 z-30 bg-slate-950/70">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-base sm:text-lg">
                  FlexAI Coach
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400">
                  Your personal AI fitness mentor
                </span>
              </div>
            </Link>

            {/* Right: Theme toggle + auth buttons (placeholder) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-slate-700 bg-slate-900/60 hover:bg-slate-800 transition"
                aria-label="Toggle theme"
              >
                <span className="text-lg">🌓</span>
              </button>
              <Button
                asChild
                variant="ghost"
                className="hidden sm:inline-flex text-slate-200 hover:text-white hover:bg-slate-800/60"
              >
                <Link href="#">Sign in</Link>
              </Button>
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-sm sm:text-base shadow-lg shadow-indigo-500/40">
                Sign up
              </Button>
            </div>
          </nav>
        </header>

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* NAVBAR (same as other pages) */}
      <header className="w-full border-b border-slate-800/60 backdrop-blur sticky top-0 z-30 bg-slate-950/70">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-base sm:text-lg">
                FlexAI Coach
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400">
                Your personal AI fitness mentor
              </span>
            </div>
          </Link>

          {/* Right: Theme toggle + auth buttons (placeholder) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-slate-700 bg-slate-900/60 hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              <span className="text-lg">🌓</span>
            </button>
            <Button
              asChild
              variant="ghost"
              className="hidden sm:inline-flex text-slate-200 hover:text-white hover:bg-slate-800/60"
            >
              <Link href="#">Sign in</Link>
            </Button>
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-sm sm:text-base shadow-lg shadow-indigo-500/40">
              Sign up
            </Button>
          </div>
        </nav>
      </header>

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
                  const element = document.createElement("a");
                  element.setAttribute(
                    "href",
                    "data:text/plain;charset=utf-8," +
                      encodeURIComponent(fitnessData.plan)
                  );
                  element.setAttribute(
                    "download",
                    `${fitnessData.userProfile.name}-fitness-plan.txt`
                  );
                  element.style.display = "none";
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
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
                  Goal: <span className="font-medium">{fitnessData.userProfile.goal}</span> · Level:{" "}
                  <span className="font-medium">{fitnessData.userProfile.level}</span> · Location:{" "}
                  <span className="font-medium">{fitnessData.userProfile.location}</span>
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
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 md:p-6 shadow-xl shadow-black/40">
              <Accordion type="single" collapsible className="space-y-3" defaultValue={defaultAccordionValue}>
                {/* INTRO SECTION */}
                <AccordionItem value="intro" className="border-b border-slate-800/70">
                  <AccordionTrigger className="text-sm sm:text-base font-semibold text-slate-100 hover:no-underline">
                    Overview & introduction
                  </AccordionTrigger>
                  <AccordionContent className="pt-3">
                    <PersonalizedPlanIntro markdown={parsedPlan.intro} />
                  </AccordionContent>
                </AccordionItem>

                {/* DAYS SECTION - NESTED ACCORDION */}
                <AccordionItem value="days" className="border-b border-slate-800/70">
                  <AccordionTrigger className="text-sm sm:text-base font-semibold text-slate-100 hover:no-underline">
                    7-day workout & diet plan
                  </AccordionTrigger>
                  <AccordionContent className="pt-3 space-y-4">
                    <p className="text-xs sm:text-sm text-slate-400 mb-1">
                      Click &quot;Show all days&quot; to view the list, then expand any day to reveal
                      its detailed schedule.
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
    </div>
  );
}
