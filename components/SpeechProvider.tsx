"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

type SpeechStatus = "idle" | "playing" | "paused";

interface SpeechContextValue {
  status: SpeechStatus;
  currentText: string;
  /** Start reading given text. Cancels any previous reading first. */
  speak: (text: string) => void;
  /** Pause current reading (if any). */
  pause: () => void;
  /** Resume paused reading. */
  resume: () => void;
  /** Stop any reading, reset state. */
  stop: () => void;
  /** Restart reading from the beginning of the last text. */
  restart: () => void;
  /** Whether Web Speech API is available in this browser */
  supported: boolean;
}

const SpeechContext = createContext<SpeechContextValue | undefined>(undefined);

// Helper to safely access speechSynthesis on client
function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  if (!("speechSynthesis" in window)) return null;
  return window.speechSynthesis;
}

export function SpeechProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [currentText, setCurrentText] = useState<string>("");
  const [supported, setSupported] = useState<boolean>(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const pathname = usePathname();

  // Check support once on mount
  useEffect(() => {
    setSupported(!!getSynth());
  }, []);

  const stop = useCallback(() => {
    const synth = getSynth();
    if (!synth) return;

    synth.cancel();
    utteranceRef.current = null;
    setStatus("idle");
    setCurrentText((prev) => prev); // no-op, but keeps state explicit
  }, []);

  const speak = useCallback(
    (text: string) => {
      const synth = getSynth();
      if (!synth || !text.trim()) return;

      // Cancel any existing speech before starting a new one
      synth.cancel();
      setStatus("idle");

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.onstart = () => {
        setStatus("playing");
        setCurrentText(text);
      };

      utterance.onend = () => {
        setStatus("idle");
        utteranceRef.current = null;
      };

      utterance.onerror = () => {
        setStatus("idle");
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      synth.speak(utterance);
    },
    []
  );

  const pause = useCallback(() => {
    const synth = getSynth();
    if (!synth) return;
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setStatus("paused");
    }
  }, []);

  const resume = useCallback(() => {
    const synth = getSynth();
    if (!synth) return;
    if (synth.paused) {
      synth.resume();
      setStatus("playing");
    }
  }, []);

  const restart = useCallback(() => {
    if (!currentText.trim()) return;
    speak(currentText);
  }, [currentText, speak]);

  // Stop reading when route/page changes
  useEffect(() => {
    if (!pathname) return;
    stop();
  }, [pathname, stop]);

  const value: SpeechContextValue = {
    status,
    currentText,
    speak,
    pause,
    resume,
    stop,
    restart,
    supported,
  };

  return (
    <SpeechContext.Provider value={value}>
      {children}
    </SpeechContext.Provider>
  );
}

// Hook to use in any component
export function useSpeech() {
  const ctx = useContext(SpeechContext);
  if (!ctx) {
    throw new Error("useSpeech must be used within a SpeechProvider");
  }
  return ctx;
}
