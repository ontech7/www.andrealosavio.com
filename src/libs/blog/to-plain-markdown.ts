const CALLOUT_PATTERN =
  /<Callout(?:\s+type="(\w+)")?\s*>\s*([\s\S]*?)\s*<\/Callout>/g;
const FIGURE_PATTERN = /<Figure\s+([^>]*?)\s*(?:\/>|>\s*<\/Figure>)/g;

function readAttribute(attributes: string, name: string): string | null {
  const match = new RegExp(`${name}="([^"]*)"`).exec(attributes);

  return match ? match[1] : null;
}

/**
 * Converte il corpo MDX di un articolo in markdown puro, sostituendo i
 * componenti custom con equivalenti testuali. Serve alla versione servita ai
 * crawler LLM, che devono leggere il contenuto senza rendering.
 */
export function toPlainMarkdown(body: string): string {
  return body
    .replace(
      CALLOUT_PATTERN,
      (_match, type: string | undefined, content: string) => {
        const text = content.replace(/\s*\n\s*/g, " ").trim();

        return `> **${type ?? "info"}:** ${text}`;
      }
    )
    .replace(FIGURE_PATTERN, (_match, attributes: string) => {
      const src = readAttribute(attributes, "src") ?? "";
      const alt = readAttribute(attributes, "alt") ?? "";
      const caption = readAttribute(attributes, "caption");

      return caption
        ? `![${alt}](${src})\n\n*${caption}*`
        : `![${alt}](${src})`;
    })
    .trim();
}
