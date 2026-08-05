// The lab's content, mirroring the portfolio() program from the draft.
// Pages render this server-side; the printed source below is the sitemap.

export type RegistryEntry = {
  no: string;
  name: string;
  desc: string;
  kind: 'exhibit' | 'pending' | 'shipped';
  href?: string;
};

/* One work stands in the registry. The rest were cleared out on 2026-08-04;
   each project earns its row back when it has a world to walk into. */
export const REGISTRY: RegistryEntry[] = [
  { no: '01', name: 'Poolside', desc: 'water, read like weather', kind: 'exhibit', href: '/poolside/' },
];

export type Tool = { name: string; years: number; grade: 'daily' | 'working' | 'learning' };

export const TOOLS: Tool[] = [
  { name: 'C# / .NET', years: 5, grade: 'daily' },
  { name: 'Uno Platform / XAML', years: 5, grade: 'daily' },
  { name: 'SkiaSharp / 2D GPU', years: 3, grade: 'daily' },
  { name: 'AI-assisted development', years: 3, grade: 'daily' },
  { name: 'GLSL / shaders', years: 2, grade: 'learning' },
  { name: 'Technical writing · EN / FR', years: 9, grade: 'working' },
];

export const CONTACT = {
  email: 'matthewunoplatform@gmail.com',
  github: 'github.com/mtmattei',
  city: 'Montréal, QC · EN / FR',
};


export const PROGRAM_SRC = `function portfolio() {
  // chaque pièce est une fonction
  exhibit('01', 'Poolside', 'water, read like weather');
  toolchain(linked());
  return contact();
}`;

export const CONTACT_SRC = `function contact() {
  return {
    email: '${CONTACT.email}',
    github: '${CONTACT.github}',
    city: '${CONTACT.city}',
  };
}`;

/* ---- source highlighting (port of the draft's markup/highlight) ---- */

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function markup(codePart: string): string {
  const strs: string[] = [];
  let h = esc(codePart).replace(/'[^']*'/g, (m) => {
    strs.push(m);
    return '\x00' + (strs.length - 1) + '\x00';
  });
  h = h.replace(/\b(function|const|let|for|while|if|else|return|continue|of|new)\b/g, '<b>$1</b>');
  h = h.replace(/\x00(\d+)\x00/g, (_x, n) => '<span class="st">' + strs[+n] + '</span>');
  return h;
}

function highlightLine(line: string): string {
  const m = line.match(/^(.*?)(\/\/.*)$/);
  return m ? markup(m[1]) + '<span class="cm">' + esc(m[2]) + '</span>' : markup(line);
}

/** Highlight source; lines matching a link rule become anchors. */
export function highlightSource(code: string, links: [string, string][] = []): string {
  return code
    .split('\n')
    .map((line) => {
      const h = highlightLine(line) || ' ';
      const link = links.find(([needle]) => line.includes(needle));
      if (link) {
        const ext = link[1].startsWith('http');
        return `<a class="ln" href="${link[1]}"${ext ? ' target="_blank" rel="noopener"' : ''}>${h}</a>`;
      }
      return `<span class="ln">${h}</span>`;
    })
    .join('');
}
