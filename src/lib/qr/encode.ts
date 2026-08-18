import { encode, type QrCodeGenerateResult } from "uqr";
import type { EccLevel } from "./types";

export type EncodedMark = QrCodeGenerateResult & {
  payload: string;
  bytes: number;
};

export function encodeMark(
  payload: string,
  ecc: EccLevel,
  quietZone: number,
): EncodedMark | null {
  if (!payload) return null;
  try {
    const result = encode(payload, {
      ecc,
      border: quietZone,
      boostEcc: false,
    });
    return {
      ...result,
      payload,
      bytes: new TextEncoder().encode(payload).length,
    };
  } catch {
    return null;
  }
}

export async function sha256Short(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `sha256:${hex.slice(0, 8)}…${hex.slice(-4)}`;
}
