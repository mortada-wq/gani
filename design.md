# Design system

## Prompt bar (hard rule)

**Prompt bar** (main frosted **face** — inner surface behind the text field and toolbar) **must use only and exactly** the following values. Do not substitute other gradients, solid fills, or token shortcuts for this surface without an explicit design update.

```css
/* Prompt bar body (canonical) */
box-sizing: border-box;
position: absolute; /* Figma: frame-anchored; in code, preserve equivalent 721×181 layout */
width: 721px;
height: 181px;
background: linear-gradient(180deg, rgba(122, 123, 123, 0.13) 0%, rgba(224, 224, 225, 0.16) 100%);
box-shadow: 0px 3px 2.3px rgba(0, 0, 0, 0.3);
border-radius: 27px;
```

### Non-negotiables

- **Background** for this face is **only** the `linear-gradient(180deg, …)` above — no other fill layer for the main prompt bar body.
- **Box shadow** and **border-radius** must match as written (treat `0px` / `0` as equivalent in code if your linter rewrites it).
- **Size** in design: **721px × 181px**; in responsive builds you may use `max-width: 721px` and `min-height: 181px` so small viewports do not break, but the same gradient, shadow, and 27px radius still apply to that face.

The **outer 1px gradient stroke** (cyan → orange) around the shell, toolbar chrome, and icon orbits are separate from this prompt bar face and are defined in component/CSS elsewhere — they are **not** a replacement for the prompt bar fill above.
