import assert from "node:assert";
import {
  getRecommendedTargets,
  getRecommendedRanges,
  getEffectiveTargets,
  DEFAULT_NUTRITION_SETTINGS,
} from "./nutrition-settings.ts";

// ponytail: check - smallest runnable assert test for nutrition settings and targets logic
function runChecks() {
  // Check 1: Default recommended targets for standard 70kg user
  const targets70 = getRecommendedTargets(70);
  assert.strictEqual(targets70.calories, 1960, "70kg calories should be 70 * 28 = 1960");
  assert.strictEqual(targets70.protein, 126, "70kg protein should be 70 * 1.8 = 126");
  assert.strictEqual(targets70.carbs, 217, "70kg carbs should be 70 * 3.1 = 217");
  assert.strictEqual(targets70.fat, 63, "70kg fat should be 70 * 0.9 = 63");

  // Check 1b: Recommended ranges for standard 70kg user (Performance/Default)
  const ranges70 = getRecommendedRanges(70, "performance");
  assert.deepStrictEqual(ranges70.calories, [1820, 2100]); // 70*26, 70*30
  assert.deepStrictEqual(ranges70.protein, [112, 140]);   // 70*1.6, 70*2.0
  assert.deepStrictEqual(ranges70.carbs, [196, 238]);     // 70*2.8, 70*3.4
  assert.deepStrictEqual(ranges70.fat, [56, 70]);         // 70*0.8, 70*1.0

  // Check 1c: Recommended ranges for Definition (70kg: deficit + higher protein)
  const rangesDef70 = getRecommendedRanges(70, "definition");
  assert.deepStrictEqual(rangesDef70.calories, [1610, 1820]); // 70*23, 70*26
  assert.deepStrictEqual(rangesDef70.protein, [126, 168]);   // 70*1.8, 70*2.4 (Higher protein in deficit!)
  assert.deepStrictEqual(rangesDef70.carbs, [140, 196]);     // 70*2.0, 70*2.8

  // Check 1d: Recommended ranges for Hypertrophy (70kg: surplus + higher carbs)
  const rangesHyp70 = getRecommendedRanges(70, "hypertrophy");
  assert.deepStrictEqual(rangesHyp70.calories, [2170, 2450]); // 70*31, 70*35
  assert.deepStrictEqual(rangesHyp70.carbs, [252, 336]);     // 70*3.6, 70*4.8

  // Check 2: Default recommended targets when weight is omitted defaults to 72kg (in node environment)
  const targetsDefault = getRecommendedTargets();
  assert.strictEqual(targetsDefault.calories, Math.round(72 * 28));
  assert.strictEqual(targetsDefault.protein, Math.round(72 * 1.8));

  // Check 3: Default mode is wellness
  assert.strictEqual(DEFAULT_NUTRITION_SETTINGS.mode, "wellness");
  assert.strictEqual(DEFAULT_NUTRITION_SETTINGS.customTargetsEnabled, false);

  console.log("All nutrition-settings logic checks PASSED!");
}

runChecks();
