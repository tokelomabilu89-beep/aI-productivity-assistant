import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  tool: z.enum(["email", "planner", "research"]),
  payload: z.record(z.any()),
});

function buildPrompt(tool: string, p: Record<string, any>): { system: string; user: string } {
  if (tool === "email") {
    const mode = p.mode || "generate";
    const tone = p.tone || "Formal";
    if (mode === "rewrite") {
      return {
        system: `You are an expert workplace email writer. Rewrite the user's email to be clearer, well-structured, and in a ${tone} tone. Fix grammar and improve clarity. Return the result in this exact format:\n\nSubject: <subject line>\n\n<email body>`,
        user: `Rewrite this email:\n\n${p.existing || ""}\n\nAdditional instructions: ${p.prompt || "None"}`,
      };
    }
    if (mode === "grammar") {
      return {
        system: `You are a professional editor. Improve grammar, clarity, and flow of the email without changing meaning. Keep tone ${tone}. Return:\n\nSubject: <subject>\n\n<body>`,
        user: `Improve this email:\n\n${p.existing || ""}`,
      };
    }
    return {
      system: `You are an expert workplace email writer. Compose a professional email in a ${tone} tone based on the user's request. Return in this format:\n\nSubject: <subject line>\n\n<email body>`,
      user: p.prompt || "",
    };
  }
  if (tool === "planner") {
    const range = p.range || "Daily";
    return {
      system: `You are an expert productivity coach. Create a ${range.toLowerCase()} schedule from the user's tasks. Prioritize by urgency and importance (Eisenhower matrix). Output well-formatted Markdown with time blocks, priorities (High/Medium/Low), and short focus notes. Include short breaks. Keep it realistic.`,
      user: `Tasks:\n${p.tasks || ""}\n\nNotes / context:\n${p.notes || "None"}`,
    };
  }
  // research
  const depth = p.depth || "Short";
  return {
    system: `You are an AI research assistant. Produce a ${depth.toLowerCase()} summary of the provided topic or text. Structure as Markdown with sections: **Summary**, **Key Points** (bulleted), **Insights & Recommendations**. Be accurate and neutral.`,
    user: p.input || "",
  };
}

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const { system, user } = buildPrompt(data.tool, data.payload);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (res.status === 429) {
      throw new Error("Rate limit reached. Please try again in a moment.");
    }
    if (res.status === 402) {
      throw new Error("AI credits exhausted. Please add credits to continue.");
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as any;
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    return { content };
  });