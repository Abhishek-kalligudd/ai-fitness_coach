import { Suspense } from "react";
import ResultsPage from "./ResultsPageClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsPage />
    </Suspense>
  );
}
