import { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  const date = req.query.date as string;
  const excludeMc = req.query.exclude_mc === "1";
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.json({ code: -1, message: "날짜를 입력해주세요." });
  }

  try {
    const apiUrl = `http://bnsmusics.godohosting.com/bns/admin/performance_schedule_api.php?date=${encodeURIComponent(date)}${excludeMc ? "&exclude_mc=1" : ""}`;
    const response = await fetch(apiUrl, { signal: AbortSignal.timeout(10000) });
    const data = await response.json();
    // 고도호스팅 API 수정본이 반영되기 전에도 전용 탭은 사회 표기가 있는 편성을 숨긴다.
    // 수정본 API에서는 악기 구성 전체를 기준으로 한 번 더 제외한다.
    if (excludeMc && Array.isArray(data.days)) {
      data.days = data.days.map((day: any) => ({
        ...day,
        events: Array.isArray(day.events) ? day.events.filter((event: any) => !/사회(?:자|\s*지정)?/u.test(String(event?.arrangement || ""))) : [],
      }));
      data.exclude_mc = "Y";
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (e) {
    res.json({ code: -1, message: "서버 연결에 실패했습니다." });
  }
}
