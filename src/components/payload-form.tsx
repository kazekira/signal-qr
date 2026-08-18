import { Field, Input, Textarea } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/cn";
import { PRESETS } from "@/lib/qr/presets";
import { useEncoder } from "@/lib/qr/store";
import type { EccLevel, ModuleShape, PayloadKind, WifiAuth } from "@/lib/qr/types";

const KINDS: { id: PayloadKind; label: string }[] = [
  { id: "url", label: "URL" },
  { id: "text", label: "Text" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "vcard", label: "Card" },
  { id: "email", label: "Mail" },
  { id: "sms", label: "SMS" },
];

const ECC: { id: EccLevel; label: string; hint: string }[] = [
  { id: "L", label: "L", hint: "7%" },
  { id: "M", label: "M", hint: "15%" },
  { id: "Q", label: "Q", hint: "25%" },
  { id: "H", label: "H", hint: "30%" },
];

export function PayloadForm() {
  const kind = useEncoder((s) => s.kind);
  const fields = useEncoder((s) => s.fields);
  const preset = useEncoder((s) => s.preset);
  const ecc = useEncoder((s) => s.ecc);
  const quietZone = useEncoder((s) => s.quietZone);
  const modulePx = useEncoder((s) => s.modulePx);
  const shape = useEncoder((s) => s.shape);
  const setKind = useEncoder((s) => s.setKind);
  const setField = useEncoder((s) => s.setField);
  const patch = useEncoder((s) => s.patch);

  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="label-micro text-signal">01 — Compose</p>
        <h2 className="mt-2 text-2xl font-medium tracking-tight text-fg sm:text-3xl">
          A payload the network cannot rewrite.
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          Encode URL, text, Wi-Fi, or a contact. The mark is the contract —
          scannable, signed by contrast, no ceremony.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setKind(k.id)}
            className={cn(
              "h-8 rounded-chip px-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-150",
              kind === k.id
                ? "bg-signal text-ink"
                : "bg-raised text-muted shadow-hairline hover:text-fg",
            )}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {kind === "url" ? (
          <Field label="Endpoint">
            <Input
              value={fields.url}
              onChange={(e) => setField("url", e.target.value)}
              placeholder="https://"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
            />
          </Field>
        ) : null}

        {kind === "text" ? (
          <Field label="Plaintext">
            <Textarea
              value={fields.text}
              onChange={(e) => setField("text", e.target.value)}
              placeholder="Machine-parseable. No surprises."
            />
          </Field>
        ) : null}

        {kind === "wifi" ? (
          <>
            <Field label="Network name">
              <Input
                value={fields.wifiSsid}
                onChange={(e) => setField("wifiSsid", e.target.value)}
                placeholder="ssid"
                spellCheck={false}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Auth">
                <Select
                  value={fields.wifiAuth}
                  onValueChange={(v) => setField("wifiAuth", v as WifiAuth)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA / WPA2 / WPA3</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">Open</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Passphrase">
                <Input
                  type="password"
                  value={fields.wifiPass}
                  onChange={(e) => setField("wifiPass", e.target.value)}
                  disabled={fields.wifiAuth === "nopass"}
                  placeholder="optional on open"
                  autoComplete="off"
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={fields.wifiHidden}
                onChange={(e) => setField("wifiHidden", e.target.checked)}
                className="size-4 accent-signal"
              />
              Hidden network
            </label>
          </>
        ) : null}

        {kind === "vcard" ? (
          <>
            <Field label="Full name">
              <Input
                value={fields.cardName}
                onChange={(e) => setField("cardName", e.target.value)}
                placeholder="Ada Lovelace"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Org">
                <Input
                  value={fields.cardOrg}
                  onChange={(e) => setField("cardOrg", e.target.value)}
                />
              </Field>
              <Field label="Phone">
                <Input
                  value={fields.cardPhone}
                  onChange={(e) => setField("cardPhone", e.target.value)}
                  inputMode="tel"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email">
                <Input
                  value={fields.cardEmail}
                  onChange={(e) => setField("cardEmail", e.target.value)}
                  inputMode="email"
                />
              </Field>
              <Field label="URL">
                <Input
                  value={fields.cardUrl}
                  onChange={(e) => setField("cardUrl", e.target.value)}
                  inputMode="url"
                />
              </Field>
            </div>
          </>
        ) : null}

        {kind === "email" ? (
          <>
            <Field label="To">
              <Input
                value={fields.emailTo}
                onChange={(e) => setField("emailTo", e.target.value)}
                inputMode="email"
                placeholder="ops@radprotocol.dev"
              />
            </Field>
            <Field label="Subject">
              <Input
                value={fields.emailSubject}
                onChange={(e) => setField("emailSubject", e.target.value)}
              />
            </Field>
            <Field label="Body">
              <Textarea
                value={fields.emailBody}
                onChange={(e) => setField("emailBody", e.target.value)}
              />
            </Field>
          </>
        ) : null}

        {kind === "sms" ? (
          <>
            <Field label="Number">
              <Input
                value={fields.smsTo}
                onChange={(e) => setField("smsTo", e.target.value)}
                inputMode="tel"
                placeholder="+1…"
              />
            </Field>
            <Field label="Message">
              <Textarea
                value={fields.smsBody}
                onChange={(e) => setField("smsBody", e.target.value)}
              />
            </Field>
          </>
        ) : null}
      </div>

      <div className="h-px bg-line" />

      <div>
        <p className="label-micro">Palette</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => patch({ preset: p.id })}
              className={cn(
                "flex flex-col gap-2 rounded-panel border px-2.5 py-2.5 text-left transition-[border-color,box-shadow] duration-150",
                preset === p.id
                  ? "border-signal shadow-focus"
                  : "border-line hover:border-muted",
              )}
            >
              <span
                className={cn(
                  "h-6 w-full rounded-chip",
                  p.swatch === "paper" && "bg-paper",
                  p.swatch === "void" && "bg-void shadow-hairline",
                  p.swatch === "signal" && "bg-signal",
                  p.swatch === "cyan" && "bg-cyan",
                  p.swatch === "magenta" && "bg-magenta",
                )}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                {p.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Error correction">
          <div className="flex h-11 overflow-hidden rounded-panel border border-line">
            {ECC.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => patch({ ecc: level.id })}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center font-mono text-[11px] uppercase tracking-[0.1em]",
                  ecc === level.id ? "bg-signal text-ink" : "text-muted hover:text-fg",
                )}
              >
                {level.id}
              </button>
            ))}
          </div>
        </Field>
        <Field label={`Module · ${modulePx}px`}>
          <input
            type="range"
            min={4}
            max={16}
            step={1}
            value={modulePx}
            onChange={(e) => patch({ modulePx: Number(e.target.value) })}
            className="h-11 w-full accent-signal"
          />
        </Field>
        <Field label={`Quiet zone · ${quietZone}`}>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={quietZone}
            onChange={(e) => patch({ quietZone: Number(e.target.value) })}
            className="h-11 w-full accent-signal"
          />
        </Field>
      </div>

      <Field label="Modules">
        <div className="flex gap-1.5">
          {(["square", "soft"] as ModuleShape[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => patch({ shape: s })}
              className={cn(
                "h-8 rounded-chip px-3 font-mono text-[11px] uppercase tracking-[0.12em]",
                shape === s
                  ? "bg-raised text-fg shadow-hairline"
                  : "text-subtle hover:text-fg",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>
    </section>
  );
}
