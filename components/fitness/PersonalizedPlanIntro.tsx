"use client";

import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Sparkles, Bookmark, Flame, CheckCircle2, Circle } from "lucide-react";

interface PersonalizedPlanIntroProps {
  markdown: string;
}

export function PersonalizedPlanIntro({ markdown }: PersonalizedPlanIntroProps) {
  if (!markdown.trim()) return null;

  return (
    <Card
      className="
        bg-white rounded-3xl shadow-xl 
        hover:shadow-3xl hover:-translate-y-1 
        transition-all duration-500 
        p-10 mb-10
        border border-gray-100
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Your Personalized Plan
          </h2>
        </div>

        <Bookmark className="w-7 h-7 text-indigo-500" />
      </div>

      {/* MARKDOWN */}
      <div className="prose prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed">
        <ReactMarkdown
          components={{
            h1: ({ ...props }) => (
              <h1
                className="
                  text-5xl font-black mt-10 mb-5 
                  text-indigo-700 flex items-center gap-3
                "
              >
                <Flame className="w-7 h-7 text-red-500" />
                {props.children}
              </h1>
            ),

            h2: ({ ...props }) => (
              <h2
                className="
                  text-4xl font-semibold mt-8 mb-4 
                  text-blue-700 flex items-center gap-2
                "
              >
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
                {props.children}
              </h2>
            ),

            h3: ({ ...props }) => (
              <h3
                className="
                  text-3xl font-semibold mt-6 mb-3 text-gray-800 
                  flex items-center gap-2
                "
              >
                <Circle className="w-4 h-4 text-gray-400" />
                {props.children}
              </h3>
            ),

            p: ({ ...props }) => (
              <p className="mb-5 text-gray-800 text-lg">{props.children}</p>
            ),

            ul: ({ ...props }) => (
              <ul className="mb-6 pl-6 space-y-3 border-l-4 border-indigo-300">
                {props.children}
              </ul>
            ),

            ol: ({ ...props }) => (
              <ol className="mb-6 pl-6 space-y-3 border-l-4 border-blue-300">
                {props.children}
              </ol>
            ),

            li: ({ ...props }) => (
              <li className="flex items-start gap-3 text-gray-800">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mt-3"></span>
                <span>{props.children}</span>
              </li>
            ),

            strong: ({ ...props }) => (
              <strong className="font-bold text-indigo-700">{props.children}</strong>
            ),

            blockquote: ({ ...props }) => (
              <blockquote
                className="
                  bg-indigo-50 border-l-8 border-indigo-400 
                  px-6 py-4 italic 
                  rounded-xl shadow-sm mb-6
                "
              >
                {props.children}
              </blockquote>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </Card>
  );
}
