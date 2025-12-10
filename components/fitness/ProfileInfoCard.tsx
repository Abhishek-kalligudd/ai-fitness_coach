"use client";

import { Card } from "@/components/ui/card";
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
} from "lucide-react";

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
  return (
    <Card
      className="
        bg-white rounded-3xl shadow-xl 
        hover:shadow-3xl 
        transition-all duration-500 
        hover:-translate-y-1 
        overflow-hidden
      "
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 flex items-center gap-4">
        <div className="bg-white/20 p-4 rounded-full">
          <User className="w-10 h-10 text-white" />
        </div>

        <div>
          <h1 className="text-4xl font-extrabold tracking-wide">
            {userProfile.name}&apos;s Fitness Plan
          </h1>
          <p className="text-blue-100 text-lg">
            Personalized 7-day workout & nutrition strategy
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-8 space-y-10">

        {/* TOP GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <InfoBox
            title="Age"
            value={userProfile.age}
            color="blue"
            Icon={Activity}
          />

          <InfoBox
            title="Height"
            value={`${userProfile.height} cm`}
            color="indigo"
            Icon={Ruler}
          />

          <InfoBox
            title="Weight"
            value={`${userProfile.weight} kg`}
            color="purple"
            Icon={Weight}
          />

          <InfoBox
            title="Goal"
            value={userProfile.goal}
            color="pink"
            Icon={Trophy}
          />
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

          <DetailItem label="Gender" value={userProfile.gender} Icon={User} />
          <DetailItem label="Experience" value={userProfile.level} Icon={Flame} />
          <DetailItem label="Location" value={userProfile.location} Icon={MapPin} />
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
            />
          )}
        </div>
      </div>
    </Card>
  );
}

/* SMALL REUSABLE COMPONENTS */

function InfoBox({ title, value, color, Icon }: any) {
  const colorMap: any = {
    blue: "border-blue-500 bg-blue-50 text-blue-700",
    indigo: "border-indigo-500 bg-indigo-50 text-indigo-700",
    purple: "border-purple-500 bg-purple-50 text-purple-700",
    pink: "border-pink-500 bg-pink-50 text-pink-700",
  };

  return (
    <div
      className={`
        p-4 rounded-xl border-l-8 
        ${colorMap[color]} 
        shadow-sm hover:shadow-md 
        transition-all duration-300
      `}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-5 h-5" />
        <p className="text-sm opacity-70">{title}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function DetailItem({ label, value, Icon }: any) {
  return (
    <div className="bg-gray-50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
        <Icon className="w-5 h-5 text-gray-500" />
        <span>{label}</span>
      </div>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  );
}
