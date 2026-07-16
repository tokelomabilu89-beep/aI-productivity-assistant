import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle, Mail, CalendarClock, BookOpen, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — Workplace AI" },
      { name: "description", content: "How to use the Workplace AI productivity suite." },
    ],
  }),
  component: HelpPage,
});

const guides = [
  {
    icon: Mail,
    title: "Smart Email Generator",
    body: "Pick a mode (Generate, Rewrite, or Improve grammar), choose a tone, and describe what you need. Edit the output directly before copying or downloading.",
  },
  {
    icon: CalendarClock,
    title: "AI Task Planner",
    body: "Paste your tasks (one per line, add deadlines/estimates when useful) and any constraints. Choose Daily or Weekly. The AI returns a prioritized time-blocked schedule you can edit.",
  },
  {
    icon: BookOpen,
    title: "AI Research Assistant",
    body: "Paste an article, meeting notes, or enter a topic. Choose Short or Detailed. You'll get a summary, key points, and insights.",
  },
];

function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3 animate-fade-in">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Help & Guidelines</h1>
          <p className="text-sm text-muted-foreground">
            How to use each tool and responsible-use notes.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((g) => (
          <Card key={g.title} className="animate-fade-in">
            <CardHeader>
              <div className="mb-2 grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <g.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">{g.title}</CardTitle>
              <CardDescription>{g.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="mt-6 animate-fade-in border-amber-200/60 bg-amber-50/40 dark:border-amber-500/20 dark:bg-amber-500/5">
        <CardHeader>
          <div className="mb-2 grid h-9 w-9 place-items-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <CardTitle className="text-base">Responsible AI</CardTitle>
          <CardDescription>
            AI-generated content may contain inaccuracies — always review before use. Do not enter
            confidential, proprietary, or personally identifiable workplace information. This app does
            not store your data: nothing is saved after you close the tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsibleAiNotice />
        </CardContent>
      </Card>
    </div>
  );
}