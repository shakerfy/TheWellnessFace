import React from "react";
import { Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function parseInlineMarkdown(text: string): React.ReactNode {
  if (!text) return text;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const italicParts = part.split(/(\*[^*]+\*)/g);
    if (italicParts.length > 1) {
      return italicParts.map((sub, subIdx) => {
        if (sub.startsWith("*") && sub.endsWith("*") && sub.length > 2) {
          return (
            <em key={subIdx} className="italic text-foreground/90">
              {sub.slice(1, -1)}
            </em>
          );
        }
        return sub;
      });
    }
    return part;
  });
}

interface FaqItem {
  question: string;
  answerBlocks: string[];
}

function isQuestionHeading(trimmed: string): boolean {
  if (trimmed.startsWith("#### ¿") || trimmed.startsWith("### ¿")) return true;
  if (trimmed.startsWith("#### ") && trimmed.includes("?")) return true;
  if (trimmed.startsWith("#### FAQ") || trimmed.startsWith("#### Pregunta")) return true;
  return false;
}

function getQuestionTitle(trimmed: string): string {
  return trimmed.replace(/^#{3,4}\s*/, "").trim();
}

export function renderBlogMarkdown(content: string): React.ReactNode[] {
  const rawBlocks = content.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < rawBlocks.length) {
    const block = rawBlocks[i];

    // 1. Group contiguous FAQ / Question Headings into Shadcn/Radix Accordions
    if (isQuestionHeading(block)) {
      const faqItems: FaqItem[] = [];

      while (i < rawBlocks.length && isQuestionHeading(rawBlocks[i])) {
        const qBlock = rawBlocks[i];
        const question = getQuestionTitle(qBlock);
        i++;

        const answerBlocks: string[] = [];
        while (
          i < rawBlocks.length &&
          !isQuestionHeading(rawBlocks[i]) &&
          !rawBlocks[i].startsWith("#") &&
          rawBlocks[i] !== "---"
        ) {
          answerBlocks.push(rawBlocks[i]);
          i++;
        }

        faqItems.push({ question, answerBlocks });
      }

      elements.push(
        <div key={`faq-group-${i}`} className="my-8 space-y-2.5">
          <Accordion type="multiple" className="w-full space-y-3">
            {faqItems.map((item, qIdx) => (
              <AccordionItem
                key={qIdx}
                value={`item-${qIdx}`}
                className="rounded-2xl border border-border/70 bg-card px-4 py-1 shadow-xs hover:border-foreground/30 transition-all"
              >
                <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-3.5 text-foreground hover:no-underline cursor-pointer">
                  <span>{parseInlineMarkdown(item.question)}</span>
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-foreground/85 leading-relaxed pt-2 pb-4 border-t border-border/40">
                  {item.answerBlocks.map((ansBlock, aIdx) => {
                    if (ansBlock.startsWith("- ")) {
                      const listItems = ansBlock
                        .split("\n")
                        .map((li) => li.replace(/^-\s*/, "").trim());
                      return (
                        <ul
                          key={aIdx}
                          className="my-2 space-y-1.5 list-disc list-inside text-foreground"
                        >
                          {listItems.map((it, lIdx) => (
                            <li key={lIdx}>{parseInlineMarkdown(it)}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (
                      ansBlock.startsWith("$$") ||
                      ansBlock.includes("WMA_") ||
                      ansBlock.includes("MET-minutos")
                    ) {
                      return (
                        <div
                          key={aIdx}
                          className="my-3 p-3.5 rounded-xl bg-secondary/50 border border-border font-mono text-xs overflow-x-auto text-foreground"
                        >
                          {parseInlineMarkdown(ansBlock)}
                        </div>
                      );
                    }
                    return (
                      <p key={aIdx} className="my-2 leading-relaxed text-foreground/90">
                        {parseInlineMarkdown(ansBlock)}
                      </p>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      );
      continue;
    }

    const trimmed = block;

    // 2. Markdown Table (| Col | Col |)
    if (trimmed.startsWith("|") && trimmed.includes("|")) {
      const lines = trimmed
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.startsWith("|"));
      if (lines.length >= 2) {
        const headerCols = lines[0]
          .split("|")
          .map((c) => c.trim())
          .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

        const bodyLines = lines
          .slice(1)
          .filter((l) => !l.includes(":---") && !l.includes("---"));

        elements.push(
          <div
            key={`table-${i}`}
            className="my-8 overflow-x-auto rounded-2xl border border-border bg-card shadow-xs"
          >
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-secondary/40 text-muted-foreground uppercase tracking-wider font-bold border-b border-border">
                <tr>
                  {headerCols.map((col, hIdx) => (
                    <th key={hIdx} className="px-4 py-3 font-extrabold text-foreground">
                      {parseInlineMarkdown(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-foreground">
                {bodyLines.map((rowLine, rIdx) => {
                  const cells = rowLine
                    .split("|")
                    .map((c) => c.trim())
                    .filter((_, cIdx, arr) => cIdx > 0 && cIdx < arr.length - 1);
                  return (
                    <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                      {cells.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-3 align-top font-medium">
                          {parseInlineMarkdown(cell)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        i++;
        continue;
      }
    }

    // 3. Headings
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl font-bold mt-8 mb-3 text-foreground tracking-tight">
          {parseInlineMarkdown(trimmed.replace("### ", ""))}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("#### ")) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-lg font-bold mt-6 mb-2 text-foreground">
          {parseInlineMarkdown(trimmed.replace("#### ", ""))}
        </h4>
      );
      i++;
      continue;
    }

    // 4. Blockquotes
    if (trimmed.startsWith("> ")) {
      const quoteText = trimmed.replace(/^>\s*/gm, "").replace(/"/g, "").trim();
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-6 border-l-4 border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 p-4 rounded-r-2xl italic text-foreground font-medium"
        >
          {parseInlineMarkdown(quoteText)}
        </blockquote>
      );
      i++;
      continue;
    }

    // 5. Horizontal Rule
    if (trimmed === "---") {
      elements.push(<hr key={`hr-${i}`} className="my-8 border-border" />);
      i++;
      continue;
    }

    // 6. Formula / Math Block ($$ ... $$)
    if (
      trimmed.startsWith("$$") ||
      trimmed.includes("NRF 9.3 =") ||
      trimmed.includes("WMA_") ||
      trimmed.includes("Meta Semanal OMS")
    ) {
      elements.push(
        <div
          key={`math-${i}`}
          className="my-8 p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 flex flex-col items-center justify-center text-center space-y-3 shadow-xs"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fórmula Matemática & Fisiológica</span>
          </div>
          <div className="text-sm sm:text-base md:text-lg font-mono font-black text-foreground tracking-tight py-2 px-4 rounded-2xl bg-card border border-border shadow-inner max-w-full overflow-x-auto">
            {parseInlineMarkdown(trimmed.replace(/^\$\$\s*/, "").replace(/\s*\$\$$/, ""))}
          </div>
        </div>
      );
      i++;
      continue;
    }

    // 7. Unordered List (- item)
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").map((li) => li.replace(/^-\s*/, "").trim());
      elements.push(
        <ul key={`ul-${i}`} className="my-4 space-y-2 list-disc list-inside text-foreground">
          {items.map((it, lIdx) => (
            <li key={lIdx} className="leading-relaxed">
              {parseInlineMarkdown(it)}
            </li>
          ))}
        </ul>
      );
      i++;
      continue;
    }

    // 8. Ordered List (1. item)
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").map((li) => li.replace(/^\d+\.\s*/, "").trim());
      elements.push(
        <ol key={`ol-${i}`} className="my-4 space-y-2 list-decimal list-inside text-foreground">
          {items.map((it, lIdx) => (
            <li key={lIdx} className="leading-relaxed">
              {parseInlineMarkdown(it)}
            </li>
          ))}
        </ol>
      );
      i++;
      continue;
    }

    // 9. Regular Paragraph
    elements.push(
      <p key={`p-${i}`} className="leading-relaxed text-foreground/90 my-3">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
    i++;
  }

  return elements;
}

export function BlogMarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="typeset typeset-docs max-w-[37em]">
      {renderBlogMarkdown(content)}
    </div>
  );
}
