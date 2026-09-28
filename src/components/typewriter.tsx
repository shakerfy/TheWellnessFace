import { useEffect, useState } from "react";

export function Typewriter({
  phrases,
  className,
  speed = 45,
  pause = 1800,
}: {
  phrases: string[];
  className?: string;
  speed?: number;
  pause?: number;
}) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[i % phrases.length];
    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setI((v) => v + 1);
      return;
    }
    const t = setTimeout(
      () => {
        setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
      },
      deleting ? speed / 2 : speed,
    );
    return () => clearTimeout(t);
  }, [text, deleting, i, phrases, speed, pause]);

  return (
    <span className={className}>
      <span>{text}</span>
      <span className="caret" aria-hidden />
    </span>
  );
}

export interface TypewriterTextProps {
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
