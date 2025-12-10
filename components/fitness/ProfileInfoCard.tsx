"use client";

import { useMemo } from "react";
import {
  User,
  Activity,
  Ruler,
  Weight,
  Trophy,
  MapPin,
  HeartPulse,
  Salad,
  Flame,
  ShieldAlert,
  Volume2,
} from "lucide-react";
import { useSpeech } from "@/components/SpeechProvider";

interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: string;
  goal: string;
  level: string;
  location: string;
  diet: string;
  medicalHistory?: string;
  stressLevel?: string;
}

interface ProfileInfoCardProps {
  userProfile: UserProfile;
}

export function ProfileInfoCard({ userProfile }: ProfileInfoCardProps) {
  const { speak, pause, resume, status, currentText, supported } = useSpeech();

  // Build a spoken summary of the profile
  const speechText = useMemo(() => {
  const speakSafe = (text: string) =>
    text
      // Newlines → pauses
      .replace(/\n+/g, ". ")

      // Remove markdown-ish characters just in case
      .replace(/[#>*`*_|\[\]\(\)]/g, " ")

      // Collapse spaces
      .replace(/\s+/g, " ")

      // Avoid multiple dots
      .replace(/\.{2,}/g, ".")

      .trim();

  const parts: string[] = [];

  parts.push(
    speakSafe(
      `fitness profile of ${userProfile.name}. Age ${userProfile.age}. Height ${userProfile.height} centimeters. Weight ${userProfile.weight} kilograms.`
    )
  );

  parts.push(
    speakSafe(
      `Goal: ${userProfile.goal}. Gender: ${userProfile.gender}.  Experience level: ${userProfile.level}. Preferred workout location: ${userProfile.location}.`
    )
  );

  parts.push(
    speakSafe(`Diet preference: ${userProfile.diet}.`)
  );

  if (userProfile.stressLevel) {
    parts.push(
      speakSafe(`Reported stress level: ${userProfile.stressLevel}.`)
    );
  }

  if (userProfile.medicalHistory) {
    parts.push(
      speakSafe(`Medical notes: ${userProfile.medicalHistory}.`)
    );
  }

  // 👇 Ensure pause between sections
  return parts.join("  ");
}, [userProfile]);


  const isThisSection = currentText === speechText;
  const isPlayingThisSection = isThisSection && status === "playing";
  const isPausedThisSection = isThisSection && status === "paused";

  const handleReadProfile = () => {
    if (!supported) return;

    if (isPlayingThisSection) {
      // currently reading this profile → pause
      pause();
      return;
    }

    if (isPausedThisSection) {
      // paused on this profile → resume
      resume();
      return;
    }

    // otherwise start reading this profile summary (cancels others)
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
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <User className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold text-slate-100 truncate">
              {userProfile.name}&apos;s Fitness Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Personalized 7-day workout &amp; nutrition plan for{" "}
              <span className="font-medium text-slate-200">
                {userProfile.goal}
              </span>{" "}
              ·{" "}
              <span className="font-medium text-slate-200">
                {userProfile.level}
              </span>{" "}
              ·{" "}
              <span className="font-medium text-slate-200">
                {userProfile.location}
              </span>
            </p>
          </div>
        </div>

        {/* Read profile button */}
        <button
          type="button"
          disabled={!supported}
          onClick={handleReadProfile}
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
          aria-label="Listen to profile summary"
          title="Read profile summary"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{buttonLabel}</span>
        </button>
      </div>

      {/* TOP GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <InfoBox
          title="Age"
          value={userProfile.age.toString()}
          accent="from-sky-500 to-indigo-500"
          Icon={Activity}
        />
        <InfoBox
          title="Height"
          value={`${userProfile.height} cm`}
          accent="from-indigo-500 to-violet-500"
          Icon={Ruler}
        />
        <InfoBox
          title="Weight"
          value={`${userProfile.weight} kg`}
          accent="from-violet-500 to-fuchsia-500"
          Icon={Weight}
        />
        <InfoBox
          title="Goal"
          value={userProfile.goal}
          accent="from-emerald-500 to-teal-500"
          Icon={Trophy}
        />
      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <DetailItem label="Gender" value={userProfile.gender} Icon={User} />
        <DetailItem label="Experience" value={userProfile.level} Icon={Flame} />
        <DetailItem
          label="Location"
          value={userProfile.location}
          Icon={MapPin}
        />
        <DetailItem label="Diet" value={userProfile.diet} Icon={Salad} />
        <DetailItem
          label="Stress Level"
          value={userProfile.stressLevel || "Normal"}
          Icon={HeartPulse}
        />

        {userProfile.medicalHistory && (
          <DetailItem
            label="Medical History"
            value={userProfile.medicalHistory}
            Icon={ShieldAlert}
            emphasize
          />
        )}
      </div>
    </div>
  );
}

/* SMALL REUSABLE COMPONENTS */

interface InfoBoxProps {
  title: string;
  value: string;
  accent: string; // gradient tailwind class
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

function InfoBox({ title, value, accent, Icon }: InfoBoxProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-3 sm:px-4 sm:py-3.5 flex flex-col gap-1.5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Icon className="w-4 h-4 text-slate-300" />
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
            {title}
          </p>
        </div>
        <div
          className={`
            h-6 w-6 rounded-xl bg-gradient-to-tr ${accent}
            opacity-80
          `}
        />
      </div>
      <p className="text-sm sm:text-base font-semibold text-slate-100">
        {value}
      </p>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  emphasize?: boolean;
}

function DetailItem({ label, value, Icon, emphasize }: DetailItemProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-3 sm:px-4 sm:py-3.5 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] sm:text-xs font-medium">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
        <span>{label}</span>
      </div>
      <p
        className={`text-xs sm:text-sm ${
          emphasize ? "text-amber-300 font-semibold" : "text-slate-100 font-medium"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
