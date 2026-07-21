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
  { name: "COMPOSITIONSTACK", tag: "Companion to the blog post [Composition Stack for AI-Assisted .NET Development. A starter set of the six .md files the post describes, written for a fictional field-service app called FieldKit", meta: "2026" },
  { name: "DIGITALFIDGET", tag: "", meta: "2026" },
  { name: "QUOTECRAFT", tag: "", meta: "2026" },
  { name: "SWEATHER", tag: "", meta: "2026" },
  { name: "LIQUIDMORPH", tag: "", meta: "2026" },
  { name: "NEXUS", tag: "", meta: "2026" },
  { name: "FRIENDSONAR", tag: "", meta: "2026" },
  { name: "UNOORBIT", tag: "", meta: "2026" },
  { name: "DRIFTLINE", tag: "", meta: "2026" },
  { name: "CONFPASS", tag: "A cross-platform neumorphic conference attendee badge built with Uno Platform", meta: "2026" },
  { name: "CAROUSEL", tag: "", meta: "2026" },
  { name: "MEMORY-DRIFT", tag: "", meta: "2026" },
  { name: "RADIAL-ACTION-MENU", tag: "", meta: "2026" },
  { name: "PARALLAX-INVITATION-CARDS", tag: "", meta: "2026" },
  { name: "FIBONACCISPHERE", tag: "", meta: "2025" },
  { name: "MATRIX", tag: "", meta: "2025" },
];
