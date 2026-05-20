"use client";

/**
 * Compact double-diamond indicator: 4 phases, filled when documented.
 */
export function MiniDiamond({
  phases,
  className = "",
}: {
  phases: { discover: boolean; define: boolean; develop: boolean; deliver: boolean };
  className?: string;
}) {
  const steps = [
    { key: "discover", on: phases.discover },
    { key: "define",   on: phases.define },
    { key: "develop",  on: phases.develop },
    { key: "deliver",  on: phases.deliver },
  ];

  return (
    <svg
      viewBox="0 0 200 44"
      className={className}
      role="img"
      aria-label="Avancement double diamant"
    >
      {/* Diamond 1 : Discover → Define */}
      <path
        d="M6 22 L52 6 L98 22 L52 38 Z"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth="2"
      />
      {/* Diamond 2 : Develop → Deliver */}
      <path
        d="M102 22 L148 6 L194 22 L148 38 Z"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth="2"
      />
      {/* Phase nodes */}
      {[
        { cx: 6,   on: steps[0].on },
        { cx: 98,  on: steps[1].on },
        { cx: 102, on: steps[2].on },
        { cx: 194, on: steps[3].on },
      ].map((n, i) => (
        <circle
          key={i}
          cx={n.cx}
          cy={22}
          r={6}
          fill={n.on ? "var(--brand-500)" : "var(--bg-elevated)"}
          stroke={n.on ? "var(--brand-500)" : "var(--border-strong)"}
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}
