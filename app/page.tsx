// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  Sparkles,
  Brain,
  Mic,
  Image as ImageIcon,
  FileText,
  ArrowRight,
  Quote,
} from "lucide-react";
import AppNavbar from "@/components/AppNavbar";


export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      {/* NAVBAR */}
      <AppNavbar />


      {/* MAIN CONTENT */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 space-y-16 lg:space-y-24">
          {/* HERO SECTION */}
          <section className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs sm:text-sm text-indigo-200">
                <Sparkles className="h-4 w-4" />
                <span>AI-powered fitness + nutrition in one place</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                💪 AI Fitness Coach
                <span className="block text-indigo-400">
                  Personalized workout & diet plans in seconds.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                FlexAI Coach builds a 7-day workout and diet plan tailored to
                your body, goals, and lifestyle. No templates. No generic
                advice. Just smart, adaptive coaching powered by AI.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/create-plan">
                  <Button className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-sm sm:text-base px-6 py-5 gap-2 shadow-lg shadow-indigo-500/40">
                    Get your free plan
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-slate-600 bg-slate-900/60 hover:bg-slate-800/80 text-slate-100 text-sm sm:text-base"
                >
                  Watch demo (coming soon)
                </Button>
              </div>

              {/* Hero stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <p className="text-xs text-slate-400">Plan Type</p>
                  <p className="text-base sm:text-lg font-semibold">
                    Workout + Diet
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <p className="text-xs text-slate-400">Powered by</p>
                  <p className="text-base sm:text-lg font-semibold">
                    LLM + AI Voice
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 hidden sm:block">
                  <p className="text-xs text-slate-400">Export</p>
                  <p className="text-base sm:text-lg font-semibold">PDF &amp; local</p>
                </div>
              </div>
            </div>

            {/* Right: Mock app preview / illustration */}
            <div className="relative">
              <div className="absolute -top-6 -right-2 sm:-right-8 h-24 w-24 sm:h-32 sm:w-32 bg-indigo-500/40 rounded-full blur-3xl" />
              <div className="absolute bottom-0 -left-4 h-24 w-24 sm:h-32 sm:w-32 bg-violet-500/40 rounded-full blur-3xl" />

              <div className="relative rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur p-4 sm:p-5 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400">Current user</p>
                    <p className="text-sm sm:text-base font-semibold">
                      John • Muscle Gain
                    </p>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                    Plan ready
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium flex items-center gap-2">
                        <Brain className="h-4 w-4 text-indigo-300" />
                        AI Plan Summary
                      </span>
                      <span className="text-[11px] text-slate-400">
                        7-day split
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs">
                      Full-body strength + vegetarian muscle gain diet,
                      adjusted for home workouts and recovery.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
                      <p className="text-[11px] text-slate-400 mb-1">
                        Workout
                      </p>
                      <p className="text-xs font-medium mb-1">
                        Day 1 • Full-body A
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Squats, push-ups, lunges, core &amp; mobility.
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
                      <p className="text-[11px] text-slate-400 mb-1">Diet</p>
                      <p className="text-xs font-medium mb-1">
                        High-protein veg
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Oats, tofu, lentils, nuts &amp; leafy greens.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button className="flex items-center justify-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-2 py-1 text-[11px] hover:bg-slate-800">
                      <Mic className="h-3 w-3" />
                      Read plan
                    </button>
                    <button className="flex items-center justify-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-2 py-1 text-[11px] hover:bg-slate-800">
                      <ImageIcon className="h-3 w-3" />
                      View exercise
                    </button>
                    <button className="flex items-center justify-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-2 py-1 text-[11px] hover:bg-slate-800">
                      <FileText className="h-3 w-3" />
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURES SECTION */}
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              What FlexAI Coach can do for you
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              From smart plans to voice guidance and visuals — your fitness
              experience feels like a real coach, not just another static app.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <FeatureCard
                icon={<Brain className="h-5 w-5 text-indigo-300" />}
                title="AI-personalized workout plans"
                description="7-day routines with exercises, sets, reps, and rest times tuned to your goal, experience level, and location (home, gym, or outdoor)."
              />
              <FeatureCard
                icon={<Dumbbell className="h-5 w-5 text-emerald-300" />}
                title="Smart diet planning"
                description="Breakfast, lunch, snack, and dinner tailored to your diet preference — veg, non-veg, vegan, or keto."
              />
              <FeatureCard
                icon={<Mic className="h-5 w-5 text-pink-300" />}
                title="Voice-powered coaching"
                description="Let the app read out your plan so you can follow workouts hands-free — perfect for gym or home sessions."
              />
              <FeatureCard
                icon={<ImageIcon className="h-5 w-5 text-amber-300" />}
                title="AI exercise & meal images"
                description="Tap an exercise or meal to see an AI-generated visual of how it looks or how it’s plated."
              />
              <FeatureCard
                icon={<FileText className="h-5 w-5 text-sky-300" />}
                title="Export & save"
                description="Export your plan as PDF, save it locally, and regenerate whenever you want to tweak your goals."
              />
              <FeatureCard
                icon={<Sparkles className="h-5 w-5 text-violet-300" />}
                title="Daily motivation"
                description="Fresh AI-generated motivational lines to keep you consistent and accountable."
              />
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              How it works
            </h2>

            <div className="grid md:grid-cols-3 gap-5">
              <StepCard
                step="01"
                title="Tell us about yourself"
                description="Fill in your age, height, weight, goal, fitness level, workout location, diet, and optional medical history."
              />
              <StepCard
                step="02"
                title="AI builds your plan"
                description="Our AI generates a fully personalized 7-day workout + diet plan — no templates, no copy-paste."
              />
              <StepCard
                step="03"
                title="Follow, listen, or export"
                description="View your plan, listen to it via voice, see exercise images, and export to PDF or save locally."
              />
            </div>
          </section>

          {/* MOTIVATION / QUOTE */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 px-5 py-6 sm:px-7 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
              <Quote className="h-5 w-5 text-indigo-300" />
            </div>
            <div className="space-y-2">
              <p className="text-sm sm:text-base text-slate-200 italic">
                “You don’t need more motivation. You need a system that makes
                staying consistent easier.”
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                Start today with a plan that’s designed around your life, not
                someone else’s.
              </p>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-semibold">
              Ready to see your own AI-powered plan?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto">
              It takes less than a minute. Answer a few questions and let FlexAI
              Coach do the heavy lifting.
            </p>
            <Link href="/create-plan">
              <Button className="mt-1 bg-indigo-500 hover:bg-indigo-600 px-8 py-5 text-sm sm:text-base shadow-lg shadow-indigo-500/40">
                Start free — generate my plan
              </Button>
            </Link>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
        Built with ❤️ for smarter, sustainable fitness.
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 flex flex-col gap-2 hover:border-indigo-500/70 hover:bg-slate-900 transition">
      <div className="h-9 w-9 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-center mb-1">
        {icon}
      </div>
      <h3 className="text-sm sm:text-base font-semibold">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-300">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 flex flex-col gap-2">
      <span className="text-xs font-mono text-slate-400">Step {step}</span>
      <h3 className="text-sm sm:text-base font-semibold">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-300">{description}</p>
    </div>
  );
}
