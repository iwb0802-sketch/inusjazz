import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = { runtime: "nodejs" };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const pg = await import("pg");
    res.status(200).json({ ok: true, hasPool: typeof pg.Pool, hasDefault: !!pg.default });
  } catch (err) {
    res.status(200).json({ ok: false, error: String(err), stack: (err as Error)?.stack });
  }
}
