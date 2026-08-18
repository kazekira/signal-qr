import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Tone = "signal" | "cyan" | "magenta" | "danger" | "idle" | "raised";

const tones: Record<Tone, string> = {
  signal: "bg-signal text-ink",
  cyan: "bg-cyan-dim/40 text-cyan",
  magenta: "bg-magenta-dim/35 text-magenta",
  danger: "bg-danger/15 text-danger",
  idle: "bg-raised text-muted shadow-hairline",
  raised: "bg-raised text-muted shadow-hairline",
};

const leds = {
  signal: "led",
  cyan: "led led-cyan",
  magenta: "led led-magenta",
  danger: "led led-danger",
} as const;

export function Pill({
  tone = "idle",
  led,
  children,
  className,
}: {
  tone?: Tone;
  led?: keyof typeof leds;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex h-6 items-center gap-1.5 rounded-chip px-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em]", tones[tone], className)}>
      {led ? <span className={cn(leds[led], "size-1.5 shadow-none")} /> : null}
      {children}
    </span>
  );
}
