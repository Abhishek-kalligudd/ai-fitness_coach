"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";
import { Button } from "@/components/ui/button";
import AppNavbar from "@/components/AppNavbar";

interface Plan {
  id: string;
  title: string;
  plan_markdown: string;
  plan_json: any;
  intro: string;
  tips: string;
  created_at: string;
}

export default function PlansPage() {
  const { user, loading } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetchPlans();
  }, [user]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPlans(data);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    }
  };

  const handleSaveDummyPlan = async () => {
    if (!user) return alert("Sign in first!");

    setIsSaving(true);

    const dummyPlan = {
      title: "My 7-day Fitness Plan",
      plan_markdown: "## Day 1\nWorkout + Meal Plan",
      plan_json: {},
      intro: "This is a sample plan intro",
      tips: "Some tips here",
    };

    try {
      const res = await fetch("/api/save-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dummyPlan),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Save failed:", data);
        alert(data.error || "Failed to save plan");
      } else {
        alert("Plan saved successfully!");
        fetchPlans(); // refresh the list
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <AppNavbar />
      <main className="max-w-4xl mx-auto py-10 px-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Saved Plans</h1>
          <Button onClick={handleSaveDummyPlan} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save New Plan"}
          </Button>
        </div>

        {plans.length === 0 ? (
          <p>No plans saved yet.</p>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-lg p-4 bg-white dark:bg-slate-900 shadow"
              >
                <h2 className="font-semibold">{plan.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {new Date(plan.created_at).toLocaleString()}
                </p>
                <div className="mt-2">
                  <details className="text-sm text-slate-700 dark:text-slate-300">
                    <summary>View Markdown</summary>
                    <pre className="overflow-x-auto p-2 bg-slate-100 dark:bg-slate-800 rounded mt-1">
                      {plan.plan_markdown}
                    </pre>
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
