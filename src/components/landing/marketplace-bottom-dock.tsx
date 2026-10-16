import React, { useState, useRef, useEffect } from "react";
import { Search, Sparkles, X, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MarketplaceBottomDockProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  currentQuery?: string;
  onClearQuery?: () => void;
  className?: string;
}

const PLACEHOLDER_SUGGESTIONS = [
  "Buscar 'Pilates reformer en Recoleta'...",
  "Buscar 'Box de Hyrox con luz natural'...",
  "Buscar 'Yoga restaurativo después de las 19hs'...",
  "Buscar 'Fuerza & CrossFit en Palermo'...",
  "Preguntar a la IA por tu objetivo somático...",
];

export function MarketplaceBottomDock({
  onSearch,
  isSearching,
  currentQuery = "",
  onClearQuery,
  className,
}: MarketplaceBottomDockProps) {
  const [value, setValue] = useState(currentQuery);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(currentQuery);
  }, [currentQuery]);

  // Rotate placeholder hints smoothly
  useEffect(() => {
    if (isFocused || value.length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_SUGGESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isFocused, value]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = value.trim();
    if (query.length > 0) {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(20);
        } catch (_) {}
      }
      onSearch(query);
    }
  };

  const handleClear = () => {
    setValue("");
    onClearQuery?.();
    inputRef.current?.focus();
  };

  const handleAiPromptClick = () => {
    const query = value.trim();
    if (query.length > 0) {
      onSearch(query);
    } else {
      // If empty, suggest an intelligent somatic prompt
      const sample = "Pilates reformer y recuperación somática en Palermo";
      setValue(sample);
      onSearch(sample);
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 w-auto sm:w-[560px] z-40 select-none animate-in fade-in slide-in-from-bottom-3 duration-300",
        className,
      )}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          "rounded-full bg-[#141311]/92 backdrop-blur-2xl border transition-all duration-300 shadow-[0_16px_50px_rgba(0,0,0,0.85)] p-1.5 sm:p-2 flex items-center justify-between gap-2",
          isFocused
            ? "border-[#C5BAA8]/60 shadow-[0_20px_60px_rgba(197,186,168,0.15)] ring-1 ring-[#C5BAA8]/30"
            : "border-white/15 hover:border-white/25",
        )}
      >
        {/* Left: Search Icon & Text Input */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0 pl-2.5 sm:pl-3">
          <Search className="w-4 h-4 text-[#A39C91] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={PLACEHOLDER_SUGGESTIONS[placeholderIndex]}
            className="w-full bg-transparent text-xs sm:text-sm text-[#F6F4EE] placeholder:text-[#7D766D] focus:outline-none truncate font-normal"
          />

          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-[#7D766D] hover:text-[#F6F4EE] hover:bg-white/10 transition cursor-pointer shrink-0"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: AI Prompt / Pregunta IA Button (DoorDash Style Pill) */}
        <button
          type="button"
          onClick={handleAiPromptClick}
          disabled={isSearching}
          className={cn(
            "rounded-full px-3.5 sm:px-4 py-2 sm:py-2 text-xs font-bold flex items-center gap-1.5 transition-all duration-200 shrink-0 cursor-pointer select-none active:scale-95 shadow-md",
            value.trim().length > 0
              ? "bg-[#F6F4EE] text-[#0E0D0C] hover:bg-white"
              : "bg-gradient-to-r from-[#221F1B] to-[#1A1816] text-[#E8E2D5] border border-white/15 hover:border-[#C5BAA8]/40 hover:text-white",
          )}
        >
          {isSearching ? (
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          )}
          <span className="hidden xs:inline">Pregunta</span>
          <span>IA</span>
          {value.trim().length > 0 && <ArrowUp className="w-3 h-3 ml-0.5" />}
        </button>
      </form>
    </div>
  );
}
