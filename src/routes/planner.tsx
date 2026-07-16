import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CalendarClock, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolOutput } from "@/components/tool-output";
import { generateContent } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content: "Turn your task list into a prioritized daily or weekly schedule.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const fn = useServerFn(generateContent);
  const [range, setRange] = useState("Daily");
  const [tasks, setTasks] = useState("");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!tasks.trim()) {
      toast.error("Please list at least one task.");
      return;
    }
    setLoading(true);
    try {
      const res = await fn({ data: { tool: "planner", payload: { range, tasks, notes } } });
      setOutput(res.content);
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3 animate-fade-in">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <CalendarClock className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Task Planner</h1>
          <p className="text-sm text-muted-foreground">
            Prioritized schedules generated from your tasks.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base">Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Range</Label>
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tasks">Tasks</Label>
              <Textarea
                id="tasks"
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder={"One per line, include deadlines or estimates when useful:\n- Finish Q3 report (due tomorrow, ~2h)\n- Review team PRs (~1h)\n- Prep for 3pm client call"}
                className="min-h-[180px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes / constraints (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Deep-work in the morning, meetings after 2pm, gym at 6."
                className="min-h-[80px]"
              />
            </div>

            <Button onClick={run} disabled={loading} className="w-full">
              <Wand2 className="h-4 w-4" />
              {loading ? "Generating…" : "Generate schedule"}
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base">Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ToolOutput
              value={output}
              onChange={setOutput}
              loading={loading}
              onRegenerate={run}
              onClear={() => setOutput("")}
              downloadName="schedule.md"
              placeholder="Your generated schedule will appear here — fully editable."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}