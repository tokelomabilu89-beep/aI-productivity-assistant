import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Mail, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content: "Generate, rewrite, and polish professional workplace emails with AI.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const fn = useServerFn(generateContent);
  const [mode, setMode] = useState("generate");
  const [tone, setTone] = useState("Formal");
  const [prompt, setPrompt] = useState("");
  const [existing, setExisting] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (mode === "generate" && !prompt.trim()) {
      toast.error("Please describe the email you want to write.");
      return;
    }
    if ((mode === "rewrite" || mode === "grammar") && !existing.trim()) {
      toast.error("Please paste the email to rewrite or improve.");
      return;
    }
    setLoading(true);
    try {
      const res = await fn({ data: { tool: "email", payload: { mode, tone, prompt, existing } } });
      setOutput(res.content);
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-enter">
      <div className="mb-6 flex items-center gap-3 animate-fade-in">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Smart Email Generator</h1>
          <p className="text-sm text-muted-foreground">
            Draft, rewrite, or improve workplace emails.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base">Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Mode</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generate">Generate new</SelectItem>
                    <SelectItem value="rewrite">Rewrite existing</SelectItem>
                    <SelectItem value="grammar">Improve grammar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(mode === "rewrite" || mode === "grammar") && (
              <div className="space-y-2">
                <Label htmlFor="existing">Existing email</Label>
                <Textarea
                  id="existing"
                  value={existing}
                  onChange={(e) => setExisting(e.target.value)}
                  placeholder="Paste the email you want to improve…"
                  className="min-h-[140px]"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="prompt">
                {mode === "generate" ? "What should the email say?" : "Additional instructions (optional)"}
              </Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === "generate"
                    ? "e.g. Ask the design team for updated mockups by Friday and confirm the review meeting."
                    : "e.g. Make it shorter and more assertive."
                }
                className="min-h-[120px]"
              />
            </div>

            <Button onClick={run} disabled={loading} className="w-full">
              <Wand2 className="h-4 w-4" />
              {loading ? "Generating…" : "Generate email"}
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-base">Output</CardTitle>
          </CardHeader>
          <CardContent>
            <ToolOutput
              value={output}
              onChange={setOutput}
              loading={loading}
              onRegenerate={run}
              onClear={() => setOutput("")}
              downloadName="email.txt"
              placeholder="Your generated email will appear here — fully editable."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}