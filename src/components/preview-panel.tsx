import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { saveMark } from "@/lib/codes";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { encodeMark, sha256Short } from "@/lib/qr/encode";
import { buildPayload, isPayloadReady, payloadTitle } from "@/lib/qr/payload";
import { getPreset } from "@/lib/qr/presets";
import {
  canvasToPngBlob,
  downloadBlob,
  drawMark,
  renderSvg,
  slugFilename,
} from "@/lib/qr/render";
import { useEncoder } from "@/lib/qr/store";

export function PreviewPanel() {
  const kind = useEncoder((s) => s.kind);
  const fields = useEncoder((s) => s.fields);
  const presetId = useEncoder((s) => s.preset);
  const ecc = useEncoder((s) => s.ecc);
  const quietZone = useEncoder((s) => s.quietZone);
  const modulePx = useEncoder((s) => s.modulePx);
  const shape = useEncoder((s) => s.shape);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hash, setHash] = useState("sha256:————————");
  const [saving, setSaving] = useState(false);
  const { user, isPending } = useCurrentUserState();

  const ready = isPayloadReady(kind, fields);
  const payload = useMemo(
    () => (ready ? buildPayload(kind, fields) : ""),
    [ready, kind, fields],
  );
  const preset = getPreset(presetId);
  const encoded = useMemo(
    () => (payload ? encodeMark(payload, ecc, quietZone) : null),
    [payload, ecc, quietZone],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !encoded) return;
    drawMark(canvas, encoded, {
      fg: preset.fg,
      bg: preset.bg,
      modulePx: 12,
      shape,
    });
  }, [encoded, preset, shape]);

  useEffect(() => {
    if (!payload) {
      setHash("sha256:————————");
      return;
    }
    let cancelled = false;
    void sha256Short(payload).then((h) => {
      if (!cancelled) setHash(h);
    });
    return () => {
      cancelled = true;
    };
  }, [payload]);

  const title = payloadTitle(kind, fields);
  const filename = slugFilename(title);

  function exportCanvas() {
    if (!encoded) return null;
    const canvas = document.createElement("canvas");
    drawMark(canvas, encoded, {
      fg: preset.fg,
      bg: preset.bg,
      modulePx,
      shape,
    });
    return canvas;
  }

  async function downloadPng() {
    const canvas = exportCanvas();
    if (!canvas) return;
    const blob = await canvasToPngBlob(canvas);
    downloadBlob(blob, `${filename}.png`);
    toast.success("PNG written");
  }

  function downloadSvg() {
    if (!encoded) return;
    const svg = renderSvg(encoded, {
      fg: preset.fg,
      bg: preset.bg,
      modulePx,
      shape,
    });
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), `${filename}.svg`);
    toast.success("SVG written");
  }

  async function copyPng() {
    const canvas = exportCanvas();
    if (!canvas) return;
    const blob = await canvasToPngBlob(canvas);
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Clipboard blocked");
    }
  }

  async function persist() {
    if (!encoded || !user) return;
    setSaving(true);
    try {
      await saveMark({
        data: {
          title,
          kind,
          payload,
          preset: presetId,
          fg: preset.fg,
          bg: preset.bg,
          ecc,
          moduleSize: modulePx,
          quietZone,
          shape,
          fieldsJson: JSON.stringify(fields),
        },
      });
      toast.success("Mark saved to your vault");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      toast.error(message === "Unauthorized" ? "Sign in to save" : message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <aside className="panel panel-live flex flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label-micro">Throughput</p>
          <p className="mt-1 font-mono text-xs text-muted">{hash}</p>
        </div>
        <Pill tone="signal" led="signal">
          Live
        </Pill>
      </div>

      <div className="mt-6 flex flex-1 items-center justify-center">
        {encoded ? (
          <div
            className="w-full max-w-[380px] overflow-hidden rounded-btn shadow-hairline"
            style={{ background: preset.bg }}
          >
            <canvas ref={canvasRef} className="block h-auto w-full" />
          </div>
        ) : (
          <div className="grid aspect-square w-full max-w-72 place-items-center rounded-panel border border-dashed border-line text-center">
            <p className="px-6 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
              Awaiting payload
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-panel border border-line bg-line">
        <Stat label="Version" value={encoded ? String(encoded.version) : "—"} />
        <Stat label="Modules" value={encoded ? String(encoded.size) : "—"} />
        <Stat label="Bytes" value={encoded ? String(encoded.bytes) : "—"} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => void downloadPng()} disabled={!encoded}>
          Download PNG
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={downloadSvg} disabled={!encoded}>
          SVG
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => void copyPng()} disabled={!encoded}>
          Copy
        </Button>
        {!isPending && user ? (
          <Button type="button" size="sm" variant="ghost" onClick={() => void persist()} disabled={!encoded || saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        ) : null}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-subtle">
        A 2px signal rule marks a live card — not a colored left-border cliché.
        {user ? null : " Sign in to persist marks across devices."}
      </p>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-3 py-3">
      <p className="font-mono text-lg tabular-nums tracking-tight text-fg">{value}</p>
      <p className="label-micro mt-1">{label}</p>
    </div>
  );
}
