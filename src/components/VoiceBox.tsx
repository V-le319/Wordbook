"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildAssistant, type ToneChoice, type VoiceChoice } from "@/lib/buildAssistant";
import type { Word } from "@/lib/useWords";

type Status = "idle" | "connecting" | "live";
type Line = { role: "user" | "assistant"; text: string };

function Pills<T extends string>({
  options,
  value,
  onChange,
  disabled,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex rounded-full bg-background p-1">
      {options.map((o) => (
        <button
          key={o}
          disabled={disabled}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm capitalize transition-colors disabled:opacity-60",
            value === o ? "bg-button text-light-bg" : "text-muted-foreground"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

const VoiceBox = ({ word }: { word: Word }) => {
  const vapiRef = useRef<Vapi | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");
  const [voice, setVoice] = useState<VoiceChoice>("female");
  const [tone, setTone] = useState<ToneChoice>("casual");
  const [lines, setLines] = useState<Line[]>([]);
  const [partial, setPartial] = useState<Line | null>(null);

  useEffect(() => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);
    vapiRef.current = vapi;

    vapi.on("call-start", () => setStatus("live"));
    vapi.on("call-end", () => {
      setStatus("idle");
      setSpeaking(false);
      setPartial(null);
    });
    vapi.on("speech-start", () => setSpeaking(true));
    vapi.on("speech-end", () => setSpeaking(false));
    vapi.on("message", (m) => {
      const msg = m as unknown as {
        type?: string;
        role?: string;
        transcriptType?: string;
        transcript?: string;
      };
      if (typeof msg.type !== "string" || !msg.type.startsWith("transcript")) return;
      if (!msg.transcript) return;

      const line: Line = {
        role: msg.role === "user" ? "user" : "assistant",
        text: msg.transcript,
      };
      const isFinal = msg.transcriptType === "final" || msg.type.includes("final");

      if (isFinal) {
        setLines((prev) => [...prev, line]);
        setPartial(null);
      } else {
        setPartial(line);
      }
    });
    vapi.on("error", (e) => {
      console.log("Vapi error:", e);
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    });

    return () => {
      vapi.stop();
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, partial]);

  const toggle = () => {
    const vapi = vapiRef.current;
    if (!vapi || status === "connecting") return;

    if (status === "idle") {
      setError("");
      setLines([]);
      setPartial(null);
      setStatus("connecting");
      vapi
        .start(buildAssistant(word, voice, tone) as unknown as Parameters<Vapi["start"]>[0])
        .catch((e) => {
          console.log("Vapi start failed:", e);
          setError("Couldn’t start the call. Please try again.");
          setStatus("idle");
        });
    } else {
      vapi.stop();
    }
  };

  const locked = status !== "idle";
  const shown = partial ? [...lines, partial] : lines;

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center gap-4 text-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Pills options={["female", "male"] as VoiceChoice[]} value={voice} onChange={setVoice} disabled={locked} />
        <Pills options={["casual", "formal"] as ToneChoice[]} value={tone} onChange={setTone} disabled={locked} />
      </div>

      <button
        onClick={toggle}
        disabled={status === "connecting"}
        aria-label={status === "idle" ? "Start talking" : "Stop"}
        className="relative grid size-24 shrink-0 place-items-center rounded-full bg-primary text-background disabled:opacity-60"
      >
        {status === "live" && (
          <span className="absolute inset-0 animate-ping rounded-full border-2 border-primary" />
        )}
        <Mic size={34} className="relative" />
      </button>

      <p className="shrink-0 text-light-bg">
        {status === "idle" && "Tap to talk about this word"}
        {status === "connecting" && "Connecting…"}
        {status === "live" && (speaking ? "Speaking…" : "Listening…")}
      </p>

      {error && <p className="shrink-0 text-sm text-destructive">{error}</p>}

      <div className="no-scrollbar flex min-h-0 w-full flex-1 flex-col gap-2 overflow-y-auto text-left">
        {shown.map((l, k) => (
          <p
            key={k}
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
              l.role === "assistant"
                ? "self-start rounded-bl-md bg-background"
                : "self-end rounded-br-md bg-button",
              l === partial && "opacity-60"
            )}
          >
            {l.text}
          </p>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default VoiceBox;