import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = { runtime: "nodejs" };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const mod = await import("./_contestDb");
    res.status(200).json({ ok: true, keys: Object.keys(mod) });
  } catch (err) {
    res.status(200).json({ ok: false, error: String(err), stack: (err as Error)?.stack });
  }
}
