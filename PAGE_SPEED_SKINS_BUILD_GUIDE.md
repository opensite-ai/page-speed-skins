## Build Guide C — `@page-speed/skins` (Step-by-step)

### C0) Goals

- Tiny runtime + JSON-first skins.
- Not video-only: generic “skinnable component” descriptors.
- CDN delivery via jsDelivr using npm package files.[^6]


### C1) Define a skin JSON schema

Create `src/schema.ts`:

- `SkinDefinition`:
    - `id`, `name`, `version`
    - `targets: string[]` (e.g., `["video"]`, later `["carousel"]`)
    - `tokens`: CSS variables (key-value)
    - `classes`: mapping of semantic slots → Tailwind class strings
        - Example slots for video UI (for wrappers that *can* render UI):
            - `container`, `video`, `controlsBar`, `playButton`, `timeline`, `timeText`, etc.
    - `assets`: optional URLs (icons)

This maps well to your Tailwind-first environment and allows “no size cost” because JSON is cheap.

### C2) Runtime: applySkin()

Create `src/runtime/applySkin.ts`:

- `applySkinToElement(el, skin)`:
    - set CSS variables (`style.setProperty`)
    - set `data-skin-id`, `data-skin-version`
- `resolveClasses(slot)` returns string.


### C3) Video-specific adapter (optional helper)

Because `Video` must return `<video>` only, provide helpers that can be used by external wrappers:

- `getVideoSkinAttributes(skin)` → `{ className, style, "data-*": ... }` to apply to `<video>` itself.


### C4) Ship example skins as JSON files

Put files in:

- `skins/video/base.json`
- `skins/video/linear-inspired.json` (inspired by your skin-example-1 structure)[^7]
- `skins/video/minimal-hover.json` (inspired by skin-example-2)[^8]
- `skins/video/social-card.json` (inspired by skin-example-3)[^9]

Keep them purely declarative (classes/tokens), not React code.

### C5) jsDelivr distribution

Once published to npm, consumers can fetch:

- `https://cdn.jsdelivr.net/npm/@page-speed/skins@<version>/skins/video/base.json`[^6]
This matches your goal of CDN-loadable skin JSON.


### C6) Consumer integration pattern

1. App loads skin JSON from jsDelivr at runtime.
2. App renders:
    - `<Video ... className={skin.classes.video} style={...vars} />`
    - Optional `<VideoControlsOverlay />` component in app code (or separate optional package export) using the same skin slots.

***