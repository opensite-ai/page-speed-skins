# CDN Usage Guide

## Overview

The `@page-speed/skins` package is designed for **direct CDN access** to skin JSON files, making it perfect for runtime skin loading without bundling.

## jsDelivr CDN URLs

### Base URL Pattern

```
https://cdn.jsdelivr.net/npm/@page-speed/skins@{version}/{path}
```

### Available Video Skins

| Skin | jsDelivr URL |
|------|--------------|
| **Base** | `https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/base.json` |
| **Linear-Inspired** | `https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/linear-inspired.json` |
| **Minimal Hover** | `https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/minimal-hover.json` |
| **Social Card** | `https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/social-card.json` |
| **YouTube Classic** | `https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/youtube-classic.json` |

### Using @latest

```
https://cdn.jsdelivr.net/npm/@page-speed/skins@latest/skins/video/base.json
```

**Recommended**: Pin to specific version for production stability.

## CDN Usage Examples

### 1. Vanilla JavaScript

```html
<video id="my-video" controls></video>

<script type="module">
  const skinUrl = 'https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/base.json';

  fetch(skinUrl)
    .then(r => r.json())
    .then(skin => {
      const video = document.getElementById('my-video');

      // Apply CSS variables
      Object.entries(skin.tokens).forEach(([key, value]) => {
        const cssVar = key.startsWith('--') ? key : `--${key}`;
        video.style.setProperty(cssVar, value);
      });

      // Apply classes
      if (skin.classes.video) {
        video.className = skin.classes.video;
      }

      console.log('Skin applied:', skin.name);
    });
</script>
```

### 2. React/Next.js

```tsx
import { useEffect, useState } from 'react';

function VideoPlayer() {
  const [skin, setSkin] = useState(null);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/linear-inspired.json')
      .then(r => r.json())
      .then(setSkin);
  }, []);

  if (!skin) return <div>Loading...</div>;

  return (
    <video
      className={skin.classes.video}
      style={Object.fromEntries(
        Object.entries(skin.tokens).map(([k, v]) => [
          k.startsWith('--') ? k : `--${k}`,
          v
        ])
      )}
      src="video.mp4"
      controls
    />
  );
}
```

### 3. Using the Utility Package

```typescript
import { loadSkinFromJsDelivr, getVideoSkinAttributes } from '@page-speed/skins';

const skin = await loadSkinFromJsDelivr('0.1.0', 'skins/video/base.json');
const attrs = getVideoSkinAttributes(skin);

<video {...attrs} src="video.mp4" />
```

## CDN Advantages

### ✅ Benefits

1. **No Bundling**: Skins loaded at runtime, not bundled
2. **Dynamic Loading**: Switch skins without redeploying
3. **Caching**: CDN edge caching for instant loads
4. **Versioning**: Immutable URLs with version pinning
5. **Global Availability**: jsDelivr has worldwide CDN
6. **Zero Build Step**: Direct JSON access

### Performance

- **First Load**: ~50-100ms (CDN fetch)
- **Cached Load**: ~5-10ms (browser cache)
- **File Size**: 1-5 KB per skin (tiny!)
- **Bandwidth**: Minimal (JSON is cheap)

## CDN Features

### jsDelivr Features

- ✅ Global CDN with 100+ POPs
- ✅ Automatic minification for JSON
- ✅ Version aliasing (@latest, @0.x, @0.1.x)
- ✅ Load balancing and fallbacks
- ✅ Free for open source packages
- ✅ HTTP/2 and HTTP/3 support

### Cache Headers

jsDelivr automatically sets:
```
Cache-Control: public, max-age=31536000, immutable
```

Skins are cached for 1 year (safe because versioned).

## Alternative CDNs

### unpkg

```
https://unpkg.com/@page-speed/skins@0.1.0/skins/video/base.json
```

### Skypack (ES Modules)

```javascript
import { loadSkinFromJsDelivr } from 'https://cdn.skypack.dev/@page-speed/skins@0.1.0';
```

## Version Strategies

### 1. Pin to Specific Version (Recommended for Production)

```
@0.1.0  → Exact version
```

**Pros**: Predictable, immutable
**Cons**: Manual updates needed

### 2. Pin to Minor Version

```
@0.1    → Latest 0.1.x
@0      → Latest 0.x.x
```

**Pros**: Auto bug fixes
**Cons**: Potential breaking changes

### 3. Use Latest

```
@latest → Latest version
```

**Pros**: Always up to date
**Cons**: Unpredictable changes

## Preloading for Performance

### Link Preload

```html
<link
  rel="preload"
  as="fetch"
  href="https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/base.json"
  crossorigin="anonymous"
>
```

### JavaScript Preload

```javascript
// Preload multiple skins
Promise.all([
  fetch('https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/base.json'),
  fetch('https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/linear-inspired.json'),
]).then(responses => Promise.all(responses.map(r => r.json())))
  .then(skins => {
    window.preloadedSkins = skins;
  });
```

## Error Handling

### Network Failures

```javascript
fetch(skinUrl)
  .then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then(skin => applySkin(skin))
  .catch(err => {
    console.error('Failed to load skin:', err);
    // Fall back to default/inline styles
  });
```

### Invalid JSON

```javascript
try {
  const skin = await loadSkinFromJsDelivr('0.1.0', 'skins/video/base.json');
  if (!isValidSkin(skin)) {
    throw new Error('Invalid skin format');
  }
  // Use skin
} catch (err) {
  // Handle error
}
```

## Content Security Policy (CSP)

If using CSP, allow jsDelivr:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    connect-src 'self' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline';
  "
>
```

## CORS

jsDelivr serves files with proper CORS headers:
```
Access-Control-Allow-Origin: *
```

No CORS issues when loading from any domain.

## Verification

### Check Skin is Available

```bash
curl https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/base.json
```

### Check Package Files

```bash
curl https://data.jsdelivr.com/v1/package/npm/@page-speed/skins@0.1.0
```

Returns list of all files in the package.

## Custom CDN Setup

### Self-Hosting

1. Download package: `npm pack @page-speed/skins`
2. Extract skins directory
3. Host on your CDN
4. Update URLs in your code

### Private npm Registry

If using private npm registry:
```
https://your-cdn.com/npm/@page-speed/skins@0.1.0/skins/video/base.json
```

## Best Practices

1. ✅ **Version Pinning**: Use specific versions in production
2. ✅ **Preloading**: Preload skins during app initialization
3. ✅ **Fallbacks**: Always have fallback styles
4. ✅ **Validation**: Validate skin format after loading
5. ✅ **Caching**: Leverage CDN and browser caching
6. ✅ **Error Handling**: Handle network failures gracefully

## Integration with @page-speed/video

The `@page-speed/video` component can use skins loaded from CDN:

```typescript
import { Video } from '@page-speed/video';
import { loadSkinFromJsDelivr, getVideoSkinAttributes } from '@page-speed/skins';

const skin = await loadSkinFromJsDelivr('0.1.0', 'skins/video/linear-inspired.json');
const attrs = getVideoSkinAttributes(skin);

<Video src="video.mp4" {...attrs} />
```

## Summary

CDN delivery via jsDelivr makes `@page-speed/skins` perfect for:

- ✅ Runtime skin loading
- ✅ Dynamic theming
- ✅ No build overhead
- ✅ Global availability
- ✅ Instant updates (with version control)
- ✅ Minimal bandwidth

**CDN Status**: ✅ **READY** (after npm publish)
