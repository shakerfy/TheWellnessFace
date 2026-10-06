import assert from "node:assert/strict";
import { SAMPLE_MINI_GAMES, getSampleMiniGameForMeal } from "../src/lib/mini-game-samples";
import { getMealDynamicCtas } from "../src/lib/meal-coach-insights";
import { resolvePedagogicalCtas } from "../src/lib/pedagogical-decision-engine";
import { CAL_AI_SAMPLE_MEALS } from "../src/lib/scan-data";
import { SCAN_SAMPLE_PRESET_CTAS, getScanSampleCtas } from "../src/lib/scan-sample-ctas";

console.log("Running Pedagogical Decision Engine and CTA integrity checks...");

// 1. Verify all 10 games are defined
const expectedGames = [
  "tap_to_pair",
  "scratch_reveal",
  "odd_one_out",
  "haptic_slider",
  "swipe_card",
  "slot_builder",
  "synergy_spin",
  "pace_timer",
  "tile_snap",
  "balancing_scale",
];

assert.equal(
  Object.keys(SAMPLE_MINI_GAMES).length,
  10,
  "Must contain exactly 10 sample mini-games",
);

for (const key of expectedGames) {
  const game = SAMPLE_MINI_GAMES[key];
  assert.ok(game, `Missing sample game for ${key}`);
  assert.equal(game.type, key, `Mismatch in game type property for ${key}`);
  assert.ok(game.title, `Game ${key} must have a title`);
}

// 2. Language and Moralizing Check (No punitives words like "engord", "pecado", "culpa")
const prohibitedWords = ["engord", "pecado", "cheat meal", "comida trampa", "bomba calórica"];
const allGameJson = JSON.stringify(SAMPLE_MINI_GAMES).toLowerCase();
const allPresetJson = JSON.stringify(SCAN_SAMPLE_PRESET_CTAS).toLowerCase();

for (const word of prohibitedWords) {
  assert.ok(
    !allGameJson.includes(word),
    `SAMPLE_MINI_GAMES must not contain prohibited moralizing word: "${word}"`,
  );
  assert.ok(
    !allPresetJson.includes(word),
    `SCAN_SAMPLE_PRESET_CTAS must not contain prohibited moralizing word: "${word}"`,
  );
}

// 3. Test Pedagogical Decision Engine Rules
console.log("Testing Pedagogical Decision Engine rules...");

// 3A. Confort rule: Anti-stress (ZERO games allowed)
const confortMeal = { id: "meal-c1", title: "Sopa o café", eatingReason: "confort" };
const confortCtas = resolvePedagogicalCtas(confortMeal);
assert.equal(confortCtas.length, 1, "Confort meal must have exactly 1 CTA (anti-overload)");
assert.equal(confortCtas[0].id, "take_a_pause", "Confort meal must offer breathing pause");
assert.ok(
  !confortCtas.some((c) => c.type === "mini_game"),
  "Confort meal must NEVER include a mini-game",
);

// 3B. Night meals: Rest preparation, ZERO games
const nightMeal = { id: "meal-n1", title: "Cena de pescado", mealType: "Cena", time: "20:30" };
const nightCtas = resolvePedagogicalCtas(nightMeal);
assert.ok(
  nightCtas.some((c) => c.id === "night-rest-prep"),
  "Night meal must include rest prep",
);
assert.ok(
  !nightCtas.some((c) => c.type === "mini_game"),
  "Night routine meal must prioritize rest over games",
);

// 3C. getMealDynamicCtas delegates to resolvePedagogicalCtas
const dynamicCtas = getMealDynamicCtas(confortMeal);
assert.equal(dynamicCtas[0].id, "take_a_pause");

// 4. Verify 11 Scanner Sample Meals: 4 with opportune games, 7 with pure education/habits
console.log("Checking 11 scanner sample presets for balanced 4/7 pedagogical distribution...");
assert.equal(
  CAL_AI_SAMPLE_MEALS.length,
  11,
  "Must have 11 sample meals in CAL_AI_SAMPLE_MEALS",
);

const samplesWithGames = [
  "calai-raspberry", // Scratch reveal: hidden phytochemicals
  "calai-salmon",    // Tap to pair: nutrient absorption synergy
  "calai-chicken",   // Slot builder: post-workout recovery triad
  "calai-burger",    // Swipe card: weekly balance myth vs guilt
];

const samplesWithoutGames = [
  "calai-pho",          // Herbal broth synergy + breathing
  "calai-matcha",        // L-theanine alpha waves + snack idea
  "calai-greek-yogurt",  // Microbiota symbiosis + additions
  "calai-pancakes",      // Next meal balance + satiety scale
  "calai-snack-mix",     // Hand-portion satiety + Armstrong
  "calai-smoothie",      // Digestive comfort + anti-drowsiness
  "calai-mousse",        // Night rest prep + digestive comfort
];

for (const id of samplesWithGames) {
  const preset = SCAN_SAMPLE_PRESET_CTAS[id];
  assert.ok(preset, `Missing preset for ${id}`);
  assert.ok(preset.miniGame, `Sample ${id} must have an opportune miniGame`);
  const ctas = getScanSampleCtas(id);
  assert.equal(ctas.length, 2, `Sample ${id} must have exactly 2 CTAs`);
  assert.ok(
    ctas.some((c) => c.type === "mini_game"),
    `Sample ${id} must include the mini_game CTA`,
  );
}

for (const id of samplesWithoutGames) {
  const preset = SCAN_SAMPLE_PRESET_CTAS[id];
  assert.ok(preset, `Missing preset for ${id}`);
  assert.ok(!preset.miniGame, `Sample ${id} must NOT have a miniGame`);
  const ctas = getScanSampleCtas(id);
  assert.equal(ctas.length, 2, `Sample ${id} must have exactly 2 CTAs`);
  assert.ok(
    !ctas.some((c) => c.type === "mini_game"),
    `Sample ${id} must NOT include a mini_game CTA (focused on education/habits)`,
  );
}

console.log("All Pedagogical Decision Engine and 4/7 balanced checks passed successfully!");
