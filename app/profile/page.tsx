"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AppNavbar from "@/components/AppNavbar";
import { Button } from "@/components/ui/button";
import { fetchProfile, ProfileRow } from "@/lib/profileService";
import { useAuth } from "@/lib/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const data = await fetchProfile();
        if (!mounted) return;
        setProfile(data);
      } catch (err: any) {
        console.error("Error loading profile:", err);
        if (!mounted) return;
        setError(
          err?.message ||
            "Could not load profile. Try creating a plan first."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const email = user?.email ?? "";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      <AppNavbar hideAuth={false} />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="mb-8 sm:mb-10 space-y-2 text-center">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Your Profile
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              This is the data FlexAI Coach uses to generate your personalized
              plans.
            </p>
          </div>

          {loading && (
            <div className="w-full flex justify-center py-10">
              <p className="text-sm text-slate-300">Loading your profile...</p>
            </div>
          )}

          {!loading && error && (
            <div className="w-full bg-red-950/50 border border-red-800 text-red-100 rounded-2xl px-4 py-4 sm:px-6 sm:py-5 space-y-3">
              <p className="text-sm">{error}</p>
              <Button asChild className="bg-indigo-500 hover:bg-indigo-600">
                <Link href="/create-plan">Create or update your profile</Link>
              </Button>
            </div>
          )}

          {!loading && !error && !profile && (
            <div className="w-full bg-slate-900/70 border border-slate-800 text-slate-100 rounded-2xl px-4 py-4 sm:px-6 sm:py-5 space-y-3">
              <p className="text-sm">
                No profile found yet. Create your first plan to save your
                details.
              </p>
              <Button asChild className="bg-indigo-500 hover:bg-indigo-600">
                <Link href="/create-plan">Create your plan</Link>
              </Button>
            </div>
          )}

          {!loading && profile && (
            <div className="space-y-6">
              {/* Top card */}
              <div className="w-full bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-black/40 px-5 py-6 sm:px-7 sm:py-7 space-y-5">
                {/* Name + email */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold">
                      {profile.name || "Unnamed user"}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400">
                      {email || "No email available"}
                    </p>
                  </div>

                  <Button asChild variant="outline" className="border-indigo-500/60 text-indigo-300 hover:bg-indigo-500/10">
                    <Link href="/create-plan">Edit details via Create Plan</Link>
                  </Button>
                </div>

                {/* Basic metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-slate-950/60 border border-slate-800 px-4 py-3">
                    <p className="text-xs text-slate-400">Age</p>
                    <p className="text-lg font-semibold">
                      {profile.age ?? "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-950/60 border border-slate-800 px-4 py-3">
                    <p className="text-xs text-slate-400">Height</p>
                    <p className="text-lg font-semibold">
                      {profile.height ? `${profile.height} cm` : "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-950/60 border border-slate-800 px-4 py-3">
                    <p className="text-xs text-slate-400">Weight</p>
                    <p className="text-lg font-semibold">
                      {profile.weight ? `${profile.weight} kg` : "-"}
                    </p>
                  </div>
                </div>

                {/* Preferences */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-950/60 border border-slate-800 px-4 py-3">
                    <p className="text-xs text-slate-400">Gender</p>
                    <p className="text-sm font-medium">{profile.gender}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-950/60 border border-slate-800 px-4 py-3">
                    <p className="text-xs text-slate-400">Fitness Goal</p>
                    <p className="text-sm font-medium">{profile.goal}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-950/60 border border-slate-800 px-4 py-3">
                    <p className="text-xs text-slate-400">Experience Level</p>
                    <p className="text-sm font-medium">{profile.level}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-950/60 border border-slate-800 px-4 py-3">
                    <p className="text-xs text-slate-400">Workout Location</p>
                    <p className="text-sm font-medium">{profile.location}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-950/60 border border-slate-800 px-4 py-3">
                    <p className="text-xs text-slate-400">Diet Preference</p>
                    <p className="text-sm font-medium">{profile.diet}</p>
                  </div>
                </div>

                {/* Notes */}
                {(profile.medical_history || profile.stress_level) && (
                  <div className="pt-3 border-t border-slate-800/70 space-y-3">
                    {profile.medical_history && (
                      <div>
                        <p className="text-xs text-slate-400 mb-1">
                          Medical History
                        </p>
                        <p className="text-sm text-slate-100 whitespace-pre-line">
                          {profile.medical_history}
                        </p>
                      </div>
                    )}

                    {profile.stress_level && (
                      <div>
                        <p className="text-xs text-slate-400 mb-1">
                          Stress Level
                        </p>
                        <p className="text-sm text-slate-100">
                          {profile.stress_level}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex justify-center">
                <Button asChild className="bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/40">
                  <Link href="/create-plan">Generate a new plan</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
