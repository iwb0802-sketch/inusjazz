import { useRef, type CSSProperties } from "react";
import { Calendar } from "lucide-react";

const DOW = ["일", "월", "화", "수", "목", "금", "토"];

function formatKo(v: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return "";
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return `${m[1]}년 ${Number(m[2])}월 ${Number(m[3])}일 (${DOW[d.getDay()]})`;
}

type Props = {
  value: string;
  onChange: (v: string) => void;
  min?: string;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  /** 빈 상태 안내 문구 색 */
  placeholderColor?: string;
  textColor?: string;
  iconColor?: string;
  onEnter?: () => void;
};

/**
 * 모바일 브라우저(특히 iOS Safari)는 빈 date 입력칸에 "년/월/일"을 표시하지 않는다.
 * 실제 input은 투명하게 전체 영역을 덮어 탭 시 네이티브 달력이 열리고,
 * 보이는 라벨은 항상 직접 그린다.
 */
export default function DateField({
  value,
  onChange,
  min,
  ariaLabel = "예식 날짜",
  className = "",
  style,
  placeholderColor = "rgba(255,255,255,0.75)",
  textColor = "#fff",
  iconColor = "#5BB5A2",
  onEnter,
}: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const label = formatKo(value);

  return (
    <div
      className={`relative flex items-center gap-3 ${className}`}
      style={{ cursor: "pointer", ...style }}
    >
      <Calendar size={20} style={{ color: iconColor, flexShrink: 0 }} aria-hidden />
      <div className="flex-1 min-w-0 text-left leading-tight" aria-hidden>
        {label ? (
          <span className="block font-semibold truncate" style={{ color: textColor, fontSize: 16 }}>
            {label}
          </span>
        ) : (
          <>
            <span className="block font-semibold" style={{ color: textColor, fontSize: 16 }}>
              예식 날짜 선택
            </span>
            <span className="block mt-0.5" style={{ color: placeholderColor, fontSize: 12, opacity: 0.85 }}>
              년 / 월 / 일 · 눌러서 선택
            </span>
          </>
        )}
      </div>
      <input
        ref={ref}
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        onClick={() => {
          try {
            ref.current?.showPicker?.();
          } catch {
            /* 미지원 브라우저는 기본 동작 */
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) {
            e.preventDefault();
            onEnter();
          }
        }}
        aria-label={ariaLabel}
        className="absolute inset-0 w-full h-full opacity-0"
        style={{ cursor: "pointer", fontSize: 16 }}
      />
    </div>
  );
}
