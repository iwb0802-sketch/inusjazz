<?php
/**
 * 사회자 스케줄 현황 API
 * GET /bns/admin/schedule_api.php?date=2026-08-10
 * 반환: JSON { date, slots: { am: [...], pm1: [...], pm2: [...] } }
 */
date_default_timezone_set("Asia/Seoul");
include(dirname(__FILE__).'/../include/DBConfig.inc.php');

// CORS 허용 (Vercel 정적 사이트에서 호출)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

$date = isset($_GET['date']) ? trim($_GET['date']) : '';

// 날짜 유효성 검사
if (!$date || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    echo json_encode(array('code' => -1, 'message' => '날짜를 입력해주세요. (예: 2026-08-10)'));
    exit;
}

$date_esc = mysql_real_escape_string($date);
$date_next = date('Y-m-d', strtotime($date . ' +1 day'));

// 해당 날짜 사회 편성 건 조회
$sql = "SELECT 
    m.mst_seq,
    m.play_time,
    m.play_space,
    d.instrument01,
    d.instrument02,
    d.instrument03,
    d.instrument04,
    d.instrument05,
    d.instrument06,
    d.instrument07,
    d.instrument08,
    d.instrument09,
    d.instrument10,
    d.instrument11,
    d.instrument12
FROM tb_bm_play_mst m
LEFT JOIN tb_bm_play_dtl d ON m.mst_seq = d.mst_seq
WHERE m.play_date >= '$date_esc 00:00:00' 
  AND m.play_date < '$date_next 00:00:00'
  AND m.play_group LIKE '%사회%'
  AND m.play_group NOT LIKE '%취소%'
  AND m.play_time NOT LIKE '%(취소)%'
ORDER BY m.play_time ASC";

$res = mysql_query($sql);

if (!$res) {
    echo json_encode(array('code' => -1, 'message' => 'DB 오류: ' . mysql_error()));
    exit;
}

// 사회자 명단 (지정 사회자 확인용)
$emcee_list = array(
    '고승범','구한림','김민수','길상우','김범태','김선혁','김성환','문학진',
    '민준호','박진영','이우영','장윤태','석재선','이도영','이도건','심비성',
    '김태우','김한솔','강동우','김민중','최윤아','임원빈'
);

// 시간 텍스트 → 숫자 변환
function parseTimeNum($t) {
    if (preg_match('/(\d+)\s*시\s*(\d+)?/', $t, $m)) {
        $h = (int)$m[1];
        $min = isset($m[2]) ? (int)$m[2] : 0;
        if ($h >= 1 && $h <= 7) $h += 12;
        return $h * 100 + $min;
    }
    return 9999;
}

// 슬롯 분류: am=1100~1359, pm1=1400~1559, pm2=1600~1900
function getSlot($t) {
    $n = parseTimeNum($t);
    if ($n >= 1100 && $n < 1400) return 'am';
    if ($n >= 1400 && $n < 1600) return 'pm1';
    if ($n >= 1600 && $n <= 1900) return 'pm2';
    return 'other';
}

$slots = array('am' => array(), 'pm1' => array(), 'pm2' => array(), 'other' => array());

while ($row = mysql_fetch_assoc($res)) {
    // instrument01~12 중 사회자 이름 찾기
    $mc_name = '';
    for ($i = 1; $i <= 12; $i++) {
        $key = 'instrument' . str_pad($i, 2, '0', STR_PAD_LEFT);
        $val = trim($row[$key]);
        if (!$val) continue;
        // "사회" 포함 항목에서 이름 추출
        if (strpos($val, '사회') !== false) {
            $name = trim(str_replace('사회', '', $val));
            if ($name) { $mc_name = $name; break; }
        }
        // 사회자 명단에 있는 이름 직접 매칭
        foreach ($emcee_list as $em) {
            if (strpos($val, $em) !== false) {
                $mc_name = $em; break 2;
            }
        }
    }

    $slot = getSlot($row['play_time']);
    $entry = array(
        'time'     => $row['play_time'],
        'place'    => $row['play_space'],
        'mc_name'  => $mc_name ? $mc_name : '미지정',
        'assigned' => $mc_name ? true : false,
    );
    $slots[$slot][] = $entry;
}

// 각 슬롯 시간순 정렬
foreach ($slots as $k => $arr) {
    usort($slots[$k], 'sortByTime');
}

function sortByTime($a, $b) {
    return parseTimeNum($a['time']) - parseTimeNum($b['time']);
}

echo json_encode(array(
    'code'  => 1,
    'date'  => $date,
    'slots' => $slots,
));
