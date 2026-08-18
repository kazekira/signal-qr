import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { deleteMark, listMarks, type SavedMark } from "@/lib/codes";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { encodeMark } from "@/lib/qr/encode";
import { renderSvg } from "@/lib/qr/render";
import { useEncoder } from "@/lib/qr/store";
import { DEFAULT_FIELDS, type EncoderState, type PayloadFields } from "@/lib/qr/types";

export const Route = createFileRoute("/history")({ component: HistoryPage });

function HistoryPage() {
  const { user, isPending } = useCurrentUserState();
  const [marks, setMarks] = useState<SavedMark[] | null>(null);
  const hydrateFrom = useEncoder((s) => s.hydrateFrom);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void listMarks()
      .then((rows) => {
        if (!cancelled) setMarks(rows);
      })
      .catch(() => {
        if (!cancelled) setMarks([]);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (isPending) {
    return (
      <Shell>
        <div className="h-40 animate-pulse rounded-panel bg-surface" />
      </Shell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  async function remove(id: string) {
    try {
      await deleteMark({ data: id });
      setMarks((prev) => (prev ?? []).filter((m) => m.id !== id));
      toast.success("Revoked");
    } catch {
      toast.error("Could not revoke");
    }
  }

  function restore(mark: SavedMark) {
    let fields: PayloadFields = DEFAULT_FIELDS;
    try {
      fields = { ...DEFAULT_FIELDS, ...(JSON.parse(mark.fieldsJson) as PayloadFields) };
    } catch {
      /* keep defaults */
    }
    const next: EncoderState = {
      kind: mark.kind as EncoderState["kind"],
      fields,
      preset: mark.preset as EncoderState["preset"],
      ecc: mark.ecc as EncoderState["ecc"],
      quietZone: mark.quietZone,
      modulePx: mark.moduleSize,
      shape: mark.shape as EncoderState["shape"],
    };
    hydrateFrom(next);
    toast.success("Loaded into encoder");
  }

  return (
    <Shell>
      <div className="mb-8">
        <p className="label-micro text-signal">02 — Vault</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight text-fg">
          Marks you stand behind.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Signed-in history. Scoped to your key. Revoke any encode.
        </p>
      </div>

      {marks === null ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-panel bg-surface" />
          ))}
        </div>
      ) : marks.length === 0 ? (
        <div className="panel flex flex-col items-start gap-4 p-8">
          <p className="text-sm text-muted">No saved marks. Encode something, then save it.</p>
          <Button asChild>
            <Link to="/">Open encoder</Link>
          </Button>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {marks.map((mark) => (
            <li key={mark.id} className="panel flex gap-4 p-4">
              <Thumb mark={mark} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium text-fg">{mark.title}</p>
                  <Pill tone="raised">{mark.kind}</Pill>
                </div>
                <p className="mt-1 font-mono text-[11px] text-subtle">
                  {new Date(mark.createdAt).toLocaleString()} · ecc {mark.ecc}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button asChild size="sm" variant="secondary">
                    <Link to="/" onClick={() => restore(mark)}>
                      Open
                    </Link>
                  </Button>
                  <Button type="button" size="sm" variant="danger" onClick={() => void remove(mark.id)}>
                    Revoke
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}

function Thumb({ mark }: { mark: SavedMark }) {
  const encoded = encodeMark(mark.payload, mark.ecc as "L" | "M" | "Q" | "H", 1);
  if (!encoded) {
    return <div className="size-20 shrink-0 rounded-btn bg-raised" />;
  }
  const svg = renderSvg(encoded, {
    fg: mark.fg,
    bg: mark.bg,
    modulePx: 3,
    shape: mark.shape === "soft" ? "soft" : "square",
  });
  return (
    <div
      className="size-20 shrink-0 overflow-hidden rounded-btn"
      style={{ background: mark.bg }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
