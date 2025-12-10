// // components/AppNavbar.tsx
// "use client";

// import Link from "next/link";
// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Dumbbell } from "lucide-react";
// import { useTheme } from "./ThemeProvider";

// export interface AppNavbarProps {
//   signInHref?: string;
//   signUpHref?: string;
//   hideAuth?: boolean;
// }

// export default function AppNavbar({
//   signInHref = "/signin",
//   signUpHref = "/signup",
//   hideAuth = false,
// }: AppNavbarProps) {
//   const { theme, toggleTheme } = useTheme();

//   return (
//     <header className="w-full border-b border-slate-800/60 backdrop-blur sticky top-0 z-30 bg-slate-950/70">
//       <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//         {/* Left: Logo */}
//         <Link href="/" className="flex items-center gap-2">
//           <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
//             <Dumbbell className="h-5 w-5 text-white" />
//           </div>

//           <div className="flex flex-col leading-tight">
//             <span className="font-semibold text-base sm:text-lg text-slate-100">
//               FlexAI Coach
//             </span>
//             <span className="text-[11px] sm:text-xs text-slate-400">
//               Your personal AI fitness mentor
//             </span>
//           </div>
//         </Link>

//         {/* Right: Theme toggle + auth buttons */}
//         <div className="flex items-center gap-3">
//           <button
//             type="button"
//             onClick={toggleTheme}
//             className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-slate-700 bg-slate-900/60 hover:bg-slate-800 transition"
//             aria-label="Toggle theme"
//             title="Toggle theme"
//           >
//             {theme === "dark" ? <span className="select-none">🌙</span> : <span className="select-none">☀️</span>}
//           </button>

//           {!hideAuth && (
//             <>
//               <Button
//                 variant="ghost"
//                 asChild
//                 className="hidden sm:inline-flex text-slate-200 hover:text-white hover:bg-slate-800/60"
//               >
//                 <Link href={signInHref}>Sign in</Link>
//               </Button>

//               <Button className="bg-indigo-500 hover:bg-indigo-600 text-sm sm:text-base shadow-lg shadow-indigo-500/40">
//                 <Link href={signUpHref}>Sign up</Link>
//               </Button>
//             </>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// }
"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Dumbbell, LogOut } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface AppNavbarProps {
  signInHref?: string;
  signUpHref?: string;
  hideAuth?: boolean;
}

export default function AppNavbar({
  signInHref = "/signin",
  signUpHref = "/signup",
  hideAuth = false,
}: AppNavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/signin";
  };

  const userInitial =
    user?.email?.charAt(0)?.toUpperCase() ?? "";

  return (
    <header className="w-full border-b border-slate-800/60 backdrop-blur sticky top-0 z-30 bg-slate-950/70">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-base sm:text-lg text-slate-100">
              FlexAI Coach
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400">
              Your personal AI fitness mentor
            </span>
          </div>
        </Link>

        {/* Right: Theme toggle + auth area */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-slate-700 bg-slate-900/60 hover:bg-slate-800 transition"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <span className="select-none">🌙</span>
            ) : (
              <span className="select-none">☀️</span>
            )}
          </button>

          {/* Auth area */}
          {!hideAuth && !loading && (
            <>
              {!user ? (
                // Not logged in → show Sign in / Sign up
                <>
                  <Button
                    variant="ghost"
                    asChild
                    className="hidden sm:inline-flex text-slate-200 hover:text-white hover:bg-slate-800/60"
                  >
                    <Link href={signInHref}>Sign in</Link>
                  </Button>

                  <Button className="bg-indigo-500 hover:bg-indigo-600 text-sm sm:text-base shadow-lg shadow-indigo-500/40">
                    <Link href={signUpHref}>Sign up</Link>
                  </Button>
                </>
              ) : (
                // Logged in → avatar + dropdown
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold shadow-lg shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950"
                      title={user.email}
                    >
                      {userInitial}
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="min-w-[160px] bg-slate-900 border border-slate-700"
                  >
                    <div className="px-3 py-2 text-xs text-slate-400">
                      {user.email}
                    </div>
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-red-400 focus:text-red-300 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut size={14} />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
