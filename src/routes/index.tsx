import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Mail, CalendarClock, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";

export const Route = createFileRoute("/")({
  component: Index,
});

const features = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft, rewrite, or polish professional emails in Formal, Friendly, or Persuasive tones.",
  },
  {
    to: "/planner" as const,
    icon: CalendarClock,
    title: "AI Task Planner",
    desc: "Turn your to-do list into a prioritized daily or weekly schedule.",
  },
  {
    to: "/research" as const,
    icon: BookOpen,
    title: "AI Research Assistant",
    desc: "Summarize topics or pasted text with key points and actionable insights.",
  },
];

function Index() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" /> Session-only · No data stored
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Work smarter with your AI productivity suite
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Three focused tools to help you communicate, plan, and learn faster. Pick a tool to get started.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link key={f.to} to={f.to} className="group">
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
              <CardHeader>
                <div className="mb-2 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ResponsibleAiNotice />
      </div>
    </div>
  );
}
