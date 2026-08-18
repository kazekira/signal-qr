import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-panel border border-line bg-void px-3.5 text-sm text-fg placeholder:text-subtle transition-[box-shadow,border-color] duration-150 ease-out",
        "focus:border-signal focus:shadow-focus focus:outline-none disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-y rounded-panel border border-line bg-void px-3.5 py-3 text-sm text-fg placeholder:text-subtle transition-[box-shadow,border-color] duration-150 ease-out",
        "focus:border-signal focus:shadow-focus focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-micro">{label}</span>
      {children}
      {hint ? <span className="text-xs text-subtle">{hint}</span> : null}
    </label>
  );
}
