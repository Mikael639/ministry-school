import React from "react";

export function LogoMark({
  size = 48,
  className = "",
  variant = "monochrome", // "monochrome" (black on light) | "white" (white on dark)
}: {
  size?: number;
  className?: string;
  variant?: "monochrome" | "white";
}) {
  const isWhite = variant === "white";
  const fgColor = isWhite ? "#FFFFFF" : "#111827";
  const bgColor = isWhite ? "#0B1526" : "#FFFFFF";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Ministry School Logo"
    >
      {/* 
        NOUVELLE ICÔNE : LIVRE OUVERT + FLAMME + CROIX INTÉGRÉE
      */}
      <g fill={fgColor}>
        {/* --- FLAMME SUPÉRIEURE AVEC CROIX INTÉGRÉE --- */}
        
        {/* Flamme principale gauche & centrale */}
        <path
          d="M 250 45 C 255 75, 275 110, 270 145 C 265 180, 235 200, 215 225 C 190 255, 185 295, 205 330 C 190 310, 180 275, 188 245 C 196 215, 225 185, 235 155 C 245 125, 240 85, 250 45 Z"
        />

        {/* Flamme langue droite */}
        <path
          d="M 290 115 C 310 145, 325 185, 315 225 C 310 245, 298 265, 285 280 C 295 260, 298 235, 292 210 C 285 180, 268 155, 262 130 C 275 122, 285 118, 290 115 Z"
        />

        {/* Flamme langue externe droite */}
        <path
          d="M 330 195 C 340 220, 342 248, 332 272 C 322 295, 302 315, 280 328 C 300 312, 316 290, 320 265 C 324 240, 315 218, 308 202 C 316 198, 324 196, 330 195 Z"
        />

        {/* Corps central de la flamme entourant la croix */}
        <path
          d="M 250 145 C 280 185, 295 235, 285 285 C 280 310, 268 335, 250 355 C 232 335, 220 310, 215 285 C 205 235, 220 185, 250 145 Z"
        />

        {/* CROIX DÉCOUPÉE DANS LA FLAMME (Contour / Découpe) */}
        {/* Barre verticale de la croix */}
        <rect
          x="243"
          y="180"
          width="14"
          height="145"
          rx="2"
          fill={bgColor}
        />
        {/* Barre horizontale de la croix */}
        <rect
          x="215"
          y="215"
          width="70"
          height="14"
          rx="2"
          fill={bgColor}
        />

        {/* --- LIVRE OUVERT INFÉRIEUR --- */}

        {/* Page Gauche Supérieure */}
        <path
          d="M 240 370 C 190 335, 125 340, 60 380 C 110 395, 175 390, 235 415 L 240 370 Z"
        />

        {/* Cadre aile gauche */}
        <path
          d="M 50 380 L 120 265 C 160 280, 205 315, 235 360 L 225 365 C 198 325, 158 295, 120 282 L 62 385 Z"
        />

        {/* Page Gauche Inférieure / Épaisseur */}
        <path
          d="M 75 405 C 130 395, 185 405, 240 430 L 238 440 C 180 415, 125 410, 70 420 Z"
        />

        {/* Page Droite Supérieure */}
        <path
          d="M 260 370 C 310 335, 375 340, 440 380 C 390 395, 325 390, 265 415 L 260 370 Z"
        />

        {/* Cadre aile droite */}
        <path
          d="M 450 380 L 380 265 C 340 280, 295 315, 265 360 L 275 365 C 302 325, 342 295, 380 282 L 438 385 Z"
        />

        {/* Page Droite Inférieure / Épaisseur */}
        <path
          d="M 425 405 C 370 395, 315 405, 260 430 L 262 440 C 320 415, 375 410, 430 420 Z"
        />

        {/* Socle central de reliure */}
        <path
          d="M 235 425 C 245 435, 255 435, 265 425 L 260 445 C 253 448, 247 448, 240 445 Z"
        />
      </g>
    </svg>
  );
}

export function LogoImage({
  size = 56,
  className = "",
  invert = false,
}: {
  size?: number;
  className?: string;
  invert?: boolean;
}) {
  return (
    <img
      src="/logo-icon.png"
      alt="Ministry School Logo"
      width={size}
      height={size}
      className={`object-contain select-none pointer-events-none ${
        invert ? "brightness-0 invert" : ""
      } ${className}`}
      style={{ width: size, height: size }}
      loading="eager"
    />
  );
}

export default function Logo({
  size = 36,
  variant = "full", // "full" | "mark" | "stacked"
  colorTheme = "dark", // "dark" | "white"
}: {
  size?: number;
  variant?: "full" | "mark" | "stacked";
  colorTheme?: "dark" | "white";
}) {
  const isWhite = colorTheme === "white";

  if (variant === "mark") {
    return <LogoMark size={size} variant={isWhite ? "white" : "monochrome"} />;
  }

  if (variant === "stacked") {
    return (
      <div className="flex flex-col items-center text-center select-none">
        <div className="mb-2.5 p-2 rounded-2xl bg-white shadow-sm border border-slate-200">
          <LogoImage size={size} />
        </div>

        {/* MINISTRY */}
        <h2
          className={`text-xl font-bold uppercase tracking-[0.2em] ${
            isWhite ? "text-white" : "text-slate-900"
          }`}
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          Ministry
        </h2>

        {/* SCHOOL */}
        <div className="flex items-center gap-2 my-1 w-full justify-center opacity-80">
          <div className={`h-[1px] w-5 ${isWhite ? "bg-white/40" : "bg-slate-400"}`} />
          <span
            className={`text-xs font-semibold tracking-[0.32em] uppercase ${
              isWhite ? "text-slate-200" : "text-slate-700"
            }`}
          >
            School
          </span>
          <div className={`h-[1px] w-5 ${isWhite ? "bg-white/40" : "bg-slate-400"}`} />
        </div>

        {/* Devise */}
        <p
          className={`text-[0.62rem] tracking-[0.2em] uppercase font-medium mt-0.5 ${
            isWhite ? "text-slate-300" : "text-slate-500"
          }`}
        >
          Grandir • Servir • Impacter
        </p>
      </div>
    );
  }

  // Variant "full" (horizontal)
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="p-1 rounded-lg bg-white shadow-xs border border-slate-200">
        <LogoImage size={size} />
      </div>
      <div className="leading-tight">
        <p
          className={`text-sm font-bold uppercase tracking-[0.14em] ${
            isWhite ? "text-white" : "text-slate-900"
          }`}
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          Ministry
        </p>
        <p
          className={`text-[0.6rem] uppercase tracking-[0.26em] font-semibold ${
            isWhite ? "text-slate-300" : "text-slate-500"
          }`}
        >
          School
        </p>
      </div>
    </div>
  );
}
