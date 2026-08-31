import GithubSlugger from "github-slugger";
import { stripCodeBlocks, stripInlineMarkup } from "./markdown";

export interface TocEntry {
  id: string;
  title: string;
  level: 2 | 3;
}

const HEADING_PATTERN = /^(#{2,3})\s+(.+?)\s*#*\s*$/;

/**
 * Estrae gli heading di secondo e terzo livello per l'indice dell'articolo.
 * Gli id sono generati con github-slugger, la stessa libreria usata da
 * rehype-slug, così coincidono con quelli presenti nell'HTML renderizzato.
 */
export function extractToc(markdown: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];

  for (const line of stripCodeBlocks(markdown).split("\n")) {
    const match = HEADING_PATTERN.exec(line);

    if (!match) {
      continue;
    }

    const title = stripInlineMarkup(match[2]);

    entries.push({
      id: slugger.slug(title),
      title,
      level: match[1].length as 2 | 3,
    });
  }

  return entries;
}
