"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Target, Star, ChevronRight, Volume2 } from "lucide-react";
import { useSpeech } from "@/components/SpeechProvider";

interface TipsAndSuccessSectionProps {
  markdown: string;
}

export function TipsAndSuccessSection({ markdown }: TipsAndSuccessSectionProps) {
  if (!markdown || !markdown.trim()) return null;

  const { speak, pause, resume, status, currentText, supported } = useSpeech();

  // Build the spoken text for tips
  const speechText = useMemo(() => {
  if (!markdown) return "Tips and success boosters.";

  const plain = markdown
    // New lines → natural pauses
    .replace(/\n+/g, ". ")

    // Remove markdown control characters
    .replace(/[#>*`*_|\[\]\(\)]/g, " ")

    // Treat dash-separated bullets as sentence breaks
    .replace(/\s-\s/g, ". ")

    // Normalize whitespace
    .replace(/\s+/g, " ")

    // Avoid multiple dots
    .replace(/\.{2,}/g, ".")

    .trim();

  return `Tips and success boosters. ${plain}`;
}, [markdown]);


  const isThisSection = currentText === speechText;
  const isPlayingThisSection = isThisSection && status === "playing";
  const isPausedThisSection = isThisSection && status === "paused";

  const handleReadClick = () => {
    if (!supported) return;

    if (isPlayingThisSection) {
      pause();
      return;
    }
    if (isPausedThisSection) {
      resume();
      return;
    }

    // Start reading this tips section (cancels any other active speech)
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
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 sm:p-4 shadow-sm">
      {/* header + read button */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center shadow-md shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Tips &amp; Success Boosters
            </p>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Practical habits, quick wins, and safety notes tailored for your plan.
            </p>
          </div>
        </div>

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
            shrink-0
          "
          aria-label="Listen to tips and success section"
          title="Read tips"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{buttonLabel}</span>
        </button>
      </div>

      <div className="prose prose-sm max-w-none text-slate-200 prose-invert">
        <ReactMarkdown
          components={{
            h1: ({ ...props }) => (
              <h1 className="text-lg sm:text-xl font-semibold text-amber-300 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-300" />
                {props.children}
              </h1>
            ),

            h2: ({ ...props }) => (
              <h2 className="text-sm sm:text-base font-semibold text-slate-100 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-emerald-300" />
                {props.children}
              </h2>
            ),

            p: ({ ...props }) => (
              <p className="mb-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
                {props.children}
              </p>
            ),

            ul: ({ ...props }) => (
              <ul className="mb-2 pl-4 space-y-1 list-none">
                {props.children}
              </ul>
            ),

            ol: ({ ...props }) => (
              <ol className="mb-2 pl-4 space-y-1 list-decimal">
                {props.children}
              </ol>
            ),

            li: ({ ...props }) => (
              <li className="flex items-start gap-2 text-slate-200 text-xs sm:text-sm">
                <ChevronRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                <span>{props.children}</span>
              </li>
            ),

            blockquote: ({ ...props }) => (
              <blockquote className="border-l-4 border-violet-500/40 bg-slate-900/70 px-3 py-2 italic rounded-md mb-2 text-slate-200 text-sm">
                {props.children}
              </blockquote>
            ),

            strong: ({ ...props }) => (
              <strong className="font-semibold text-amber-300">
                {props.children}
              </strong>
            ),

            code: ({ ...props }) => (
              <code className="bg-slate-900/80 text-amber-300 px-1 rounded text-[11px]">
                {props.children}
              </code>
            ),

            pre: ({ ...props }) => (
              <pre className="bg-slate-900/70 rounded-md p-2 overflow-x-auto text-xs mb-2">
                <code>{props.children}</code>
              </pre>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
