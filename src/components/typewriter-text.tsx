import { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
}

/**
 * Componente que renderiza texto con efecto de máquina de escribir / streaming (estilo ChatGPT).
 */
export function TypewriterText({
  text,
  speed = 16,
  className,
  onComplete,
  showCursor = true,
}: TypewriterTextProps) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const isComplete = displayedLength >= text.length;

  useEffect(() => {
    setDisplayedLength(0);
    if (!text) return;

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setDisplayedLength(current);
      if (current >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {text.slice(0, displayedLength)}
      {showCursor && !isComplete && (
        <span className="inline-block w-1.5 h-3.5 bg-amber-500 ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}
