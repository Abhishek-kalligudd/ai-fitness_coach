"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppNavbar from "@/components/AppNavbar";
import { Dumbbell, Sparkles, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // After signup → go to sign in (like your original logic)
    router.replace("/signin");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Navbar */}
      <AppNavbar />

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-5xl mx-auto grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
          {/* Left side – hero / copy */}
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/40 bg-slate-900/60 px-3 py-1 text-xs font-medium tracking-wide shadow-lg shadow-lime-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Create your AI-powered fitness account</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                Join your{" "}
                <span className="bg-gradient-to-r from-lime-300 via-emerald-300 to-sky-300 bg-clip-text text-transparent">
                  personalized fitness journey
                </span>
                .
              </h1>
              <p className="text-sm md:text-base text-slate-300/90 max-w-xl">
                Get custom workout and diet plans tuned to your goals, schedule
                and equipment. Sign up in seconds and let the AI handle the
                rest.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-slate-300/80">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 border border-slate-700/80">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-100">
                    Plans that adapt with you
                  </p>
                  <p className="text-xs md:text-sm text-slate-400">
                    Your workouts and meals evolve based on your feedback and
                    progress.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 border border-slate-700/80">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-100">
                    No fluff, just results
                  </p>
                  <p className="text-xs md:text-sm text-slate-400">
                    Every suggestion is tailored to your goals, time, and
                    equipment availability.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right side – signup card */}
          <section className="relative">
            <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-tr from-lime-500/30 via-emerald-400/10 to-sky-500/30 blur-2xl opacity-40" />
            <div className="relative rounded-3xl border border-slate-700/80 bg-slate-950/80 backdrop-blur-xl shadow-2xl px-6 py-7 md:px-8 md:py-8 space-y-6">
              <div className="space-y-1.5 text-center">
                <h2 className="text-xl md:text-2xl font-semibold">
                  Create your account
                </h2>
                <p className="text-xs md:text-sm text-slate-400">
                  It takes less than a minute to get started.
                </p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium text-slate-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-600/70 bg-slate-900/60 px-3 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-600/70 bg-slate-900/60 px-3 py-2.5 pr-10 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-lime-500/30 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-[2px] border-slate-900 border-t-transparent" />
                      Creating your account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              <div className="pt-2 text-center text-xs md:text-sm text-slate-400">
                Already have an account?{" "}
                <a
                  href="/signin"
                  className="font-medium text-lime-300 hover:text-lime-200"
                >
                  Sign in
                </a>
              </div>

              <p className="text-[11px] text-center text-slate-500 pt-1">
                By creating an account you agree to our{" "}
                <span className="underline underline-offset-2">Terms</span>{" "}
                &amp;{" "}
                <span className="underline underline-offset-2">
                  Privacy Policy
                </span>
                .
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
