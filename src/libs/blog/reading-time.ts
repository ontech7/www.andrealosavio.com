import { stripCodeBlocks } from "./markdown";

const WORDS_PER_MINUTE = 200;

/**
 * Conta le parole di sola prosa: esclude blocchi di codice, codice inline,
 * tag JSX, URL dei link e sintassi markdown.
 */
export function countProseWords(markdown: string): number {
  const prose = stripCodeBlocks(markdown)
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|-]+/g, " ");

  return prose.split(/\s+/).filter(Boolean).length;
}

/**
 * Minuti di lettura stimati, arrotondati per eccesso, mai sotto uno.
 */
export function readingTimeMinutes(markdown: string): number {
  return Math.max(1, Math.ceil(countProseWords(markdown) / WORDS_PER_MINUTE));
}
