export type MiniGameType =
  | "tap_to_pair"
  | "scratch_reveal"
  | "odd_one_out"
  | "haptic_slider"
  | "swipe_card"
  | "slot_builder"
  | "synergy_spin"
  | "pace_timer"
  | "tile_snap"
  | "balancing_scale";

// 1. El Emparejador
export interface TapToPairItem {
  id: string;
  label: string;
  category: "nutrient" | "function";
  icon?: string;
  pairId: string;
}

export interface TapToPairPayload {
  type: "tap_to_pair";
  title: string;
  instruction: string;
  items: TapToPairItem[];
  explanation: string;
}

// 2. El Raspa y Descubre
export interface ScratchRevealPayload {
  type: "scratch_reveal";
  title: string;
  teaser: string;
  revealedTitle: string;
  revealedText: string;
  badge: string;
  foodSource: string;
}

// 3. El Intruso
export interface OddOneOutOption {
  id: string;
  label: string;
  isOut: boolean;
  explanation: string;
}

export interface OddOneOutPayload {
  type: "odd_one_out";
  title: string;
  prompt: string;
  options: OddOneOutOption[];
  successMessage: string;
}

// 4. El Dial Háptico
export interface HapticSliderPayload {
  type: "haptic_slider";
  title: string;
  prompt: string;
  minLabel: string;
  maxLabel: string;
  defaultValue?: number;
  feedbacks: Array<{
    range: [number, number];
    label: string;
    text: string;
  }>;
}

// 5. El Swipe Rápido A/B
export interface SwipeCardPayload {
  type: "swipe_card";
  title: string;
  statement: string;
  isTruth: boolean;
  explanation: string;
  takeaway: string;
}

// 6. El Constructor de Ranuras
export interface SlotItem {
  id: string;
  targetCategory: string;
  label: string;
}

export interface PoolItem {
  id: string;
  label: string;
  category: string;
}

export interface SlotBuilderPayload {
  type: "slot_builder";
  title: string;
  prompt: string;
  slots: SlotItem[];
  pool: PoolItem[];
  comboName: string;
  explanation: string;
}

// 7. La Ruleta del Chef
export interface SynergyTwist {
  id: string;
  name: string;
  desc: string;
  benefit: string;
}

export interface SynergySpinPayload {
  type: "synergy_spin";
  title: string;
  prompt: string;
  twists: SynergyTwist[];
}

// 8. El Micro-Ritmo de Masticación
export interface PaceTimerPayload {
  type: "pace_timer";
  title: string;
  instruction: string;
  durationSeconds: number;
  phaseGuide: string;
  completionInsight: string;
}

// 9. El Imán de Palabras
export interface TileSnapPayload {
  type: "tile_snap";
  title: string;
  sentenceBefore: string;
  sentenceAfter: string;
  correctTile: { id: string; label: string };
  distractorTile: { id: string; label: string };
  explanation: string;
}

// 10. La Balanza de Decisión
export interface BalanceSide {
  id: "left" | "right";
  label: string;
  highlightedIngredients: string[];
  explanation: string;
}

export interface BalancingScalePayload {
  type: "balancing_scale";
  title: string;
  question: string;
  sideA: BalanceSide;
  sideB: BalanceSide;
}

export type MiniGamePayload =
  | TapToPairPayload
  | ScratchRevealPayload
  | OddOneOutPayload
  | HapticSliderPayload
  | SwipeCardPayload
  | SlotBuilderPayload
  | SynergySpinPayload
  | PaceTimerPayload
  | TileSnapPayload
  | BalancingScalePayload;

export interface MiniGameResult {
  gameType: MiniGameType;
  completedAt: string;
  summary: string;
  userSelection?: string | number | string[];
}
