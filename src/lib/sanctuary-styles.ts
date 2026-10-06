/**
 * The Wellness Face — Sanctuary Smoked Glassmorphism Design Tokens
 * 
 * Reusable classes and styles inspired by the Remedy Place / Sanctuary aesthetic.
 * Can be imported into any React component or applied via the CSS utility classes
 * (`glass-smoked`, `glass-smoked-interactive`, `glass-smoked-pill`, `glass-obsidian-solid`).
 */

export const SANCTUARY_GLASS = {
  /** Superficie base de vidrio ahumado (en reposo / estática) */
  base: "bg-[#151311]/45 backdrop-blur-xl border border-white/[0.08] shadow-[0_15px_45px_rgba(0,0,0,0.45)] text-[#F6F4EE]",

  /** Superficie de vidrio ahumado interactiva con elevación y borde al hover */
  interactive:
    "bg-[#151311]/45 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#151311]/60 shadow-[0_15px_45px_rgba(0,0,0,0.45)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 text-[#F6F4EE]",

  /** Cápsula/píldora para botones circulares, tags o badges de acción */
  pill: "rounded-full border border-white/[0.1] bg-[#181614]/60 text-[#A39C91] hover:text-[#F6F4EE] hover:bg-[#201D1A] hover:border-white/[0.2] transition-colors",

  /** Tarjeta solidificada en obsidiana (al enfocar, escribir o abrir modales) */
  obsidianSolid:
    "bg-[#11100E] backdrop-blur-2xl border border-[#C5BAA8]/70 shadow-[0_25px_65px_rgba(0,0,0,0.9)] ring-1 ring-[#C5BAA8]/20 text-[#F6F4EE]",

  /** Barra superior flotante o sticky */
  headerBar:
    "border-b border-white/[0.08] bg-[#151311]/45 backdrop-blur-xl text-[#F6F4EE] shadow-[0_15px_45px_rgba(0,0,0,0.45)]",
} as const;
