// utils/parsePlanMarkdown.ts

export interface ParsedPlan {
  intro: string;
  days: { title: string; content: string }[];
  tipsAndSuccess: string;
}

export function parsePlanMarkdown(plan: string): ParsedPlan {
  const lines = plan.split(/\r?\n/);

  // Match lines like: "### Day 1: Full Body Strength A"
  const dayRegex = /^###\s*Day\s+(\d+)\s*:(.*)$/i;

  // Match exactly the tips section header
  const tipsRegex = /^##\s*Key Considerations\s*&\s*Tips for Your Journey\s*$/i;

  const introLines: string[] = [];
  const tipsLines: string[] = [];
  const days: { title: string; content: string }[] = [];

  type Mode = "intro" | "days" | "tips";
  let mode: Mode = "intro";

  let currentDayTitle: string | null = null;
  let currentDayContentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine; // keep formatting
    const trimmed = line.trim();

    // 1) Detect Tips section
    if (tipsRegex.test(trimmed)) {
      // flush current day if any
      if (currentDayTitle) {
        days.push({
          title: currentDayTitle,
          content: currentDayContentLines.join("\n").trim(),
        });
        currentDayTitle = null;
        currentDayContentLines = [];
      }

      mode = "tips";
      // we usually keep the header too inside tips
      tipsLines.push(line);
      continue;
    }

    // 2) Detect Day heading (only when not in tips)
    if (mode !== "tips") {
      const dayMatch = dayRegex.exec(trimmed);
      if (dayMatch) {
        // flush previous day
        if (currentDayTitle) {
          days.push({
            title: currentDayTitle,
            content: currentDayContentLines.join("\n").trim(),
          });
        }

        const dayNumber = dayMatch[1]; // "1"
        const dayTitleRest = dayMatch[2].trim(); // "Full Body Strength A" (may be empty)

        const title =
          dayTitleRest.length > 0
            ? `Day ${dayNumber}: ${dayTitleRest}`
            : `Day ${dayNumber}`;

        currentDayTitle = title;
        currentDayContentLines = [];
        mode = "days";
        continue;
      }
    }

    // 3) Route lines based on mode
    if (mode === "intro") {
      introLines.push(line);
    } else if (mode === "days") {
      if (currentDayTitle) {
        currentDayContentLines.push(line);
      } else {
        // fallback: if somehow in days mode with no title, treat as intro
        introLines.push(line);
      }
    } else if (mode === "tips") {
      tipsLines.push(line);
    }
  }

  // 4) Flush last day if any
  if (currentDayTitle) {
    days.push({
      title: currentDayTitle,
      content: currentDayContentLines.join("\n").trim(),
    });
  }

  return {
    intro: introLines.join("\n").trim(),
    days,
    tipsAndSuccess: tipsLines.join("\n").trim(),
  };
}
