'use client';

import AppNavbar from '@/components/AppNavbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/signin');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const email = user.email ?? '';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      {/* NAVBAR */}
      <AppNavbar hideAuth={false} />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
          {/* Greeting Header */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Welcome back 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-400">
              Logged in as <span className="text-indigo-300">{email}</span>
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-black/40 px-6 py-8 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs sm:text-sm text-indigo-200">
              <Sparkles className="h-4 w-4" />
              <span>Your Fitness Tools</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Create New Plan */}
              <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-6 flex flex-col justify-between space-y-4">
                <h2 className="text-xl font-semibold">Create a New Plan</h2>
                <p className="text-sm text-slate-400">
                  Generate a personalized 7-day workout + meal plan tailored to your needs.
                </p>
                <Button
                  className="w-full bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/40"
                  onClick={() => router.push('/create-plan')}
                >
                  Create Plan
                </Button>
              </div>

              {/* View Existing Plans */}
              <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-6 flex flex-col justify-between space-y-4">
                <h2 className="text-xl font-semibold">View Saved Plans</h2>
                <p className="text-sm text-slate-400">
                  See all the plans you've generated and access them anytime.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-indigo-500 text-indigo-300 hover:bg-indigo-600 hover:text-white"
                  onClick={() => router.push('/plans')}
                >
                  View Plans
                </Button>
              </div>

              {/* View Profile */}
              <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-6 flex flex-col justify-between space-y-4 sm:col-span-2">
                <h2 className="text-xl font-semibold">Your Profile</h2>
                <p className="text-sm text-slate-400">
                  View or update your personal fitness details.
                </p>
                <Button
                  variant="ghost"
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700"
                  onClick={() => router.push('/profile')}
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
