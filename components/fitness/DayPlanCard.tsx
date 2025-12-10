"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  CheckCircle2,
  Flame,
  Circle,
  Volume2,
  Image as ImageIcon,
} from "lucide-react";
import { useSpeech } from "@/components/SpeechProvider";

interface DayPlanCardProps {
  title: string;
  markdown: string;
}

export function DayPlanCard({ title, markdown }: DayPlanCardProps) {
  const { speak, pause, resume, status, currentText, supported } = useSpeech();

  // Build the text we want to read for this day
    // Build the text we want to read for this day
  const speechText = useMemo(() => {
    if (!markdown) return title;

    const cleaned = markdown
      // Turn newlines into sentence-like pauses
      .replace(/\n+/g, ". ")

      // Remove markdown control symbols
      .replace(/[#>*`*_|\[\]\(\)]/g, " ")

      // Treat " - " like a break (common in bullet lists)
      .replace(/\s-\s/g, ". ")

      // Collapse whitespace
      .replace(/\s+/g, " ")

      // Avoid weird multiple dots
      .replace(/\.{2,}/g, ".")

      .trim();

    // Avoid double dots if title already ends with "."
    const safeTitle = title.replace(/\.+$/, "");

    return `${safeTitle}. ${cleaned}`;
  }, [title, markdown]);


  const isThisDay = currentText === speechText;
  const isPlayingThisDay = isThisDay && status === "playing";
  const isPausedThisDay = isThisDay && status === "paused";

  const handleReadClick = () => {
    if (!supported) return;

    if (isPlayingThisDay) {
      // currently reading this day → pause
      pause();
      return;
    }

    if (isPausedThisDay) {
      // paused on this day → resume
      resume();
      return;
    }

    // otherwise start reading this day's text (also cancels anything else)
    speak(speechText);
  };

  const buttonLabel = !supported
    ? "Not supported"
    : isPlayingThisDay
    ? "Pause"
    : isPausedThisDay
    ? "Resume"
    : "Read";

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-3 sm:p-5 shadow-sm">
      {/* Header row: stacks on mobile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-slate-100 truncate">
              {title}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Tap a day to expand. Contains workout &amp; meals.
            </p>
          </div>
        </div>

        {/* Actions: full-width stacked on mobile, inline on desktop */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-1 sm:mt-0">
          <button
            type="button"
            disabled={!supported}
            onClick={handleReadClick}
            className="group inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs sm:text-sm bg-slate-900/70 border border-slate-800 hover:bg-slate-900 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Listen to day plan"
            title="Read day plan"
          >
            <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-300" />
            <span className="text-slate-300">{buttonLabel}</span>
          </button>

          <button
            type="button"
            className="group inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs sm:text-sm bg-slate-900/70 border border-slate-800 hover:bg-slate-900 w-full sm:w-auto"
            aria-label="View image"
            title="View exercise image"
          >
            <ImageIcon className="w-4 h-4 text-slate-300 group-hover:text-amber-300" />
            <span className="text-slate-300">Image</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800/60 pt-3">
        {/* Markdown content */}
        <div className="prose prose-xs sm:prose-sm max-w-none text-slate-200 prose-invert">
          <ReactMarkdown
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-base sm:text-lg font-semibold text-indigo-300 flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  {props.children}
                </h1>
              ),
              h2: ({ ...props }) => (
                <h2 className="text-sm sm:text-base font-semibold text-slate-100 flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  {props.children}
                </h2>
              ),
              h3: ({ ...props }) => (
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-1">
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
                <ul className="mb-2 pl-4 list-none space-y-1">
                  {props.children}
                </ul>
              ),
              ol: ({ ...props }) => (
                <ol className="mb-2 pl-4 list-decimal space-y-1">
                  {props.children}
                </ol>
              ),
              li: ({ ...props }) => (
                <li className="flex items-start gap-2 text-slate-200 text-xs sm:text-sm">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400/90 flex-shrink-0" />
                  <span>{props.children}</span>
                </li>
              ),
              strong: ({ ...props }) => (
                <strong className="font-semibold text-indigo-300">
                  {props.children}
                </strong>
              ),
              code: ({ ...props }) => (
                <code className="bg-slate-900/80 text-amber-300 px-1 rounded text-[11px]">
                  {props.children}
                </code>
              ),
              blockquote: ({ ...props }) => (
                <blockquote className="border-l-4 border-indigo-500/40 bg-slate-900/70 px-3 py-2 italic rounded-md text-slate-200 text-sm mb-2">
                  {props.children}
                </blockquote>
              ),
              pre: ({ ...props }) => (
                <pre className="bg-slate-900/70 rounded-md p-2 overflow-x-auto text-xs mb-2">
                  <code>{props.children}</code>
                </pre>
              ),
            }}
          >
            {markdown || "_No details provided for this day._"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
