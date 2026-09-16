import { useEffect, useState, useRef } from "react";

export default function LiveCounter({ value = 0, duration = 1500, prefix = "", suffix = "", className = "" }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    startRef.current = performance.now();
    fromRef.current = display;
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(fromRef.current + (value - fromRef.current) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [value, duration]);

  return (
    <span className={className} data-testid="live-counter">
      {prefix}{display.toLocaleString("en-IN")}{suffix}
    </span>
  );
}
