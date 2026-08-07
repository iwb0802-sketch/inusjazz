import type { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  const date = req.query.date as string;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.json({ code: -1, message: "날짜를 입력해주세요." });
  }

  try {
    const apiUrl = `http://bnsmusics.godohosting.com/bns/admin/schedule_api.php?date=${encodeURIComponent(date)}`;
    const response = await fetch(apiUrl, { signal: AbortSignal.timeout(10000) });
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (e) {
    res.json({ code: -1, message: "서버 연결에 실패했습니다." });
  }
}
