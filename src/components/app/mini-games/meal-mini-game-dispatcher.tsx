import { MiniGamePayload, MiniGameResult } from "./mini-game-types";
import { TapToPairGame } from "./tap-to-pair-game";
import { ScratchRevealGame } from "./scratch-reveal-game";
import { OddOneOutGame } from "./odd-one-out-game";
import { HapticSliderGame } from "./haptic-slider-game";
import { SwipeCardGame } from "./swipe-card-game";
import { SlotBuilderGame } from "./slot-builder-game";
import { SynergySpinGame } from "./synergy-spin-game";
import { PaceTimerGame } from "./pace-timer-game";
import { TileSnapGame } from "./tile-snap-game";
import { BalancingScaleGame } from "./balancing-scale-game";

export interface MealMiniGameDispatcherProps {
  payload: MiniGamePayload;
  onComplete?: (result: MiniGameResult) => void;
  initialCompleted?: boolean;
}

export function MealMiniGameDispatcher({
  payload,
  onComplete,
  initialCompleted,
}: MealMiniGameDispatcherProps) {
  switch (payload.type) {
    case "tap_to_pair":
      return (
        <TapToPairGame
          payload={payload}
          onComplete={onComplete}
          initialCompleted={initialCompleted}
        />
      );
    case "scratch_reveal":
      return (
        <ScratchRevealGame
          payload={payload}
          onComplete={onComplete}
          initialCompleted={initialCompleted}
        />
      );
    case "odd_one_out":
      return (
        <OddOneOutGame
          payload={payload}
          onComplete={onComplete}
          initialCompleted={initialCompleted}
        />
      );
    case "haptic_slider":
      return (
        <HapticSliderGame
          payload={payload}
          onComplete={onComplete}
          initialCompleted={initialCompleted}
        />
      );
    case "swipe_card":
      return (
        <SwipeCardGame
          payload={payload}
          onComplete={onComplete}
          initialCompleted={initialCompleted}
        />
      );
    case "slot_builder":
      return (
        <SlotBuilderGame
          payload={payload}
          onComplete={onComplete}
          initialCompleted={initialCompleted}
        />
      );
    case "synergy_spin":
      return (
        <SynergySpinGame
          payload={payload}
          onComplete={onComplete}
          initialCompleted={initialCompleted}
        />
      );
    case "pace_timer":
      return (
        <PaceTimerGame
          payload={payload}
          onComplete={onComplete}
          initialCompleted={initialCompleted}
        />
      );
    case "tile_snap":
      return (
        <TileSnapGame
          payload={payload}
          onComplete={onComplete}
          initialCompleted={initialCompleted}
        />
      );
    case "balancing_scale":
      return (
        <BalancingScaleGame
          payload={payload}
          onComplete={onComplete}
          initialCompleted={initialCompleted}
        />
      );
    default:
      return null;
  }
}
