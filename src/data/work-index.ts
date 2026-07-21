/* The work index: every public, non-fork repo, listed only.
   Descriptions and years are GitHub's own, verbatim - most have no
   description yet, and those rows carry an em dash until one is written.
   These rows have no destination and no billboard art: they sit in the
   index until each gets a world. */
export type WorkRow = { name: string; tag: string; meta: string };

export const WORK_ROWS: WorkRow[] = [
  { name: "APPMAP", tag: "Render an Uno Platform app's full navigation structure as an interactive canvas", meta: "2026" },
  { name: "UNOCOMPOSER", tag: "", meta: "2026" },
  { name: "DESIGN-LEDGER", tag: "A non-repetition layer for AI design generators: wrap any design skill in a persistent fingerprint ledger + collision gate so every result is provably unique across all prior generations.", meta: "2026" },
  { name: "UNO-BUILDS-NET10", tag: "Uno-Builds projects upgraded to Uno.Sdk 6.5.33 / .NET 10 — see UPGRADE-SPEC.md", meta: "2026" },
  { name: "UNO-SAMPLE-GALLERY", tag: "", meta: "2026" },
  { name: "MERIDIAN", tag: "", meta: "2026" },
  { name: "COMPOSITION STACK", tag: "Companion to the blog post [Composition Stack for AI-Assisted .NET Development. A starter set of the six .md files the post describes, written for a fictional field-service app called FieldKit", meta: "2026" },
  { name: "DIGITALFIDGET", tag: "", meta: "2026" },
  { name: "QUOTECRAFT", tag: "", meta: "2026" },
  { name: "SWEATHER", tag: "Worn — weather by wardrobe: what the forecast means for what you put on", meta: "2026" },
  { name: "LIQUID MORPH", tag: "", meta: "2026" },
  { name: "NEXUS", tag: "", meta: "2026" },
  { name: "FRIEND SONAR", tag: "A mobile-first Find My Friends app with a retro submarine sonar aesthetic — friends plotted on an animated phosphor-green radar", meta: "2026" },
  { name: "UNOORBIT", tag: "", meta: "2026" },
  { name: "DRIFTLINE", tag: "", meta: "2026" },
  { name: "CONFERENCE PASS", tag: "Neumorphic", meta: "2026" },
  { name: "CAROUSEL", tag: "", meta: "2026" },
  { name: "MEMORY-DRIFT", tag: "", meta: "2026" },
  { name: "RADIAL-ACTION-MENU", tag: "A reusable, animated radial action menu control for Uno Platform applications", meta: "2026" },
  { name: "PARALLAX-INVITATION-CARDS", tag: "", meta: "2026" },
  { name: "FIBONACCISPHERE", tag: "An interactive 3D Fibonacci sphere in C# and XAML, with live controls for point interaction, animation speed, wobble and motion trails", meta: "2025" },
  { name: "MATRIX", tag: "A reusable page transition inspired by The Matrix digital rain: characters cascade over the outgoing page, then fall away to reveal the incoming one", meta: "2025" },
];
