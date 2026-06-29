# DBS U-Shape Spec Calculator

Browser-based production tool for **Drawer Box Specialties** U-shape drawer box cut specifications. Generates live SVG previews and landscape 2-up printable shop sheets.

## Quick start

1. Open `index.html` in a modern browser, **or** serve locally:
   ```bash
   python -m http.server 8080
   ```
2. Select construction mode, enter dimensions (fractions like `19 1/2` supported).
3. Add items to the queue → **Print Queue** for shop floor specs.

## Construction modes

| Mode | Description |
|------|-------------|
| **Dovetail** | Full dovetail sides/back |
| **Dowel** | Dowel construction |
| **Hybrid** | Dovetail front / dowel back |
| **3/4" Front** | Fixed 3/4" front panel with lip overlays |

## Material thicknesses

12mm, 1/2", **15mm**, 5/8", 3/4" — each with shop-verified deduction values in `formulas.js`.

## Project structure

```
formulas.js          ← Manufacturing math (single source of truth)
app.js               ← Application entry point
js/
  utils.js           ← parseFraction, fmt, escapeHTML
  validation.js      ← Input validation (same rules as production)
  svg.js             ← Blueprint SVG rendering
  queue.js           ← Queue storage, print batch rendering
  modes.js           ← Construction mode theming
  ui.js              ← Spec readout, toasts, chrome
  labels.js          ← Mode/print label helpers
  state.js           ← Shared app state
tests/
  formulas.test.mjs  ← Formula regression tests
index.html           ← UI shell + print CSS
```

## Running tests

Requires Node.js 18+:

```bash
npm test
```

Key verified case: **15mm dovetail, D=21 → side length 20.444**.

## Queue backup

- **Export** — downloads queue as JSON
- **Import** — restores queue from JSON
- Queue also persists in `localStorage` automatically

## Keyboard shortcut

**Ctrl+Enter** (Cmd+Enter on Mac) — add to queue when form is valid.

## Print layout

Print CSS uses landscape 2-up grid with:
- Batch header (mode, label, QTY, W/D/H)
- Production notes (hybrid, 3/4" front, auto-flush)
- SVG dimension annotations

Do not modify `@media print` rules without verifying physical print output.

## Backup

Pre-15mm snapshot: see `DBS-U-Shape-Spec-Calculator-pre-15mm-backup` in Downloads (local copy).

## License

Internal DBS production tool.
