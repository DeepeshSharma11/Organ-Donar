import { useEffect, useState } from "react";

const CITIES = [
  { name: "Delhi", x: 270, y: 130 },
  { name: "Mumbai", x: 175, y: 305 },
  { name: "Bengaluru", x: 245, y: 415 },
  { name: "Chennai", x: 295, y: 440 },
  { name: "Kolkata", x: 410, y: 245 },
  { name: "Hyderabad", x: 270, y: 360 },
  { name: "Ahmedabad", x: 165, y: 240 },
];

export default function GreenCorridor() {
  const [route, setRoute] = useState({ from: 0, to: 3 });

  useEffect(() => {
    const id = setInterval(() => {
      setRoute(() => {
        let a = Math.floor(Math.random() * CITIES.length);
        let b = Math.floor(Math.random() * CITIES.length);
        while (b === a) b = Math.floor(Math.random() * CITIES.length);
        return { from: a, to: b };
      });
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const A = CITIES[route.from];
  const B = CITIES[route.to];
  const cx = (A.x + B.x) / 2;
  const cy = Math.min(A.y, B.y) - 50;
  const path = `M${A.x},${A.y} Q${cx},${cy} ${B.x},${B.y}`;

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 540 540" className="w-full h-auto" aria-hidden>
        {/* Stylized India outline (simplified shape) */}
        <path
          d="M210 60 C 270 50, 340 70, 380 110 C 430 150, 460 200, 470 260
             C 480 320, 460 360, 420 410 C 380 460, 330 490, 290 495
             C 250 505, 220 480, 195 430 C 165 380, 130 340, 110 290
             C 95 240, 110 180, 145 130 C 165 95, 185 70, 210 60 Z"
          fill="#EDF0EB"
          stroke="#D3D9D5"
          strokeWidth="1.5"
        />
        {/* Cities */}
        {CITIES.map((c, i) => (
          <g key={c.name}>
            <circle cx={c.x} cy={c.y} r="4" fill="#2A5A4A" />
            {(i === route.from || i === route.to) && (
              <circle
                cx={c.x}
                cy={c.y}
                r="7"
                fill="none"
                stroke={i === route.to ? "#E06D53" : "#2D7A5A"}
                strokeWidth="2"
                className="pulse-dot"
                style={{ transformOrigin: `${c.x}px ${c.y}px` }}
              />
            )}
            <text x={c.x + 8} y={c.y + 4} className="text-[10px]" fill="#4A5D54" fontSize="10">
              {c.name}
            </text>
          </g>
        ))}
        {/* Animated corridor */}
        <path
          d={path}
          fill="none"
          stroke="#2D7A5A"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="corridor-path"
        />
        <path
          d={path}
          fill="none"
          stroke="#2D7A5A"
          strokeOpacity="0.18"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute top-4 left-4 bg-white/85 backdrop-blur-md rounded-full px-3 py-1.5 text-xs flex items-center gap-2 border border-[#D3D9D5]">
        <span className="w-2 h-2 rounded-full bg-[#2D7A5A] pulse-dot" />
        <span className="font-medium text-[#1C2220]">Live</span>
        <span className="text-[#4A5D54]">Green Corridor · {A.name} → {B.name}</span>
      </div>
    </div>
  );
}
