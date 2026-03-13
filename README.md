# @page-speed/skins

Lightweight JSON-based skin system for platform-wide component styling. CDN-accessible configuration files for video players, carousels, and more.

## Features

- **JSON-First**: Pure declarative skins (no runtime JavaScript overhead)
- **CDN-Accessible**: Load skins directly from jsDelivr
- **Tailwind-Friendly**: Uses Tailwind classes and CSS variables
- **Component Agnostic**: Supports video players, carousels, and any component
- **Type-Safe**: Full TypeScript support
- **Tiny Runtime**: Minimal JavaScript footprint
- **Extensible**: Easy to add new component types and skins
- **Cacheable**: Built-in memory caching for loaded skins

## Installation

```bash
npm install @page-speed/skins
# or
pnpm add @page-speed/skins
# or
yarn add @page-speed/skins
```

## Quick Start

### Load a Skin from CDN

```typescript
import { loadSkinFromJsDelivr } from '@page-speed/skins';

// Load the base video skin
const skin = await loadSkinFromJsDelivr('0.1.0', 'skins/video/base.json');

console.log(skin.name);     // "Base Video Skin"
console.log(skin.tokens);   // CSS variables
console.log(skin.classes);  // Tailwind classes
```

### Apply Skin to an Element

```typescript
import { applySkinToElement } from '@page-speed/skins';

const videoContainer = document.getElementById('video-container');
applySkinToElement(videoContainer, skin);

// Now the element has:
// - CSS variables set via style.setProperty
// - data-skin-id, data-skin-version attributes
```

### Use with React Video Component

```typescript
import { Video } from '@page-speed/video';
import { getVideoSkinAttributes } from '@page-speed/skins';

const skin = await loadSkinFromJsDelivr('0.1.0', 'skins/video/linear-inspired.json');
const attrs = getVideoSkinAttributes(skin);

<Video
  src="video.mp4"
  {...attrs}
/>
```

## Available Skins

### Video Player Skins

| Skin | File | Description |
|------|------|-------------|
| **Base** | `skins/video/base.json` | Minimal base skin with essential styling |
| **Linear-Inspired** | `skins/video/linear-inspired.json` | Clean, modern design inspired by Linear |
| **Minimal Hover** | `skins/video/minimal-hover.json` | Controls appear on hover |
| **Social Card** | `skins/video/social-card.json` | Optimized for social media embeds |
| **YouTube Classic** | `skins/video/youtube-classic.json` | Familiar YouTube-style design |

### CDN URLs (jsDelivr)

```
https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/base.json
https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/linear-inspired.json
https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/minimal-hover.json
https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/social-card.json
https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/youtube-classic.json
```

## API Reference

### Core Types

#### SkinDefinition

```typescript
interface SkinDefinition {
  id: string;              // Unique identifier
  name: string;            // Human-readable name
  version: string;         // Semantic version
  targets: string[];       // Component types: ["video"]
  tokens: SkinTokens;      // CSS variables
  classes: SkinClasses;    // Tailwind/CSS classes
  assets?: SkinAssets;     // Optional icons/images
  description?: string;    // Optional description
  metadata?: object;       // Optional metadata
}
```

### Runtime Functions

#### applySkinToElement(element, skin)

Applies a complete skin to an HTML element.

```typescript
const container = document.getElementById('my-container');
applySkinToElement(container, skin);
```

#### resolveClasses(skin, slot)

Gets classes for a specific slot.

```typescript
const playButtonClasses = resolveClasses(skin, 'playButton');
// "flex items-center justify-center w-10 h-10 ..."
```

#### getSkinStyleObject(skin)

Gets CSS variables as a style object (useful for React).

```typescript
const styleObj = getSkinStyleObject(skin);
// { "--video-bg": "#000", "--video-accent-color": "#3b82f6", ... }

<div style={styleObj}>...</div>
```

### Video Adapter

#### getVideoSkinAttributes(skin)

Gets all attributes for a `<video>` element.

```typescript
const attrs = getVideoSkinAttributes(skin);
// {
//   className: "w-full h-full object-contain",
//   style: { "--video-bg": "#000", ... },
//   "data-skin-id": "video-base",
//   ...
// }

<video {...attrs} src="video.mp4" />
```

#### resolveVideoClasses(skin)

Gets all video-specific classes.

```typescript
const classes = resolveVideoClasses(skin);
// {
//   container: "relative w-full ...",
//   video: "w-full h-full ...",
//   controlsBar: "absolute bottom-0 ...",
//   playButton: "flex items-center ...",
//   ...
// }
```

### Utilities

#### loadSkin(options)

Loads a skin from any URL with caching.

```typescript
const skin = await loadSkin({
  url: 'https://example.com/skin.json',
  cache: true,
  timeout: 10000,
  debug: false,
});
```

#### loadSkinFromJsDelivr(version, path)

Convenience wrapper for jsDelivr CDN.

```typescript
const skin = await loadSkinFromJsDelivr(
  '0.1.0',
  'skins/video/base.json'
);
```

#### preloadSkins(urls)

Preloads multiple skins in parallel.

```typescript
await preloadSkins([
  'https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/base.json',
  'https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/linear-inspired.json',
]);
```

## Usage Patterns

### 1. Direct CDN Load (Vanilla JS)

```javascript
fetch('https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/base.json')
  .then(r => r.json())
  .then(skin => {
    const video = document.querySelector('video');
    Object.entries(skin.tokens).forEach(([key, value]) => {
      video.style.setProperty(`--${key}`, value);
    });
  });
```

### 2. React Component

```tsx
import { useEffect, useState } from 'react';
import { loadSkinFromJsDelivr, getVideoSkinAttributes } from '@page-speed/skins';
import { Video } from '@page-speed/video';

function VideoWithSkin() {
  const [skin, setSkin] = useState(null);

  useEffect(() => {
    loadSkinFromJsDelivr('0.1.0', 'skins/video/linear-inspired.json')
      .then(setSkin);
  }, []);

  if (!skin) return <div>Loading skin...</div>;

  const attrs = getVideoSkinAttributes(skin);

  return (
    <Video
      src="video.mp4"
      {...attrs}
    />
  );
}
```

### 3. Custom Controls Wrapper

```tsx
import { resolveVideoClasses, getSkinStyleObject } from '@page-speed/skins';

function VideoPlayer({ skin, src }) {
  const classes = resolveVideoClasses(skin);
  const style = getSkinStyleObject(skin);

  return (
    <div className={classes.container} style={style}>
      <video className={classes.video} src={src} />

      <div className={classes.controlsBar}>
        <button className={classes.playButton}>Play</button>
        <div className={classes.timeline}>
          <div className={classes.timelineProgress} />
        </div>
        <span className={classes.timeText}>0:00 / 5:23</span>
      </div>
    </div>
  );
}
```

### 4. Dynamic Skin Switching

```tsx
const [currentSkin, setCurrentSkin] = useState('base');

const skinUrls = {
  base: 'skins/video/base.json',
  linear: 'skins/video/linear-inspired.json',
  minimal: 'skins/video/minimal-hover.json',
};

const skin = await loadSkinFromJsDelivr('0.1.0', skinUrls[currentSkin]);
```

## Creating Custom Skins

### Skin JSON Structure

```json
{
  "id": "my-custom-skin",
  "name": "My Custom Skin",
  "version": "1.0.0",
  "targets": ["video"],
  "tokens": {
    "--video-bg": "#000000",
    "--video-accent-color": "#3b82f6"
  },
  "classes": {
    "container": "relative w-full bg-black",
    "video": "w-full h-full",
    "playButton": "flex items-center justify-center w-10 h-10"
  },
  "assets": {
    "playIcon": "data:image/svg+xml,..."
  }
}
```

### Video Skin Slots

Standard slots for video players:

- `container` - Wrapper element
- `video` - Video element itself
- `controlsBar` - Controls container
- `playButton` - Play/pause button
- `timeline` - Progress bar
- `timelineProgress` - Progress indicator
- `timelineBuffered` - Buffered indicator
- `timeText` - Time display
- `volumeControl` - Volume control
- `fullscreenButton` - Fullscreen button
- `settingsButton` - Settings button
- `loadingSpinner` - Loading indicator
- `playOverlay` - Large play button overlay

## CDN Delivery

### jsDelivr (Recommended)

```
https://cdn.jsdelivr.net/npm/@page-speed/skins@{version}/{path}
```

**Examples**:
```
https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/base.json
https://cdn.jsdelivr.net/npm/@page-speed/skins@latest/skins/video/linear-inspired.json
```

### unpkg (Alternative)

```
https://unpkg.com/@page-speed/skins@{version}/{path}
```

### Direct Import (ES Modules)

```typescript
import baseSkin from '@page-speed/skins/skins/video/base.json';
```

## Performance

### Bundle Size

- **Runtime Code**: ~2 KB gzipped
- **Each Skin JSON**: ~1-3 KB
- **Total Impact**: Minimal (JSON is cheap)

### Caching Strategy

1. **Memory Cache**: Loaded skins cached in JavaScript
2. **CDN Cache**: jsDelivr caches files at edge
3. **Browser Cache**: Standard HTTP caching headers

### Best Practices

- ✅ Preload skins during app initialization
- ✅ Use memory caching for frequently used skins
- ✅ Load from CDN (don't bundle all skins)
- ✅ Consider lazy loading for theme switchers

## Browser Support

- **Modern Browsers**: Full support
- **ES Modules**: Required
- **Fetch API**: Required
- **CSS Variables**: Required
- **Fallback**: Provide default styles for old browsers

## TypeScript

Full TypeScript support with strict types:

```typescript
import type { SkinDefinition, VideoSkinSlots } from '@page-speed/skins';

const skin: SkinDefinition = {
  id: 'my-skin',
  name: 'My Skin',
  version: '1.0.0',
  targets: ['video'],
  tokens: {},
  classes: {},
};
```

## Future Component Types

The system is designed to support any component type:

```json
{
  "targets": ["carousel"],
  "classes": {
    "container": "...",
    "slide": "...",
    "navButton": "...",
    "indicator": "..."
  }
}
```

## Contributing

1. Add new skin JSON to `skins/{component-type}/{skin-name}.json`
2. Run validation: `pnpm run validate:skins`
3. Add export to `package.json` exports map
4. Update documentation
5. Submit PR

## License

BSD-3-Clause

## Author

OpenSite AI (https://opensite.ai)
