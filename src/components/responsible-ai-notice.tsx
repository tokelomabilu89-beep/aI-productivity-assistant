import { AlertTriangle } from "lucide-react";

export function ResponsibleAiNotice() {
  return (
    <div className="flex gap-2 rounded-lg border border-amber-200/60 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
      <p>
        AI-generated content may contain inaccuracies — please review before use.
        Do not enter confidential or sensitive workplace information.
      </p>
    </div>
  );
}