/**
 * Next 13's bundled types declare `*.module.css` but not plain `*.css`.
 * TypeScript only started type-checking side-effect imports recently, so
 * `import './globals.css'` in app/layout.tsx reports ts(2882) in any editor
 * running a newer compiler than the 5.2.2 pinned in package.json.
 *
 * Plain CSS imports in Next are side-effect only — they export nothing — so an
 * empty module body is the accurate declaration. Safe to delete once Next's own
 * types cover it.
 */
declare module '*.css' {}
