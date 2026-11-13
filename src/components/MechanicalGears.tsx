import { Cog } from 'lucide-react';

interface MechanicalGearsProps {
  variant?: 'inline' | 'schematic';
  className?: string;
}

export function MechanicalGears({ variant = 'inline', className = '' }: MechanicalGearsProps) {
  if (variant === 'schematic') {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none select-none flex items-center ${className}`}
      >
        <svg
          viewBox="0 0 180 140"
          className="w-40 h-32 text-slate-700/45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Large Primary Gear */}
          <g className="origin-[68px_72px] animate-[spin_28s_linear_infinite]">
            <circle cx="68" cy="72" r="38" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="68" cy="72" r="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="68" cy="72" r="10" stroke="currentColor" strokeWidth="2.5" />
            {Array.from({ length: 12 }).map((_, idx) => {
              const angle = idx * 30;
              return (
                <rect
                  key={idx}
                  x="64"
                  y="24"
                  width="8"
                  height="11"
                  rx="1.5"
                  fill="currentColor"
                  transform={`rotate(${angle} 68 72)`}
                />
              );
            })}
          </g>

          {/* Secondary Interlocking Gear */}
          <g className="origin-[128px_46px] animate-[spin_18s_linear_infinite_reverse]">
            <circle cx="128" cy="46" r="22" stroke="#DC2626" strokeOpacity="0.65" strokeWidth="2.2" />
            <circle cx="128" cy="46" r="7" stroke="#DC2626" strokeOpacity="0.65" strokeWidth="2" />
            {Array.from({ length: 8 }).map((_, idx) => {
              const angle = idx * 45 + 22.5;
              return (
                <rect
                  key={idx}
                  x="125"
                  y="17"
                  width="6"
                  height="8"
                  rx="1"
                  fill="#DC2626"
                  fillOpacity="0.65"
                  transform={`rotate(${angle} 128 46)`}
                />
              );
            })}
          </g>

          {/* Tertiary Precision Pinion */}
          <g className="origin-[124px_102px] animate-[spin_14s_linear_infinite]">
            <circle cx="124" cy="102" r="15" stroke="#F59E0B" strokeOpacity="0.55" strokeWidth="2" />
            <circle cx="124" cy="102" r="5" stroke="#F59E0B" strokeOpacity="0.55" strokeWidth="1.8" />
            {Array.from({ length: 8 }).map((_, idx) => {
              const angle = idx * 45;
              return (
                <rect
                  key={idx}
                  x="121.5"
                  y="81"
                  width="5"
                  height="7"
                  rx="1"
                  fill="#F59E0B"
                  fillOpacity="0.55"
                  transform={`rotate(${angle} 124 102)`}
                />
              );
            })}
          </g>
        </svg>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-0.5 shrink-0 ${className}`} aria-hidden="true">
      <Cog className="w-4 h-4 text-red-700 animate-[spin_12s_linear_infinite]" />
      <Cog className="w-3.5 h-3.5 text-slate-500 -ml-1 mt-1.5 animate-[spin_9s_linear_infinite_reverse]" />
    </span>
  );
}
