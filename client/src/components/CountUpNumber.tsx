import { useEffect, useRef, useState } from "react";

interface CountUpNumberProps {
  targetNumber: number;
  duration?: number;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function CountUpNumber({
  targetNumber,
  duration = 2000,
  suffix = "",
  className = "",
  style,
}: CountUpNumberProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuad = 1 - Math.pow(1 - progress, 2);
      const currentCount = Math.floor(targetNumber * easeOutQuad);

      setCount(currentCount);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isVisible, targetNumber, duration]);

  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      style={{
        animationName: isVisible ? "pulse-scale" : "none",
        animationDuration: "2s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDelay: "0.5s",
        ...style,
      }}
    >
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
