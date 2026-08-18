import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

const MarkInput = z.object({
  title: z.string().min(1).max(160),
  kind: z.string().min(1).max(20),
  payload: z.string().min(1).max(4096),
  preset: z.string().min(1).max(20),
  fg: z.string().min(4).max(16),
  bg: z.string().min(4).max(16),
  ecc: z.string().min(1).max(2),
  moduleSize: z.number().int().min(2).max(24),
  quietZone: z.number().int().min(0).max(8),
  shape: z.string().min(1).max(16),
  fieldsJson: z.string().max(8000),
});

export type SavedMark = {
  id: string;
  title: string;
  kind: string;
  payload: string;
  preset: string;
  fg: string;
  bg: string;
  ecc: string;
  moduleSize: number;
  quietZone: number;
  shape: string;
  fieldsJson: string;
  createdAt: string;
};

export const listMarks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      title: string;
      kind: string;
      payload: string;
      preset: string;
      fg: string;
      bg: string;
      ecc: string;
      module_size: number;
      quiet_zone: number;
      shape: string;
      fields_json: string;
      created_at: string;
    }>`
      select id, title, kind, payload, preset, fg, bg, ecc,
             module_size, quiet_zone, shape, fields_json, created_at
      from marks
      where user_id = ${context.userId}
      order by created_at desc
      limit 80
    `;
    return rows.map(
      (r): SavedMark => ({
        id: r.id,
        title: r.title,
        kind: r.kind,
        payload: r.payload,
        preset: r.preset,
        fg: r.fg,
        bg: r.bg,
        ecc: r.ecc,
        moduleSize: Number(r.module_size),
        quietZone: Number(r.quiet_zone),
        shape: r.shape,
        fieldsJson: r.fields_json,
        createdAt: r.created_at,
      }),
    );
  });

export const saveMark = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => MarkInput.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql`
      insert into marks (
        id, user_id, title, kind, payload, preset, fg, bg, ecc,
        module_size, quiet_zone, shape, fields_json
      ) values (
        ${id}, ${context.userId}, ${data.title}, ${data.kind}, ${data.payload},
        ${data.preset}, ${data.fg}, ${data.bg}, ${data.ecc},
        ${data.moduleSize}, ${data.quietZone}, ${data.shape}, ${data.fieldsJson}
      )
    `;
    return { id };
  });

export const deleteMark = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: unknown) => z.string().uuid().parse(id))
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`delete from marks where id = ${id} and user_id = ${context.userId}`;
    return { ok: true };
  });
