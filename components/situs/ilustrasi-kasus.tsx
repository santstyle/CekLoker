"use client";

/**
 * Ilustrasi editorial untuk kartu "Dari lapangan".
 *
 * Dibuat tangan (SVG) agar konsisten dengan palet situs: navy + azure + sky,
 * amber hanya untuk makna peringatan. Tanpa teks, logo, atau merek apa pun —
 * murni geometri abstrak, jadi tidak mengarang foto maupun merek pihak lain.
 */

type Props = {
  nomor: string;
  className?: string;
  "aria-label"?: string;
};

const Latar = () => (
  <>
    <defs>
      <linearGradient id="latar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <radialGradient id="cahaya" cx="0.72" cy="0.22" r="0.75">
        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="800" height="450" fill="url(#latar)" />
    <rect width="800" height="450" fill="url(#cahaya)" />
    <circle cx="96" cy="392" r="3" fill="#7dd3fc" opacity="0.5" />
    <circle cx="136" cy="412" r="2" fill="#7dd3fc" opacity="0.35" />
    <circle cx="712" cy="380" r="2.5" fill="#7dd3fc" opacity="0.4" />
    <circle cx="672" cy="408" r="2" fill="#7dd3fc" opacity="0.3" />
  </>
);

const SegelPeringatan = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <path
      d="M0 -26 L24 14 L-24 14 Z"
      fill="#d97706"
      stroke="#fbbf24"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <rect x="-3" y="-12" width="6" height="16" rx="3" fill="#0f172a" />
    <circle cx="0" cy="10" r="3" fill="#0f172a" />
  </g>
);

function Adegan01() {
  return (
    <>
      <g stroke="#3b82f6" strokeOpacity="0.35" strokeWidth="2">
        <line x1="180" y1="120" x2="320" y2="180" />
        <line x1="620" y1="110" x2="480" y2="170" />
        <line x1="170" y1="330" x2="320" y2="290" />
        <line x1="630" y1="330" x2="480" y2="290" />
      </g>
      <circle cx="180" cy="120" r="7" fill="#7dd3fc" />
      <circle cx="620" cy="110" r="7" fill="#7dd3fc" />
      <circle cx="170" cy="330" r="7" fill="#3b82f6" />
      <circle cx="630" cy="330" r="7" fill="#3b82f6" />
      <rect
        x="310"
        y="95"
        width="180"
        height="300"
        rx="22"
        fill="#1e293b"
        stroke="#3b82f6"
        strokeOpacity="0.6"
        strokeWidth="4"
      />
      <rect x="326" y="120" width="148" height="250" rx="12" fill="#0f172a" />
      <rect x="340" y="140" width="98" height="26" rx="13" fill="#2563eb" />
      <rect
        x="356"
        y="176"
        width="82"
        height="22"
        rx="11"
        fill="#38bdf8"
        opacity="0.9"
      />
      <rect x="340" y="210" width="104" height="26" rx="13" fill="#2563eb" />
      <rect
        x="352"
        y="248"
        width="90"
        height="22"
        rx="11"
        fill="#38bdf8"
        opacity="0.9"
      />
      <rect x="340" y="282" width="70" height="20" rx="10" fill="#2563eb" />
      <circle cx="400" cy="356" r="8" fill="#334155" />
      <SegelPeringatan x={540} y={120} />
    </>
  );
}

function Adegan02() {
  return (
    <>
      <rect
        x="170"
        y="220"
        width="300"
        height="120"
        rx="18"
        fill="#1e293b"
        stroke="#3b82f6"
        strokeOpacity="0.5"
        strokeWidth="4"
      />
      <rect x="470" y="252" width="90" height="88" rx="14" fill="#2563eb" />
      <circle
        cx="230"
        cy="348"
        r="22"
        fill="#0f172a"
        stroke="#7dd3fc"
        strokeWidth="5"
      />
      <circle
        cx="420"
        cy="348"
        r="22"
        fill="#0f172a"
        stroke="#7dd3fc"
        strokeWidth="5"
      />
      <rect x="205" y="150" width="150" height="100" rx="10" fill="#dbeafe" />
      <path
        d="M205 160 L280 215 L355 160"
        fill="none"
        stroke="#2563eb"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M280 196 L280 240"
        stroke="#d97706"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M258 218 L302 174"
        stroke="#d97706"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle
        cx="560"
        cy="200"
        r="52"
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="8"
      />
      <line
        x1="598"
        y1="238"
        x2="648"
        y2="288"
        stroke="#7dd3fc"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="560" cy="200" r="26" fill="#2563eb" opacity="0.25" />
      <SegelPeringatan x={620} y={110} />
    </>
  );
}

function Adegan03() {
  return (
    <>
      <rect
        x="230"
        y="110"
        width="340"
        height="220"
        rx="16"
        fill="#1e293b"
        stroke="#3b82f6"
        strokeOpacity="0.5"
        strokeWidth="4"
      />
      <rect x="246" y="126" width="308" height="188" rx="8" fill="#0f172a" />
      <rect x="190" y="336" width="420" height="16" rx="8" fill="#334155" />
      <circle cx="340" cy="196" r="30" fill="#38bdf8" />
      <path d="M292 268 a48 48 0 0 1 96 0 Z" fill="#2563eb" />
      <g stroke="#7dd3fc" strokeWidth="8" strokeLinecap="round" fill="none">
        <path d="M470 170 a26 26 0 0 1 0 44" />
        <path d="M510 170 a26 26 0 0 0 0 44" />
      </g>
      <path
        d="M490 178 L506 206"
        stroke="#d97706"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle
        cx="600"
        cy="300"
        r="44"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="7"
      />
      <line
        x1="632"
        y1="332"
        x2="676"
        y2="376"
        stroke="#38bdf8"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <SegelPeringatan x={250} y={90} />
    </>
  );
}

function Adegan04() {
  return (
    <>
      <rect
        x="290"
        y="105"
        width="170"
        height="280"
        rx="22"
        fill="#1e293b"
        stroke="#3b82f6"
        strokeOpacity="0.6"
        strokeWidth="4"
      />
      <rect x="305" y="130" width="140" height="230" rx="10" fill="#0f172a" />
      <rect x="318" y="150" width="84" height="22" rx="11" fill="#2563eb" />
      <rect
        x="332"
        y="184"
        width="70"
        height="20"
        rx="10"
        fill="#38bdf8"
        opacity="0.9"
      />
      <rect x="318" y="216" width="90" height="22" rx="11" fill="#2563eb" />
      <circle cx="375" cy="316" r="9" fill="#334155" />
      <g transform="translate(520 240)">
        <path
          d="M-70 -20 L-52 60 L52 60 L70 -20 Z"
          fill="#2563eb"
          opacity="0.9"
        />
        <path
          d="M-70 -20 L-52 60 L52 60 L70 -20"
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <line
          x1="-70"
          y1="-20"
          x2="-92"
          y2="-42"
          stroke="#7dd3fc"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <line
          x1="70"
          y1="-20"
          x2="92"
          y2="-42"
          stroke="#7dd3fc"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle
          cx="-38"
          cy="74"
          r="12"
          fill="#0f172a"
          stroke="#7dd3fc"
          strokeWidth="5"
        />
        <circle
          cx="38"
          cy="74"
          r="12"
          fill="#0f172a"
          stroke="#7dd3fc"
          strokeWidth="5"
        />
      </g>
      <circle
        cx="540"
        cy="130"
        r="20"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="6"
      />
      <circle
        cx="586"
        cy="168"
        r="14"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="5"
      />
      <circle
        cx="502"
        cy="170"
        r="12"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="5"
      />
      <SegelPeringatan x={230} y={120} />
    </>
  );
}

const ADEGAN: Record<string, () => React.ReactElement> = {
  "01": Adegan01,
  "02": Adegan02,
  "03": Adegan03,
  "04": Adegan04,
};

export function IlustrasiKasus({ nomor, className, ...rest }: Props) {
  const Adegan = ADEGAN[nomor] ?? Adegan01;
  return (
    <svg
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      {...rest}
    >
      <Latar />
      <Adegan />
    </svg>
  );
}
