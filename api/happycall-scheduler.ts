import type { Request, Response } from "express";

const SCHEDULER_URL = "http://bnsmusics.godohosting.com/bns/admin/happycall_scheduler.php";

function parseCount(body: string, label: string) {
  const match = body.match(new RegExp(`${label}\\s*:\\s*(\\d+)건`));
  return match ? Number(match[1]) : null;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, message: "GET 요청만 가능합니다." });
  }

  const cronSecret = process.env.CRON_SECRET;
  const authorization = req.headers.authorization;
  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const schedulerSecret = process.env.HAPPYCALL_SCHEDULER_SECRET;
  if (!schedulerSecret) {
    return res.status(500).json({ ok: false, message: "Scheduler configuration is missing." });
  }

  try {
    const target = new URL(SCHEDULER_URL);
    target.searchParams.set("secret", schedulerSecret);

    const upstream = await fetch(target.toString(), {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(45000),
    });
    const body = await upstream.text();

    if (!upstream.ok || !body.includes("스케줄러 완료")) {
      return res.status(502).json({ ok: false, message: "운영 해피콜 스케줄러 실행에 실패했습니다." });
    }

    return res.status(200).json({
      ok: true,
      reminderCount: parseCount(body, "독촉 발송"),
      adminAlertCount: parseCount(body, "관리자 알림"),
    });
  } catch {
    return res.status(502).json({ ok: false, message: "운영 해피콜 스케줄러 연결에 실패했습니다." });
  }
}
