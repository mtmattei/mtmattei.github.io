// The lab's content, mirroring the portfolio() program from the draft.
// Pages render this server-side; the printed source below is the sitemap.

export type RegistryEntry = {
  no: string;
  name: string;
  desc: string;
  kind: 'exhibit' | 'pending' | 'shipped';
  href?: string;
};

export const REGISTRY: RegistryEntry[] = [
  { no: '01', name: 'Poolside', desc: 'water, read like weather', kind: 'exhibit', href: '/poolside/' },
  { no: '02', name: 'MomentUI', desc: 'an interface composed at runtime', kind: 'pending' },
  { no: '03', name: 'UnoAnnotation', desc: 'eyes and hands for agents', kind: 'pending' },
  { no: '04', name: 'LiquidGlassLab', desc: 'refraction on the Skia canvas', kind: 'pending' },
  { no: '05', name: 'design-ledger', desc: 'a public record of design DNA', kind: 'shipped', href: 'https://github.com/mtmattei/design-ledger' },
];

export type Galley = {
  title: string;
  sub: string;
  excerpt: string;
  count: string;
  status: 'set' | 'composing';
};

export const WRITING: Galley[] = [
  {
    title: 'Using AI in design and development',
    sub: 'How agentic tools change the craft, and what stays human.',
    excerpt:
      'The tool does not replace the hand; it changes what the hand is for. After a year of building with agents, the work that remains is exactly the work I wanted to keep: deciding what matters, and knowing why it looks right when it does.',
    count: '1,850 words · 9 min',
    status: 'set',
  },
  {
    title: 'Field notes on interfaces that feel built',
    sub: 'Evidence of a person, kept in the shipped artifact.',
    excerpt: 'A control should feel like it was placed by someone who would have to use it.',
    count: '1,200 words · 6 min',
    status: 'composing',
  },
  {
    title: 'The context window as a working-memory budget',
    sub: 'Attention economics for people who build with models.',
    excerpt: 'An agent’s context is not a transcript; it is working memory with rent due.',
    count: '2,300 words · 11 min',
    status: 'composing',
  },
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
  city: 'Montréal, QC — EN / FR',
};

/* ---- Skills (Claude Code skills authored for the XAML / Uno feel system) ---- */

export type SkillRow = { label: string; desc: string; tag?: string };
export type SkillSection = { kicker: string; blurb?: string; rows: SkillRow[] };

export type Skill = {
  slug: string;
  name: string;
  kicker: string;
  tagline: string;
  lede: string;
  install: string;
  repo: string;
  tokens: [string, string][];
  numbers?: [string, string][];
  sections: SkillSection[];
  question: string;
};

export const SKILLS: Skill[] = [
  {
    slug: 'xaml-design-polish',
    name: 'xaml-design-polish',
    kicker: 'Skill · the feel layer',
    tagline: 'Give numbers, never adjectives. "Smooth" is unbuildable; KeySpline 0.22,1 0.36,1 at 280ms is.',
    lede:
      'The motion-and-feel system for Uno Platform and WinUI surfaces. Define the feel once as tokens — easing, durations, radius, shadows — then every control inherits it. Ten rules that separate "an LLM built this" from "a person with taste built this."',
    install: 'npx skills add mtmattei/xaml-design-polish',
    repo: 'https://github.com/mtmattei/xaml-design-polish',
    tokens: [
      ['layer', 'feel'],
      ['press', 'scale 0.98'],
      ['rules', '10'],
      ['pairs with', 'userinterface-wiki-uno'],
    ],
    numbers: [
      ['easing · default', 'EaseSmooth · KeySpline 0.22,1 0.36,1'],
      ['durations', '150 fast · 200 normal · 280 slow (ms)'],
      ['press', 'scale 0.98 (0.96/0.97 superseded)'],
      ['radius', '6 · 12 · 24'],
      ['shadow', '2–8% opacity · never pure black · layered'],
    ],
    sections: [
      {
        kicker: 'The ten rules',
        blurb: 'XAML / C# / Composition native. House values are pinned; correctness of any single detail defers to userinterface-wiki-uno.',
        rows: [
          { label: 'Easing is everything', desc: 'the system default transition curve is banned for anything expressive', tag: '01' },
          { label: 'Tokens before controls', desc: 'merge MotionTokens.xaml first; forbid one-off curves, durations, radii', tag: '02' },
          { label: 'Draggable = real physics', desc: 'velocity from ManipulationDelta, momentum on release, soft springy edges', tag: '03' },
          { label: 'Two-zone snap points', desc: 'tight pull-in to lock, larger release to break free; pulse the label on catch', tag: '04' },
          { label: 'Entrances blur in', desc: 'fade + 6px rise + a 2px Composition blur that clears, ~280ms on EaseSmooth', tag: '05' },
          { label: 'Depth is layered light', desc: 'hairline ring instead of a border; stacked contact + ambient shadows', tag: '06' },
          { label: 'Press is felt', desc: 'every interactive element scales to 0.98 over the fast duration', tag: '07' },
          { label: 'Reveal height honestly', desc: 'measure-on-inner / animate-on-wrapper with clip; ConnectedAnimation across containers', tag: '08' },
          { label: 'Performance and a11y or it is not polished', desc: 'gate motion on AnimationsEnabled; Translation/Opacity/Scale over layout', tag: '09' },
          { label: 'State-driven design is the job', desc: 'a control is a system of states discovered through use, never specced up front', tag: '10' },
        ],
      },
    ],
    question: 'Can "feels right" be written down precisely enough to hand to an agent?',
  },
  {
    slug: 'userinterface-wiki-uno',
    name: 'userinterface-wiki-uno',
    kicker: 'Skill · XAML detail rules',
    tagline: 'The correctness reference behind the feel. One rule per file: a wrong example, a right example, and why.',
    lede:
      'UI/UX best practices adapted for WinUI 3, XAML, and Uno Platform. Eight categories, each a folder of single-rule files with an incorrect example, a correct example, and the reason it matters. Outputs file:line findings.',
    install: 'npx skills add mtmattei/userinterface-wiki-uno',
    repo: 'https://github.com/mtmattei/userinterface-wiki-uno',
    tokens: [
      ['layer', 'correctness'],
      ['categories', '8'],
      ['output', 'file:line'],
      ['pairs with', 'xaml-design-polish'],
    ],
    sections: [
      {
        kicker: 'Rule categories by priority',
        blurb: 'Each prefix is a folder of one-rule files. The feel layer decides how a thing should move; this layer decides whether the move is correct.',
        rows: [
          { label: 'XAML Typography', desc: 'tabular nums, variable fonts, line height, trimming, character spacing', tag: 'type-xaml' },
          { label: 'Transitions & Exit', desc: 'ThemeTransition, ConnectedAnimation, mirror-the-entrance exits', tag: 'exit-xaml' },
          { label: 'Visual States & Overlays', desc: 'VisualStateManager, GoToState, pointer states, hit targets', tag: 'state-xaml' },
          { label: 'Layout Animation', desc: 'implicit animation, springs, clip-during-resize, measure/animate split', tag: 'layout-xaml' },
          { label: 'Data Prefetching', desc: 'pointer trajectory, prefetch on focus, incremental loading, touch fallback', tag: 'prefetch-xaml' },
          { label: 'Animated Icons', desc: 'AnimatedIcon, Lottie player, reduced-motion, fallback source', tag: 'icon-xaml' },
          { label: 'XAML Audio', desc: 'MediaPlayer lifecycle, preload, subtle volume, accessibility toggle', tag: 'audio-xaml' },
          { label: 'Visual Design', desc: 'concentric radius, ThemeShadow direction, spacing scale, elevation', tag: 'visual-xaml' },
        ],
      },
    ],
    question: 'If a state cannot be named, is the design finished?',
  },
  {
    slug: 'winui-xaml',
    name: 'winui-xaml',
    kicker: 'Skill · XAML correctness',
    tagline: 'Twelve categories, ordered by impact. From crash-class to polish, validated against WinUI 3 and Uno Platform.',
    lede:
      'WinUI 3 and XAML fundamentals: layout, binding, async, collections, rendering, memory, accessibility, and localization. Every pattern carries a rule, a rationale with measurable impact, a correct example, and Uno Platform notes.',
    install: 'npx skills add mtmattei/winui-xaml',
    repo: 'https://github.com/mtmattei/winui-xaml',
    tokens: [
      ['layer', 'fundamentals'],
      ['categories', '12'],
      ['x:Bind', '3x faster'],
      ['scope', 'WinUI 3 · Uno'],
    ],
    numbers: [
      ['never block', 'the UI thread — async/await for all I/O'],
      ['x:Bind over Binding', 'compile-time checked · ~3x faster'],
      ['virtualize', 'any list over 20 items'],
      ['unsubscribe', 'handlers in Unloaded to prevent leaks'],
      ['Grid over StackPanels', 'one layout pass, not many'],
    ],
    sections: [
      {
        kicker: 'Categories by impact',
        blurb: 'CRITICAL can crash, freeze, or leak. HIGH is a noticeable 100ms+ hit. MEDIUM is polish and responsiveness.',
        rows: [
          { label: 'Async & Threading', desc: 'UI thread, DispatcherQueue, parallelization', tag: 'CRITICAL' },
          { label: 'Collections & Virtualization', desc: 'ListView, ItemsRepeater, incremental loading', tag: 'CRITICAL' },
          { label: 'XAML Loading', desc: 'x:Load, deferred loading, startup optimization', tag: 'CRITICAL' },
          { label: 'Layout', desc: 'panel selection, visual tree depth, responsive design', tag: 'HIGH' },
          { label: 'Binding', desc: 'x:Bind vs Binding, modes, function binding', tag: 'HIGH' },
          { label: 'Memory Management', desc: 'event handlers, leaks, resource cleanup', tag: 'HIGH' },
          { label: 'Accessibility', desc: 'AutomationProperties, keyboard navigation', tag: 'HIGH' },
          { label: 'Rendering & Composition', desc: 'Composition APIs, animations, caching', tag: 'MED-HIGH' },
          { label: 'Navigation', desc: 'Frame caching, page lifecycle', tag: 'MED-HIGH' },
          { label: 'Localization', desc: 'x:Uid, .resw files, runtime switching', tag: 'MEDIUM' },
          { label: 'Styles & Theming', desc: 'ResourceDictionary, ThemeDictionaries, lightweight styling', tag: 'MEDIUM' },
          { label: 'Input & Interaction', desc: 'touch targets, gesture handling', tag: 'MEDIUM' },
        ],
      },
    ],
    question: 'Can most of "feels right" be proven by a compiler? More than you would think.',
  },
];

export function skillBySlug(slug: string): Skill | undefined {
  return SKILLS.find((s) => s.slug === slug);
}

export const PROGRAM_SRC = `function portfolio() {
  // chaque pièce est une fonction
  exhibit('01', 'Poolside', 'water, read like weather');
  pending('02', 'MomentUI', 'an interface composed at runtime');
  pending('03', 'UnoAnnotation', 'eyes and hands for agents');
  pending('04', 'LiquidGlassLab', 'refraction on the Skia canvas');
  shipped('05', 'design-ledger', 'a public record of design DNA');
  texts(writing());
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
