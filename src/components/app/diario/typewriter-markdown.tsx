import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// ponytail: Client-side typewriter simulating Gemini streaming API. In production, replace with SSE stream reader.
export function renderInlineMarkdownTokens(text: string): React.ReactNode {
  if (!text) return text;
  const tokens = text.split(/(\*\*[^*]+?\*\*|\*[^*]+?\*|`[^`]+?`)/g);

  return tokens.map((token, idx) => {
    if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
      return (
        <strong key={idx} className="font-bold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
      return (
        <em key={idx} className="italic text-foreground/90 font-medium">
          {token.slice(1, -1)}
        </em>
      );
    }
    if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded-md bg-secondary/80 font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-300"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return token;
  });
}

export function parseRichMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const lines = text.split("\n");

  return lines.map((line, lIdx) => {
    const trimmed = line.trim();
    if (!trimmed) return <span key={lIdx} className="block h-2" />;

    if (
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ") ||
      trimmed.startsWith("• ")
    ) {
      const content = trimmed.slice(2);
      return (
        <div key={lIdx} className="flex items-start gap-2 my-1 pl-1 text-left">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold leading-none mt-1 shrink-0">
            •
          </span>
          <span className="flex-1 leading-relaxed">
            {renderInlineMarkdownTokens(content)}
          </span>
        </div>
      );
    }

    return (
      <span key={lIdx} className="block leading-relaxed">
        {renderInlineMarkdownTokens(line)}
      </span>
    );
  });
}

export interface TypewriterMarkdownProps {
  content: string;
  speed?: number;
  chunkSize?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterMarkdown({
  content,
  speed = 14,
  chunkSize = 2,
  className,
  onComplete,
}: TypewriterMarkdownProps) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    setDisplayedLength(0);
    setIsSkipped(false);
    if (!content) return;

    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(content.length, current + chunkSize);
      setDisplayedLength(current);

      if (current >= content.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed, chunkSize, onComplete]);

  const displayedText = isSkipped ? content : content.slice(0, displayedLength);
  const isTyping = !isSkipped && displayedLength < content.length;

  let safeText = displayedText;
  const boldCount = (safeText.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) safeText += "**";
  const codeCount = (safeText.match(/`/g) || []).length;
  if (codeCount % 2 !== 0) safeText += "`";

  return (
    <div
      onClick={() => setIsSkipped(true)}
      className={cn("cursor-pointer select-text transition-opacity", className)}
      title={isTyping ? "Toca para revelar el texto completo" : undefined}
    >
      {parseRichMarkdown(safeText)}
      {isTyping && (
        <span className="inline-block w-1.5 h-3.5 bg-emerald-500 rounded-xs animate-pulse ml-0.5 align-middle" />
      )}
    </div>
  );
}
