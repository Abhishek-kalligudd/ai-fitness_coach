"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { ProfileInfoCard } from "@/components/fitness/ProfileInfoCard";
import { PersonalizedPlanIntro } from "@/components/fitness/PersonalizedPlanIntro";
import { DayPlanCard } from "@/components/fitness/DayPlanCard";
import { TipsAndSuccessSection } from "@/components/fitness/TipsAndSuccessSection";
import { parsePlanMarkdown, ParsedPlan } from "@/utils/parsePlanMarkdown";

import { Sparkles, Loader2 } from "lucide-react";

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

  // LOADING SCREEN ----------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center text-center p-6">
        <Loader2 className="w-14 h-14 animate-spin text-indigo-600 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800">Loading your plan...</h2>
        <p className="text-gray-600 mt-2">Please wait while we prepare everything ♡</p>
      </div>
    );
  }

  // NO DATA FOUND ----------------------------------
  if (!fitnessData || !parsedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center text-center px-6">
        <Sparkles className="w-12 h-12 text-indigo-600 mb-4 animate-pulse" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          No fitness plan found
        </h2>
        <p className="text-gray-600 mb-6 max-w-sm">
          Please complete the form to generate your personalized plan.
        </p>

        <Button
          onClick={() => router.push("/")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 text-lg rounded-xl shadow-md"
        >
          Back to Form
        </Button>
      </div>
    );
  }

  // MAIN RESULTS PAGE ----------------------------------
  return (
    <div
      className="
        min-h-screen 
        bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 
        py-10 px-4 sm:px-6 md:px-8 
        flex justify-center
      "
    >
      <div
        className="
          w-full 
          max-w-3xl lg:max-w-4xl 
          space-y-10 
          animate-fadeIn 
        "
      >
        {/* USER PROFILE */}
        <ProfileInfoCard userProfile={fitnessData.userProfile} />

        {/* INTRO SECTION */}
        <PersonalizedPlanIntro markdown={parsedPlan.intro} />

        {/* DAY PLAN LIST (VERY RESPONSIVE) */}
        <div className="space-y-10">
          {parsedPlan.days.map((day, idx) => (
            <DayPlanCard key={idx} title={day.title} markdown={day.content} />
          ))}
        </div>

        {/* TIPS + SUCCESS */}
        <TipsAndSuccessSection markdown={parsedPlan.tipsAndSuccess} />

        {/* ACTION BUTTONS */}
        <div
          className="
            flex flex-col sm:flex-row 
            gap-4 
            justify-center 
            mt-12 
          "
        >
          <Button
            onClick={() => router.push("/")}
            className="
              bg-indigo-600 hover:bg-indigo-700 
              text-white text-lg 
              px-10 py-4 
              rounded-xl shadow-lg
            "
          >
            Create New Plan
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
            className="
              bg-green-600 hover:bg-green-700 
              text-white text-lg 
              px-10 py-4 
              rounded-xl shadow-lg
            "
          >
            Download Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
