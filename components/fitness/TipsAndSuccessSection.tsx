"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Target, Star, ChevronRight } from "lucide-react";

interface TipsAndSuccessSectionProps {
  markdown: string;
}

export function TipsAndSuccessSection({ markdown }: TipsAndSuccessSectionProps) {
  if (!markdown || !markdown.trim()) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 sm:p-4 shadow-sm">
      {/* small header inside accordion */}
      <div className="flex items-start sm:items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center shadow-md shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            Tips & Success Boosters
          </p>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Practical habits, quick wins, and safety notes tailored for your plan.
          </p>
        </div>
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
              <strong className="font-semibold text-amber-300">{props.children}</strong>
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
