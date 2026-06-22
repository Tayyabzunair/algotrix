type LogoProps = {
  size?: number;
  showText?: boolean;
};

export default function Logo({ size = 36, showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Brand mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="algotrixGrad" x1="0" y1="0" x2="48" y2="48">
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Rounded container */}
        <rect width="48" height="48" rx="12" fill="url(#algotrixGrad)" />

        {/* Neural-network style nodes + connections (data → model) */}
        <g stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round">
          {/* connections */}
          <line x1="14" y1="16" x2="24" y2="24" />
          <line x1="14" y1="32" x2="24" y2="24" />
          <line x1="24" y1="24" x2="34" y2="16" />
          <line x1="24" y1="24" x2="34" y2="32" />
        </g>

        {/* nodes */}
        <circle cx="14" cy="16" r="3.4" fill="#0a0a0a" />
        <circle cx="14" cy="32" r="3.4" fill="#0a0a0a" />
        <circle cx="24" cy="24" r="4" fill="#0a0a0a" />
        <circle cx="34" cy="16" r="3.4" fill="#0a0a0a" />
        <circle cx="34" cy="32" r="3.4" fill="#0a0a0a" />
      </svg>

      {showText && (
        <span
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Algotrix
        </span>
      )}
    </div>
  );
}
