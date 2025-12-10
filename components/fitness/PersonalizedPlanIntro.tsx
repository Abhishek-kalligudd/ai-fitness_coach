"use client";

import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Circle,
  Volume2,
} from "lucide-react";
import { useMemo } from "react";
import { useSpeech } from "@/components/SpeechProvider";

interface PersonalizedPlanIntroProps {
  markdown: string;
}

export function PersonalizedPlanIntro({ markdown }: PersonalizedPlanIntroProps) {
  if (!markdown || !markdown.trim()) return null;

  const { speak, pause, resume, status, currentText, supported } = useSpeech();

  // Build the text to read for the intro
  const speechText = useMemo(() => {
  if (!markdown) return "Overview and introduction.";

  const plain = markdown
    // New lines → sentence pauses
    .replace(/\n+/g, ". ")

    // Remove markdown symbols
    .replace(/[#>*`*_|\[\]\(\)]/g, " ")

    // Treat bullet dashes as breaks
    .replace(/\s-\s/g, ". ")

    // Collapse whitespace
    .replace(/\s+/g, " ")

    // Prevent multiple dots
    .replace(/\.{2,}/g, ".")

    .trim();

  return `Overview and introduction. ${plain}`;
}, [markdown]);

  const isThisSection = currentText === speechText;
  const isPlayingThisSection = isThisSection && status === "playing";
  const isPausedThisSection = isThisSection && status === "paused";

  const handleReadClick = () => {
    if (!supported) return;

    if (isPlayingThisSection) {
      // currently reading this intro → pause
      pause();
      return;
    }

    if (isPausedThisSection) {
      // paused on this intro → resume
      resume();
      return;
    }

    // otherwise start reading this intro (also cancels anything else)
    speak(speechText);
  };

  const buttonLabel = !supported
    ? "Not supported"
    : isPlayingThisSection
    ? "Pause"
    : isPausedThisSection
    ? "Resume"
    : "Read";

  return (
    <Card
      className="
        bg-slate-950/60 
        border border-slate-800 
        rounded-2xl 
        px-4 py-4 sm:px-5 sm:py-5
        shadow-sm
      "
    >
      {/* HEADER ROW: badge + text + read button */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Overview &amp; Introduction
            </p>
            <p className="text-[11px] text-slate-500">
              A quick summary of your AI-personalized plan.
            </p>
          </div>
        </div>

        {/* Read button */}
        <button
          type="button"
          disabled={!supported}
          onClick={handleReadClick}
          className="
            inline-flex items-center justify-center gap-1.5
            rounded-md px-2.5 py-1.5
            text-[11px] sm:text-xs
            bg-slate-900/70 border border-slate-800
            hover:bg-slate-900
            text-slate-200
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          aria-label="Listen to overview and introduction"
          title="Read overview"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{buttonLabel}</span>
        </button>
      </div>

      {/* MARKDOWN CONTENT */}
      <div className="prose prose-sm max-w-none text-slate-200 prose-invert">
        <ReactMarkdown
          components={{
            h1: ({ ...props }) => (
              <h1
                className="
                  text-lg sm:text-xl font-semibold mt-4 mb-2
                  flex items-center gap-2 text-indigo-300
                "
              >
                <Flame className="w-4 h-4 text-rose-300" />
                {props.children}
              </h1>
            ),

            h2: ({ ...props }) => (
              <h2
                className="
                  text-base sm:text-lg font-semibold mt-4 mb-2
                  flex items-center gap-2 text-slate-100
                "
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                {props.children}
              </h2>
            ),

            h3: ({ ...props }) => (
              <h3
                className="
                  text-sm font-semibold mt-3 mb-1
                  flex items-center gap-2 text-slate-200
                "
              >
                <Circle className="w-3 h-3 text-slate-500" />
                {props.children}
              </h3>
            ),

            p: ({ ...props }) => (
              <p className="mb-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
                {props.children}
              </p>
            ),

            ul: ({ ...props }) => (
              <ul className="mb-3 pl-4 space-y-1.5 list-none">
                {props.children}
              </ul>
            ),

            ol: ({ ...props }) => (
              <ol className="mb-3 pl-4 space-y-1.5 list-decimal">
                {props.children}
              </ol>
            ),

            li: ({ ...props }) => (
              <li className="flex items-start gap-2 text-slate-200">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400/90 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{props.children}</span>
              </li>
            ),

            strong: ({ ...props }) => (
              <strong className="font-semibold text-indigo-300">
                {props.children}
              </strong>
            ),

            blockquote: ({ ...props }) => (
              <blockquote
                className="
                  bg-slate-900/80 border-l-4 border-indigo-500/50
                  px-3 py-2 italic rounded-md mb-3 text-slate-200
                  text-xs sm:text-sm
                "
              >
                {props.children}
              </blockquote>
            ),

            code: ({ ...props }) => (
              <code className="bg-slate-900/80 text-amber-300 px-1 rounded text-[11px]">
                {props.children}
              </code>
            ),

            pre: ({ ...props }) => (
              <pre className="bg-slate-950/80 rounded-md p-3 overflow-x-auto text-xs">
                <code>{props.children}</code>
              </pre>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </Card>
  );
}
