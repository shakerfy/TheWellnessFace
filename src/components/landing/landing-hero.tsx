import React, { useState, useEffect, useRef } from "react";
import { ArrowUp, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/typewriter";

interface LandingHeroProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const HERO_VIDEOS = [
  "/hero-recovery.mp4",
  "/hero-pilates.mp4",
  "/hero-hyrox.mp4",
];

export function LandingHero({ onSearch, isSearching }: LandingHeroProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleVideoEnded = (index: number) => {
    const nextIndex = (index + 1) % HERO_VIDEOS.length;
    const nextVideo = videoRefs.current[nextIndex];
    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
    }
    setActiveVideoIndex(nextIndex);
  };

  useEffect(() => {
    videoRefs.current.forEach((vid) => {
      if (vid) {
        vid.muted = true;
        vid.defaultMuted = true;
      }
    });
    const currentVideo = videoRefs.current[activeVideoIndex];
    if (currentVideo) {
      currentVideo.currentTime = 0;
      currentVideo.play().catch(() => {});
    }
  }, [activeVideoIndex]);

  return (
    <section className="relative pb-20 pt-20 md:pb-28 md:pt-28 bg-[#0E0D0C] border-b border-[#26221E] overflow-hidden transition-colors">
      {/* Looping ambient background video playlist with smooth crossfade */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {HERO_VIDEOS.map((src, idx) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            autoPlay={idx === 0}
            muted
            playsInline
            preload="auto"
            onEnded={() => handleVideoEnded(idx)}
            className={`absolute inset-0 h-full w-full object-cover scale-105 transition-opacity duration-1000 ease-in-out ${
              activeVideoIndex === idx ? "opacity-90 z-[1]" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
        {/* Soft edge fade: smooth blend with header and footer without washing out the center */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#0E0D0C]/50 via-transparent to-[#0E0D0C]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <h1 className="text-balance text-3xl font-light tracking-tight text-[#F6F4EE] sm:text-4xl md:text-[44px] lg:text-[48px] leading-[1.15] drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
          Encuentra tu centro de bienestar, rendimiento y calma
        </h1>
        <p className="mt-4 w-full max-w-2xl mx-auto text-center text-[14px] text-[#DDD6CB] sm:text-[15px] md:text-[16px] leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)] font-normal">
          Buscador asistido por IA de estudios de Pilates, boxes de Hyrox, yoga, funcional y centros de recuperación seleccionados.
        </p>

        <PromptBox onSearch={onSearch} isSearching={isSearching} />
      </div>
    </section>
  );
}

function PromptBox({
  onSearch,
  isSearching,
}: {
  onSearch: (query: string) => void;
  isSearching: boolean;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isSolid = isFocused || inputValue.trim().length > 0;

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "es-AR";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => (prev ? prev + " " + transcript : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Tu navegador no soporta reconocimiento de voz.");
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  return (
    <div className="mt-10 w-full max-w-2xl px-2 relative z-20">
      <form
        onSubmit={handleSubmit}
        className={`relative rounded-3xl border transition-all duration-500 p-5 text-left ${
          isSearching
            ? "bg-[#11100E] border-[#C5BAA8] ring-2 ring-[#C5BAA8]/20 shadow-[0_25px_65px_rgba(0,0,0,0.9)]"
            : isSolid
              ? "bg-[#11100E] backdrop-blur-2xl border-[#C5BAA8]/70 shadow-[0_25px_65px_rgba(0,0,0,0.9)] ring-1 ring-[#C5BAA8]/20"
              : "bg-[#151311]/45 backdrop-blur-xl border-white/[0.1] hover:border-white/[0.2] hover:bg-[#151311]/60 shadow-[0_15px_45px_rgba(0,0,0,0.55)]"
        }`}
      >
        <div className="relative min-h-[64px] text-[15px] leading-relaxed">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder=""
            className="w-full min-h-[64px] bg-transparent text-[#F6F4EE] placeholder-transparent focus:outline-none resize-none border-none p-0 focus:ring-0"
            disabled={isSearching}
          />

          {!inputValue && !isFocused && (
            <div className="absolute inset-0 pointer-events-none text-[#7D766D] select-none">
              <Typewriter
                phrases={[
                  "Pilates reformer con luz natural y grupos reducidos en Pichincha…",
                  "Box de Hyrox o CrossFit con zona de movilidad y recovery…",
                  "Sesiones de yoga restaurativo y respiración cerca de Bv. Oroño…",
                  "Estudio boutique para entrenar fuerza sin impacto articular…",
                  "Centro de entrenamiento funcional con sauna o contraste frío…",
                  "Estudio con pocas personas para entrenar a las 7 AM antes de la oficina…",
                  "Box de funcional atlético con vestuarios impecables y buena vibra…",
                ]}
              />
            </div>
          )}
        </div>

        <div
          className={`mt-4 flex items-center justify-end gap-3 pt-2 border-t transition-colors duration-500 ${
            isSolid ? "border-[#221F1B]" : "border-white/[0.08]"
          }`}
        >
          <button
            type="button"
            onClick={toggleListening}
            className={`grid h-8 w-8 place-items-center rounded-full transition ${
              isListening
                ? "bg-rose-500 text-white animate-pulse"
                : "text-[#8C857B] hover:text-[#F6F4EE] hover:bg-[#221F1B]"
            }`}
            disabled={isSearching}
            title={isListening ? "Escuchando voz..." : "Búsqueda por voz"}
          >
            <Mic className="h-4 w-4" />
          </button>
          <Button
            type="submit"
            size="icon"
            className={`h-8 w-8 rounded-full transition-all duration-300 ${
              inputValue.trim()
                ? "bg-[#E8E2D5] text-[#141312] hover:bg-[#F6F4EE]"
                : "bg-[#221F1B] text-[#5C554D] cursor-not-allowed"
            }`}
            disabled={isSearching || !inputValue.trim()}
          >
            {isSearching ? (
              <span className="h-4 w-4 border-2 border-[#141312] border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
