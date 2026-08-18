import type { PresetId } from "./types";

export type ColorPreset = {
  id: PresetId;
  label: string;
  hint: string;
  fg: string;
  bg: string;
  swatch: "paper" | "void" | "signal" | "cyan" | "magenta";
};

export const PRESETS: readonly ColorPreset[] = [
  {
    id: "invert",
    label: "Print",
    hint: "Black on paper. Highest scan reliability.",
    fg: "#08090A",
    bg: "#FFFFFF",
    swatch: "paper",
  },
  {
    id: "void",
    label: "Void",
    hint: "White on void. Dark-mode mark.",
    fg: "#F2F2F3",
    bg: "#08090A",
    swatch: "void",
  },
  {
    id: "signal",
    label: "Signal",
    hint: "Ink on yellow. Live / primary.",
    fg: "#08090A",
    bg: "#FDF404",
    swatch: "signal",
  },
  {
    id: "cyan",
    label: "Verify",
    hint: "Ink on cyan. Success / verified.",
    fg: "#08090A",
    bg: "#02FFFF",
    swatch: "cyan",
  },
  {
    id: "magenta",
    label: "Route",
    hint: "Ink on magenta. Attention.",
    fg: "#08090A",
    bg: "#FF00D5",
    swatch: "magenta",
  },
] as const;

export function getPreset(id: PresetId): ColorPreset {
  return PRESETS.find((p) => p.id === id) ?? PRESETS[0];
}
