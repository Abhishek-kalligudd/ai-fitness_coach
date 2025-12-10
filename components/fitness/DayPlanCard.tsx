"use client";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Sparkles, CheckCircle2, Flame, Circle } from "lucide-react";

interface DayPlanCardProps {
  title: string;
  markdown: string;
}

export function DayPlanCard({ title, markdown }: DayPlanCardProps) {
  return (
    <Card
      className="
        bg-gradient-to-br from-white via-white to-blue-50 
        rounded-3xl
        shadow-xl hover:shadow-3xl 
        transition-all duration-500 ease-out 
        p-10 
        mx-auto 
        w-full 
        max-w-4xl
        hover:-translate-y-2 
        border border-gray-100
      "
    >
      {/* Title Row */}
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
        <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h3>
      </div>

      {/* Content */}
      <div className="prose prose-lg md:prose-xl max-w-none text-gray-700">
        <ReactMarkdown
          components={{
            h1: ({ ...props }) => (
              <h1
                className="
                  text-5xl font-black mt-10 mb-5 
                  text-blue-700
                  flex items-center gap-3
                "
              >
                <Flame className="w-7 h-7 text-red-500" />
                {props.children}
              </h1>
            ),
            h2: ({ ...props }) => (
              <h2
                className="
                  text-4xl font-bold mt-8 mb-4 
                  text-purple-700 
                  flex items-center gap-2
                "
              >
                <CheckCircle2 className="w-6 h-6 text-purple-500" />
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
                <Circle className="w-4 h-4 text-gray-500" />
                {props.children}
              </h3>
            ),

            p: ({ ...props }) => (
              <p className="mb-4 leading-relaxed text-gray-800 text-lg">
                {props.children}
              </p>
            ),

            ul: ({ ...props }) => (
              <ul className="mb-6 space-y-3 pl-6 border-l-4 border-blue-300">
                {props.children}
              </ul>
            ),

            ol: ({ ...props }) => (
              <ol className="mb-6 space-y-3 pl-6 border-l-4 border-purple-300">
                {props.children}
              </ol>
            ),

            li: ({ ...props }) => (
              <li className="flex items-start gap-2 text-gray-800">
                <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full block" />
                <span>{props.children}</span>
              </li>
            ),

            strong: ({ ...props }) => (
              <strong className="font-bold text-blue-700">
                {props.children}
              </strong>
            ),

            code: ({ ...props }) => (
              <code
                className="
                  bg-gray-900 text-blue-300 
                  px-2 py-1 rounded-md 
                  text-sm font-mono
                "
              />
            ),

            blockquote: ({ ...props }) => (
              <blockquote
                className="
                  border-l-8 border-purple-400 
                  bg-purple-50 
                  px-6 py-4 
                  italic 
                  rounded-xl 
                  shadow-sm
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
