import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { BookOpen, Wand2 } from "lucide-react";

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

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content: "Summarize topics or pasted text with key points and insights.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(generateContent);
  const [depth, setDepth] = useState("Short");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!input.trim()) {
      toast.error("Please enter a topic or paste some text.");
      return;
    }
    setLoading(true);
    try {
      const res = await fn({ data: { tool: "research", payload: { depth, input } } });
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
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Research Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Summaries, key points, and insights.
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
              <Label>Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Short">Short summary</SelectItem>
                  <SelectItem value="Detailed">Detailed summary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="input">Topic or text</Label>
              <Textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste an article, meeting notes, or type a topic to summarize…"
                className="min-h-[240px]"
              />
            </div>

            <Button onClick={run} disabled={loading} className="w-full">
              <Wand2 className="h-4 w-4" />
              {loading ? "Summarizing…" : "Summarize"}
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ToolOutput
              value={output}
              onChange={setOutput}
              loading={loading}
              onRegenerate={run}
              onClear={() => setOutput("")}
              downloadName="summary.md"
              placeholder="Your generated summary will appear here — fully editable."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}