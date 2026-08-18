import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_ENCODER,
  type EncoderState,
  type PayloadFields,
  type PayloadKind,
} from "./types";

type EncoderStore = EncoderState & {
  setKind: (kind: PayloadKind) => void;
  setField: <K extends keyof PayloadFields>(key: K, value: PayloadFields[K]) => void;
  patch: (partial: Partial<EncoderState>) => void;
  hydrateFrom: (state: EncoderState) => void;
  reset: () => void;
};

export const useEncoder = create<EncoderStore>()(
  persist(
    (set) => ({
      ...DEFAULT_ENCODER,
      setKind: (kind) => set({ kind }),
      setField: (key, value) =>
        set((s) => ({ fields: { ...s.fields, [key]: value } })),
      patch: (partial) => set(partial),
      hydrateFrom: (state) => set(state),
      reset: () => set(DEFAULT_ENCODER),
    }),
    { name: "signal.encoder" },
  ),
);
