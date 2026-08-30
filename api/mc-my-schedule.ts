import type { Request, Response } from "express";

const ALLOWED_ORIGIN = "https://www.inusmc.co.kr";

function setHeaders(res: Response) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
}

export default async function handler(req: Request, res: Response) {
  setHeaders(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ code: -1, message: "POST 요청만 가능합니다." });

  const mcName = typeof req.body?.mcName === "string" ? req.body.mcName.trim() : "";
  const pin = typeof req.body?.pin === "string" ? req.body.pin.replace(/\D/g, "") : "";
  if (!mcName || mcName.length > 50 || !/^\d{4}$/.test(pin)) {
    return res.status(400).json({ code: -1, message: "이름과 휴대폰 번호 뒷자리 4자리를 확인해주세요." });
  }

  try {
    const payload = new URLSearchParams({ mc_name: mcName, pin });
    const response = await fetch("http://bnsmusics.godohosting.com/bns/admin/mc_my_schedule_api.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString(),
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : 502).json(data);
  } catch {
    return res.status(502).json({ code: -1, message: "일정 서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요." });
  }
}
