const FENCED_CODE_BLOCK =
  /^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*$/gm;

/**
 * Rimuove i blocchi di codice recintati da un sorgente markdown.
 * Serve a conteggio parole e indice, che devono ragionare sulla sola prosa.
 */
export function stripCodeBlocks(markdown: string): string {
  return markdown.replace(FENCED_CODE_BLOCK, "");
}

/**
 * Rimuove la formattazione inline (codice, grassetto, corsivo) lasciando il testo.
 */
export function stripInlineMarkup(text: string): string {
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .trim();
}
