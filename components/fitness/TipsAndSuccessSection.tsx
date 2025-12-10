"use client";

import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import {
  ThumbsUp,
  Target,
  Star,
  ChevronRight,
  Flame,
  Sparkles,
} from "lucide-react";

interface TipsAndSuccessSectionProps {
  markdown: string;
}

export function TipsAndSuccessSection({ markdown }: TipsAndSuccessSectionProps) {
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
      {/* TITLE BAR */}
      <div className="flex items-center gap-3 mb-8 pb-5 border-b border-gray-200">
        <Sparkles className="w-7 h-7 text-purple-600 animate-pulse" />
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Tips & Success Boosters
        </h2>
      </div>

      {/* MARKDOWN CONTENT */}
      <div className="prose prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed">
        <ReactMarkdown
          components={{
            h2: ({ ...props }) => (
              <h2
                className="
                  text-4xl font-bold mt-8 mb-4 
                  text-indigo-700 flex items-center gap-3
                "
              >
                <Target className="w-6 h-6 text-indigo-500" />
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
                <Star className="w-5 h-5 text-yellow-500" />
                {props.children}
              </h3>
            ),

            p: ({ ...props }) => (
              <p className="mb-5 text-gray-800 text-lg">{props.children}</p>
            ),

            ul: ({ ...props }) => (
              <ul className="mb-6 space-y-3 pl-6 border-l-4 border-purple-300">
                {props.children}
              </ul>
            ),

            ol: ({ ...props }) => (
              <ol className="mb-6 space-y-3 pl-6 border-l-4 border-indigo-300">
                {props.children}
              </ol>
            ),

            li: ({ ...props }) => (
              <li className="flex items-start gap-3 text-gray-800">
                <ChevronRight className="w-4 h-4 text-purple-600 mt-1" />
                <span>{props.children}</span>
              </li>
            ),

            blockquote: ({ ...props }) => (
              <blockquote
                className="
                  bg-purple-50 border-l-8 border-purple-500 
                  px-6 py-4 italic 
                  rounded-xl shadow-sm mb-6 text-gray-800
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
