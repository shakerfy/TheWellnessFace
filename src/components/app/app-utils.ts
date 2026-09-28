// Subcomponent: Armstrong Urine Color Scale (Visual component matching exact reference HTML design)
export const ARMSTRONG_LEVELS = [
  {
    level: 1,
    hex: "#fbfce1",
    color:
      "bg-cyan-50 border-cyan-200 text-cyan-900 dark:bg-cyan-950/40 dark:border-cyan-800 dark:text-cyan-200",
    dot: "bg-cyan-100 border-cyan-300",
    title: "Nivel 1 — Transparente",
    usg: "< 1.010 g/cm³",
    state: "Euhidratación Óptima",
    advice: "Excelente balance celular. Mantén pequeños sorbos de agua potable a lo largo del día.",
  },
  {
    level: 2,
    hex: "#f9f9cd",
    color:
      "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/40 dark:border-yellow-800 dark:text-yellow-200",
    dot: "bg-yellow-200 border-yellow-300",
    title: "Nivel 2 — Amarillo Pálido",
    usg: "1.010 g/cm³",
    state: "Hidratación Saludable",
    advice: "Estado hídrico ideal para el rendimiento físico y deportivo continuo.",
  },
  {
    level: 3,
    hex: "#f6f2a9",
    color:
      "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200",
    dot: "bg-amber-300 border-amber-400",
    title: "Nivel 3 — Amarillo Claro",
    usg: "1.015 g/cm³",
    state: "Bien Hidratado",
    advice: "Buen estado hídrico para afrontar tus entrenamientos.",
  },
  {
    level: 4,
    hex: "#f2e285",
    color:
      "bg-amber-100 border-amber-300 text-amber-950 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-200",
    dot: "bg-amber-400 border-amber-500",
    title: "Nivel 4 — Amarillo Dorado",
    usg: "1.020 g/cm³",
    state: "Deshidratación Leve",
    advice:
      "Se sugiere hidratarse con agua fresca para mantener un balance óptimo y evitar fatiga.",
  },
  {
    level: 5,
    hex: "#eec863",
    color:
      "bg-amber-200 border-amber-400 text-amber-950 dark:bg-amber-800/40 dark:border-amber-600 dark:text-amber-100",
    dot: "bg-amber-500 border-amber-600",
    title: "Nivel 5 — Miel / Ámbar Claro",
    usg: "1.025 g/cm³",
    state: "Deshidratación Moderada",
    advice:
      "Considera reponer líquidos con agua y una fuente ligera de electrolitos o sales minerales.",
  },
  {
    level: 6,
    hex: "#e8a33a",
    color:
      "bg-amber-300 border-amber-500 text-amber-950 dark:bg-amber-700/50 dark:border-amber-500 dark:text-amber-100",
    dot: "bg-amber-700 border-amber-800",
    title: "Nivel 6 — Ámbar Oscuro",
    usg: "1.028 g/cm³",
    state: "Deshidratación Significativa",
    advice:
      "Tu cuerpo muestra signos de necesitar hidratación. Es un buen momento para reponer líquidos gradualmente con agua o una bebida isotónica.",
  },
  {
    level: 7,
    hex: "#d4812f",
    color:
      "bg-amber-700/20 border-amber-700 text-amber-900 dark:bg-amber-950/80 dark:border-amber-700 dark:text-amber-200",
    dot: "bg-amber-800 border-amber-900",
    title: "Nivel 7 — Té Oscuro",
    usg: "1.030 g/cm³",
    state: "Deshidratación Elevada",
    advice:
      "Refleja una pérdida hídrica considerable. Conviene resguardarte del calor y priorizar una rehidratación paulatina con sales y líquidos.",
  },
  {
    level: 8,
    hex: "#a66a2e",
    color:
      "bg-stone-800/20 border-stone-800 text-stone-900 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-100",
    dot: "bg-stone-900 border-stone-950",
    title: "Nivel 8 — Café / Marrón",
    usg: "> 1.030 g/cm³",
    state: "Deshidratación Severa (Alerta)",
    advice:
      "Concentración urinaria muy alta. Se recomienda pausar la actividad intensa, hidratarte y, si el tono persiste tras varias horas, consultar a un profesional de la salud.",
  },
];
