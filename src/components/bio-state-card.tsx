import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface BioCurrentState {
  mood: number; // 0 (Anxious) to 100 (Calm)
  hunger: number; // 0 (Hungry) to 100 (Satiated)
  energy: number; // 0 (Fatigued) to 100 (Energized)
  updatedAt: number;
}

interface BioStateSliderPillProps {
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (val: number) => void;
  gradient: string;
  activeSideThreshold?: number;
}

function BioStateSliderPill({
  leftLabel,
  rightLabel,
  value,
  onChange,
  gradient,
  activeSideThreshold = 50,
}: BioStateSliderPillProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculatePercent = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0) return;
    const rawPercent = Math.round(((clientX - rect.left) / rect.width) * 100);
    const clamped = Math.min(100, Math.max(0, rawPercent));
    onChange(clamped);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    calculatePercent(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    calculatePercent(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  const clampedVal = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-2 text-left">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider select-none px-1">
        <span
          className={cn(
            "transition-colors duration-200",
            clampedVal < activeSideThreshold
              ? "text-foreground font-black"
              : "text-muted-foreground/60 font-semibold",
          )}
        >
          {leftLabel}
        </span>
        <span
          className={cn(
            "transition-colors duration-200",
            clampedVal >= activeSideThreshold
              ? "text-foreground font-black"
              : "text-muted-foreground/60 font-semibold",
          )}
        >
          {rightLabel}
        </span>
      </div>

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative h-12 bg-slate-100/90 dark:bg-zinc-900/90 rounded-2xl overflow-hidden cursor-pointer border border-slate-200 dark:border-zinc-800/80 select-none touch-none group hover:border-foreground/30 transition-all shadow-inner"
        role="slider"
        aria-valuenow={clampedVal}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            onChange(Math.max(0, clampedVal - 5));
          } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            onChange(Math.min(100, clampedVal + 5));
          }
        }}
      >
        {/* Gradient fill */}
        <div
          className="absolute top-0 left-0 h-full rounded-2xl transition-[width] duration-75 ease-out"
          style={{
            width: `${clampedVal}%`,
            background: gradient,
          }}
        />

        {/* Vertical Thumb indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.35)] border border-slate-300/40 dark:border-white/30 transform -translate-x-1/2 transition-[left] duration-75 ease-out pointer-events-none z-10"
          style={{ left: `${clampedVal}%` }}
        />
      </div>
    </div>
  );
}

export function BioStateCard({ className }: { className?: string }) {
  const [bioState, setBioState] = useState<BioCurrentState>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("shakerfy_current_bio_state");
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {}
    }
    return {
      mood: 75,
      hunger: 40,
      energy: 60,
      updatedAt: Date.now() - 20 * 60 * 1000, // 20m ago default
    };
  });

  const [timeAgo, setTimeAgo] = useState("Actualizado hace 20 min");

  const updateRelativeTime = (timestamp: number) => {
    if (!timestamp) {
      setTimeAgo("Actualizado recién");
      return;
    }
    const diffMins = Math.floor((Date.now() - timestamp) / (1000 * 60));
    if (diffMins < 1) {
      setTimeAgo("Actualizado recién");
    } else if (diffMins < 60) {
      setTimeAgo(`Actualizado hace ${diffMins} min`);
    } else {
      const diffHours = Math.floor(diffMins / 60);
      setTimeAgo(`Actualizado hace ${diffHours} h`);
    }
  };

  useEffect(() => {
    updateRelativeTime(bioState.updatedAt);
    const timer = setInterval(() => updateRelativeTime(bioState.updatedAt), 60000);
    return () => clearInterval(timer);
  }, [bioState.updatedAt]);

  const updateMetric = (key: "mood" | "hunger" | "energy", val: number) => {
    const updated: BioCurrentState = {
      ...bioState,
      [key]: val,
      updatedAt: Date.now(),
    };
    setBioState(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("shakerfy_current_bio_state", JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("shakerfy:bio-state-update", { detail: updated }));
      } catch (_) {}
    }
  };

  return (
    <Card
      className={cn(
        "rounded-3xl p-5 sm:p-6 border border-border bg-card text-card-foreground shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-5 text-left">
        <h2 className="text-base font-bold text-foreground">Estado Actual</h2>
        <span className="text-xs text-muted-foreground/70 font-medium">{timeAgo}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* Mood Slider - Pastel Purple to Vibrant Purple */}
        <BioStateSliderPill
          leftLabel="ANSIEDAD"
          rightLabel="CALMA"
          value={bioState.mood}
          onChange={(v) => updateMetric("mood", v)}
          gradient="linear-gradient(to right, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.55) 45%, rgba(126, 34, 206, 0.95) 100%)"
        />

        {/* Hunger Slider - Pastel Emerald to Vibrant Emerald */}
        <BioStateSliderPill
          leftLabel="HAMBRE"
          rightLabel="SACIEDAD"
          value={bioState.hunger}
          onChange={(v) => updateMetric("hunger", v)}
          gradient="linear-gradient(to right, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.55) 45%, rgba(5, 150, 105, 0.95) 100%)"
        />

        {/* Energy Slider - Pastel Amber to Vibrant Amber */}
        <BioStateSliderPill
          leftLabel="FATIGA"
          rightLabel="ENERGÍA"
          value={bioState.energy}
          onChange={(v) => updateMetric("energy", v)}
          gradient="linear-gradient(to right, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.55) 45%, rgba(217, 119, 6, 0.95) 100%)"
        />
      </div>
    </Card>
  );
}
