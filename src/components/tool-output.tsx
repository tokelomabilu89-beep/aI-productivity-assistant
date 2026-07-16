import { useEffect, useState } from "react";
import { Copy, Download, RefreshCw, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";

type Props = {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  onRegenerate: () => void;
  onClear: () => void;
  downloadName: string;
  placeholder?: string;
};

export function ToolOutput({
  value,
  onChange,
  loading,
  onRegenerate,
  onClear,
  downloadName,
  placeholder,
}: Props) {
  // internal buffer to keep textarea responsive on large outputs
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(local);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  const download = () => {
    const blob = new Blob([local], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      <div className="relative">
        <Textarea
          value={local}
          onChange={(e) => {
            setLocal(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={placeholder ?? "Your AI-generated output will appear here…"}
          className="min-h-[320px] resize-y font-mono text-sm leading-relaxed"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-background/70 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating…
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onRegenerate} disabled={loading || !local}>
          <RefreshCw className="h-4 w-4" /> Regenerate
        </Button>
        <Button variant="outline" size="sm" onClick={copy} disabled={!local}>
          <Copy className="h-4 w-4" /> Copy
        </Button>
        <Button variant="outline" size="sm" onClick={download} disabled={!local}>
          <Download className="h-4 w-4" /> Download
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={!local}
          className="text-muted-foreground"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
      </div>

      <ResponsibleAiNotice />
    </div>
  );
}