"use client";

import { X, Loader2, RefreshCw, ImageIcon, Utensils } from "lucide-react";
import Image from "next/image";

interface GeneratedItem {
  name: string;
  imageUrl: string | null;
  isLoading: boolean;
}

interface ImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayTitle: string;
  workouts: GeneratedItem[];
  meals: GeneratedItem[];
}

export function ImageGeneratorModal({
  isOpen,
  onClose,
  dayTitle,
  workouts,
  meals,
}: ImageGeneratorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white">Visualizing {dayTitle}</h3>
            <p className="text-sm text-slate-400">AI-generated previews of your plan</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Workouts Section */}
          {workouts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 border-b border-indigo-500/20 pb-2">
                <ImageIcon className="h-5 w-5" />
                <h4 className="text-lg font-medium">Workouts</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {workouts.map((item, idx) => (
                  <ItemCard key={idx} item={item} type="workout" />
                ))}
              </div>
            </div>
          )}

          {/* Meals Section */}
          {meals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 border-b border-emerald-500/20 pb-2">
                <Utensils className="h-5 w-5" />
                <h4 className="text-lg font-medium">Meals</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {meals.map((item, idx) => (
                  <ItemCard key={idx} item={item} type="meal" />
                ))}
              </div>
            </div>
          )}

          {workouts.length === 0 && meals.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No specific items found to generate images for.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for individual cards
// inside ImageGeneratorModal.tsx — replace the existing ItemCard with this

function ItemCard({
  item,
  type,
}: {
  item: GeneratedItem;
  type: "workout" | "meal";
}) {
  const labelColor =
    type === "workout" ? "text-indigo-300" : "text-emerald-300";
  const borderColor =
    type === "workout" ? "border-indigo-700/30" : "border-emerald-700/30";

  return (
    <div className="flex flex-col gap-1.5">
      {/* IMAGE BOX */}
      <div
        className={`group relative aspect-square w-full overflow-hidden rounded-xl bg-slate-950 border ${borderColor}`}
        aria-live="polite"
      >
        {item.isLoading ? (
          // Loading state
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2 text-center">
            <Loader2
              className={`h-6 w-6 animate-spin ${
                type === "workout" ? "text-indigo-500" : "text-emerald-500"
              }`}
              aria-hidden
            />
            <span className="text-xs text-slate-400 font-medium">
              Generating...
            </span>
          </div>
        ) : item.imageUrl ? (
          // Image loaded
          <>
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Optional bottom gradient just for vibe, no text here */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-10 pointer-events-none" />
          </>
        ) : (
          // Failed / no image
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center">
            <div className="h-20 w-20 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center">
              <ImageIcon className="h-7 w-7 text-slate-600" />
            </div>
            <span className="text-xs text-slate-500">
              No image available
            </span>
          </div>
        )}
      </div>

      {/* CAPTION UNDER IMAGE (TYPE + FULL NAME) */}
      <div className="text-center px-1">
        <p
          className={`text-[10px] uppercase tracking-wide ${labelColor} mb-0.5`}
        >
          {type === "workout" ? "Workout" : "Meal"}
        </p>
        <p
          className="
            text-xs sm:text-sm font-medium text-slate-100
            leading-snug break-words
          "
        >
          {item.name}
        </p>
      </div>
    </div>
  );
}
