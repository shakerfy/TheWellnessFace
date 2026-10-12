import assert from "node:assert/strict";
import { resolvePedagogicalCtas } from "../src/lib/pedagogical-decision-engine";
import { getMealDynamicCtas, getMealCtaMarkdownContent } from "../src/lib/meal-coach-insights";
import { SCAN_SAMPLE_PRESET_CTAS, getScanSampleCtas } from "../src/lib/scan-sample-ctas";
import { CAL_AI_SAMPLE_MEALS } from "../src/lib/scan-data";

console.log("Iniciando validación de Insights y CTAs en Markdown Puro...");

// 1. Verificar que los 4 arquetipos canónicos del escáner tengan exactamente 3 CTAs (1 primario + 2 secundarios) en Markdown
const presetKeys = Object.keys(SCAN_SAMPLE_PRESET_CTAS);
assert.equal(presetKeys.length, 4, "Deben existir exactamente 4 presets de comida en SCAN_SAMPLE_PRESET_CTAS");
assert.equal(CAL_AI_SAMPLE_MEALS.length, 4, "Deben existir exactamente 4 platos de muestra en CAL_AI_SAMPLE_MEALS");

for (const key of presetKeys) {
  const ctas = getScanSampleCtas(key);
  assert.equal(
    ctas.length,
    3,
    `El preset "${key}" debe generar exactamente 3 CTAs (1 primario + 2 secundarios, tiene ${ctas.length})`,
  );
  assert.equal(ctas[0].id, "view-insight", `El primer CTA de "${key}" debe ser 'view-insight'`);

  for (const cta of ctas) {
    assert.ok(cta.id, `CTA en "${key}" debe tener un id`);
    assert.ok(cta.title, `CTA "${cta.id}" en "${key}" debe tener un título`);
    assert.ok(cta.iconType, `CTA "${cta.id}" en "${key}" debe tener un iconType`);

    // Probar que genera contenido Markdown válido
    const mockItem = { id: key, title: "Plato de prueba" };
    const markdown = cta.markdown || getMealCtaMarkdownContent(cta.id, mockItem);
    assert.ok(
      typeof markdown === "string" && markdown.length > 30,
      `CTA "${cta.id}" en "${key}" debe generar texto Markdown de más de 30 caracteres`,
    );
  }
}
console.log("✓ Los 4 presets del escáner generan 1 primario + 2 secundarios válidos en Markdown.");

// 2. Verificar regla contextual para Hamburguesa Vegetariana (caso del usuario)
const veggieBurger = {
  id: "test-veggie-burger",
  title: "Hamburguesa vegetariana con quinoa",
  desc: "Hamburguesa a base de plantas con rodajas de tomate y palta",
  time: "13:30",
  protein: 14,
};

const veggieCtas = resolvePedagogicalCtas(veggieBurger);
assert.ok(
  veggieCtas.some((c) => c.id === "view-insight"),
  "Hamburguesa vegetariana debe incluir CTA 'view-insight'",
);
assert.ok(
  veggieCtas.some((c) => c.id === "balance-my-day"),
  "Hamburguesa vegetariana debe incluir CTA 'balance-my-day'",
);
assert.ok(
  veggieCtas.some((c) => c.id === "why-protein-matters"),
  "Hamburguesa vegetariana debe sugerir 'why-protein-matters'",
);

// Verificar texto de 'balance-my-day' para la hamburguesa
const balanceText = getMealCtaMarkdownContent("balance-my-day", veggieBurger);
assert.ok(
  balanceText.includes("lentejas") || balanceText.includes("tofu") || balanceText.includes("vegetariano"),
  "El texto de balance para hamburguesa vegetariana debe sugerir legumbres o tofu",
);
console.log("✓ Caso Hamburguesa Vegetariana: genera Ver Insight + Equilibrar mi día + Por qué es importante la proteína con texto contextual.");

// 3. Verificar regla contextual para Cena Nocturna (después de las 19:30)
const nightDinner = {
  id: "test-night-dinner",
  title: "Sopa tibia de calabaza",
  time: "21:30",
};

const nightCtas = resolvePedagogicalCtas(nightDinner);
assert.ok(
  nightCtas.some((c) => c.id === "night-rest-prep"),
  "Cena nocturna debe activar 'night-rest-prep' (Digestión y descanso)",
);
console.log("✓ Caso Cena Nocturna: activa Digestión y descanso nocturno.");

// 4. Verificar regla de Alimentos de Energía Rápida (Sour Patch / golosinas)
const candyItem = {
  id: "test-candy",
  title: "Sour Patch Kids",
  desc: "Golosinas ácidas",
  time: "16:00",
};

const candyCtas = resolvePedagogicalCtas(candyItem);
assert.ok(
  candyCtas.some((c) => c.id === "sustained-energy"),
  "Alimento de absorción rápida debe activar 'sustained-energy' (Energía sostenida sin bajón)",
);
console.log("✓ Caso Energía Rápida: activa Energía sostenida sin bajón.");

// 5. Cero Moralidad Alimentaria (Anti-Orthorexia Framework)
const prohibitedWords = [
  "engord",
  "pecado",
  "cheat meal",
  "comida trampa",
  "bomba calórica",
  "prohibid",
  "alimento malo",
  "alimento bueno",
];

const testSampleMeals = [veggieBurger, nightDinner, candyItem, ...CAL_AI_SAMPLE_MEALS];
for (const meal of testSampleMeals) {
  const ctas = resolvePedagogicalCtas(meal);
  for (const cta of ctas) {
    const text = (cta.markdown || getMealCtaMarkdownContent(cta.id, meal)).toLowerCase();
    for (const badWord of prohibitedWords) {
      assert.ok(
        !text.includes(badWord),
        `El CTA "${cta.id}" para "${meal.title}" contiene la palabra prohibida "${badWord}"`,
      );
    }
  }
}
console.log("✓ Blindaje Ético verificado: 0 palabras moralizantes o punitivas en todos los textos.");

console.log("Todos los tests de CTAs e Insights en Markdown pasaron exitosamente!");
