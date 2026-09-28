import React, { useState, useEffect, useRef } from "react";
import { ArrowUp, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/typewriter";

interface LandingHeroProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export function LandingHero({ onSearch, isSearching }: LandingHeroProps) {
  return (
    <section className="relative pb-20 pt-20 md:pb-28 md:pt-28 bg-[#f8fafc] dark:bg-background border-b border-border/40 transition-colors">
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[42px] lg:text-[46px]">
          Encuentra donde entrenar como te lo imaginas
        </h1>
        <p className="mt-4 w-full max-w-5xl mx-auto text-center text-[14px] text-muted-foreground/85 dark:text-slate-200 sm:text-[15px] md:text-[16px] lg:whitespace-nowrap">
          Busca, reserva y gestiona tu entrenamiento en los mejores gimnasios, studios
          y fitness centers con IA.
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
        className={`relative rounded-3xl border transition-all duration-300 bg-background p-5 text-left ${
          isSearching
            ? "border-foreground ring-2 ring-foreground/10"
            : isFocused
              ? "border-foreground"
              : "border-border/80"
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
            className="w-full min-h-[64px] bg-transparent text-foreground placeholder-transparent focus:outline-none resize-none border-none p-0 focus:ring-0"
            disabled={isSearching}
          />

          {!inputValue && !isFocused && (
            <div className="absolute inset-0 pointer-events-none text-muted-foreground select-none">
              <Typewriter
                phrases={[
                  "Quiero un gimnasio con sala de musculación cerca de Palermo bajo $20.000…",
                  "Buscame clases de yoga matutino en Recoleta…",
                  "Necesito un box de CrossFit con WOD a las 19hs…",
                  "Pilates reformer con grupos reducidos en Villa Crespo…",
                  "Estudio de spinning con luces y buena música en Belgrano…",
                  "Un gimnasio que abra 24 horas y tenga estacionamiento…",
                  "Clases de funcional al aire libre para los sábados a la mañana…",
                  "Lugar de powerlifting con discos olímpicos y barras buenas…",
                  "Busco clases de zumba o baile divertidas después del trabajo…",
                ]}
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`grid h-8 w-8 place-items-center rounded-full transition ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "text-muted-foreground hover:text-foreground"
            }`}
            disabled={isSearching}
          >
            <Mic className="h-4 w-4" />
          </button>
          <Button
            type="submit"
            size="icon"
            className={`h-8 w-8 rounded-full transition-all duration-300 ${
              inputValue.trim()
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            disabled={isSearching || !inputValue.trim()}
          >
            {isSearching ? (
              <span className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
