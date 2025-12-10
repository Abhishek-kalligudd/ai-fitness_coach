// utils/extractItems.ts

export interface DayDetails {
  workouts: string[];
  meals: string[];
}

const SECTION_WORKOUT_KEYS = [
  "workout",
  "workouts",
  "exercise",
  "exercises",
  "training",
  "strength",
  "session",
];

const SECTION_MEAL_KEYS = [
  "meal",
  "meals",
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "snacks",
  "nutrition",
  "diet",
];

function normalizeLine(l: string) {
  return l
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\u2022/g, "-")
    .trim();
}

// ----------------------------
// NAME EXTRACTION
// ----------------------------
function extractNameFromLine(
  line: string,
  preferRightOfColon = false
): string | null {
  if (!line) return null;

  // strip leading bullet / numbering
  line = line.replace(/^\s*[-*\u2022]?\s*\d*\.?\s*/, "").trim();

  // ignore markdown-style headings / quotes
  if (/^[#>*]/.test(line)) return null;

  let candidate = line;

  // --- KEY CHANGE: colon handling ---
  // workouts (preferRightOfColon = false) -> LEFT of colon
  // meals   (preferRightOfColon = true)  -> RIGHT of colon
  if (candidate.includes(":")) {
    const [left, right] = candidate.split(":", 2);
    candidate = preferRightOfColon ? right || left : left;
    candidate = candidate.trim();
  }

  // common cut points: em dash, en dash, "(", ",", double spaces
  candidate = candidate
    .split(/—|–|\(|,|\s{2,}/)[0]
    // remove obvious measurement patterns (3x10, 3 sets, 15 reps, 30s, 30 sec/mins)
    .replace(
      /\b(\d+x\d+|\d+\s?sets?|\d+\s?reps?|seconds?|secs?|mins?|min|\d+s)\b/gi,
      ""
    )
    .trim();

  // strip leading/trailing punctuation
  candidate = candidate.replace(/^[\W_]+|[\W_]+$/g, "").trim();

  // avoid keeping lone conjunctions / prepositions like "of"
  if (/^(of|and|or|to)$/i.test(candidate)) return null;

  return candidate.length > 1 ? candidate : null;
}

// ----------------------------
// SECTION FINDER
// ----------------------------
function findSectionRanges(lines: string[], keys: string[]) {
  const idxs: number[] = [];

  lines.forEach((ln, i) => {
    const l = ln.toLowerCase().trim();

    if (/^#{1,6}\s+/.test(ln) && keys.some((k) => l.includes(k))) {
      idxs.push(i);
    } else if (
      keys.some(
        (k) => l === k || l.startsWith(`${k}:`) || l.startsWith(`${k} -`)
      )
    ) {
      idxs.push(i);
    }
  });

  return idxs;
}

// ----------------------------
// MAIN PARSER
// ----------------------------
export function extractItemsFromMarkdown(markdown: string): DayDetails {
  if (!markdown) return { workouts: [], meals: [] };

  const rawLines = markdown.split(/\r?\n/).map(normalizeLine);

  const workoutIdxs = findSectionRanges(rawLines, SECTION_WORKOUT_KEYS);
  const mealIdxs = findSectionRanges(rawLines, SECTION_MEAL_KEYS);

  const collect = (start: number) => {
    const out: string[] = [];
    for (let i = start + 1; i < rawLines.length; i++) {
      if (/^#{1,6}\s+/.test(rawLines[i])) break;
      if (rawLines[i]) out.push(rawLines[i]);
    }
    return out;
  };

  const gather = (idxs: number[]) => idxs.flatMap((i) => collect(i));

  const fallback = () =>
    rawLines.filter(
      (l) => /^[-*\u2022]/.test(l) || /\d+\./.test(l) || l.includes(":")
    );

  const workoutLines = workoutIdxs.length ? gather(workoutIdxs) : fallback();

  const mealLines = mealIdxs.length ? gather(mealIdxs) : fallback();

  const extractFromCandidates = (
    lines: string[],
    preferRightOfColon: boolean
  ) =>
    Array.from(
      new Set(
        lines
          .map((l) => extractNameFromLine(l, preferRightOfColon))
          .filter(Boolean) as string[]
      )
    );

  const workouts = extractFromCandidates(workoutLines, false).filter(
    (n) =>
      !/(rice|salad|tofu|paneer|oats|smoothie|granola|yogurt|pasta)/i.test(n)
  );

  const meals = extractFromCandidates(mealLines, true).filter(
    (n) => !/(squat|push[- ]?up|plank|deadlift|lunge|bench|curl|press)/i.test(n)
  );

  return { workouts, meals };
}
