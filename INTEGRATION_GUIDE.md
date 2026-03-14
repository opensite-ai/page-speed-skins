# Skins Integration Guide

## Overview

The `@page-speed/skins` system provides JSON-based styling for video players and other components. This guide explains how to properly integrate skins with the `@page-speed/video` components.

## Key Concepts

### Skin Architecture

Skins define styling through three main elements:

1. **Tokens** - CSS custom properties (variables) for theming
2. **Classes** - Tailwind/CSS classes for component slots
3. **Assets** - Optional icons, images, etc.

### Component Slots

Video player skins define styles for multiple UI elements (slots):

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
- `playOverlay` - Large play button overlay
- `playOverlayButton` - Play overlay button styles

## Available Components

### 1. Video (Basic)

Simple `<video>` element wrapper with HLS streaming support. Uses **native browser controls**.

```tsx
import { Video } from '@page-speed/video';

<Video
  src="video.mp4"
  controls
/>
```

**Note**: This component does NOT support custom skins because it uses native controls.

### 2. VideoPlayer (Custom Controls)

Full-featured video player with **custom controls** that support skins.

```tsx
import { VideoPlayer } from '@page-speed/video';
import { loadSkinFromJsDelivr, resolveVideoClasses, getSkinStyleObject } from '@page-speed/skins';

const skin = await loadSkinFromJsDelivr('0.1.0', 'skins/video/linear-inspired.json');
const skinClasses = resolveVideoClasses(skin);
const skinStyle = getSkinStyleObject(skin);

<VideoPlayer
  src="video.mp4"
  skinClasses={skinClasses}
  skinStyle={skinStyle}
/>
```

### 3. VideoWithSkin (Easiest)

Convenience component that handles skin integration automatically.

```tsx
import { VideoWithSkin } from '@page-speed/video';
import { loadSkinFromJsDelivr } from '@page-speed/skins';

const skin = await loadSkinFromJsDelivr('0.1.0', 'skins/video/linear-inspired.json');

<VideoWithSkin
  src="video.mp4"
  skin={skin}
/>
```

## Integration Patterns

### Pattern 1: Server Component (Next.js)

Load skins at build time or in server components:

```tsx
import { VideoPlayer } from '@page-speed/video';
import { loadSkinFromJsDelivr, resolveVideoClasses, getSkinStyleObject } from '@page-speed/skins';

export default async function VideoPage() {
  const skin = await loadSkinFromJsDelivr(
    '0.1.0',
    'skins/video/linear-inspired.json'
  );

  const skinClasses = resolveVideoClasses(skin);
  const skinStyle = getSkinStyleObject(skin);

  return (
    <VideoPlayer
      masterPlaylistUrl="https://example.com/video.m3u8"
      fallbackSrc="https://example.com/video.mp4"
      poster="https://example.com/poster.jpg"
      skinClasses={skinClasses}
      skinStyle={skinStyle}
    />
  );
}
```

### Pattern 2: Client Component with Loading

Load skins on the client side:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { VideoWithSkin } from '@page-speed/video';
import { loadSkinFromJsDelivr } from '@page-speed/skins';
import type { SkinDefinition } from '@page-speed/skins';

export function VideoWithDynamicSkin() {
  const [skin, setSkin] = useState<SkinDefinition | null>(null);

  useEffect(() => {
    loadSkinFromJsDelivr('0.1.0', 'skins/video/linear-inspired.json')
      .then(setSkin)
      .catch(console.error);
  }, []);

  if (!skin) {
    return <div>Loading video player...</div>;
  }

  return (
    <VideoWithSkin
      src="video.mp4"
      skin={skin}
    />
  );
}
```

### Pattern 3: Dynamic Skin Switching

Allow users to switch between different skins:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { VideoWithSkin } from '@page-speed/video';
import { loadSkinFromJsDelivr } from '@page-speed/skins';
import type { SkinDefinition } from '@page-speed/skins';

const SKIN_OPTIONS = {
  linear: 'skins/video/linear-inspired.json',
  minimal: 'skins/video/minimal-hover.json',
  social: 'skins/video/social-card.json',
} as const;

export function VideoWithSkinSwitcher() {
  const [skinName, setSkinName] = useState<keyof typeof SKIN_OPTIONS>('linear');
  const [skin, setSkin] = useState<SkinDefinition | null>(null);

  useEffect(() => {
    loadSkinFromJsDelivr('0.1.0', SKIN_OPTIONS[skinName])
      .then(setSkin)
      .catch(console.error);
  }, [skinName]);

  return (
    <div>
      <div className="mb-4">
        {Object.keys(SKIN_OPTIONS).map((name) => (
          <button
            key={name}
            onClick={() => setSkinName(name as keyof typeof SKIN_OPTIONS)}
            className={skinName === name ? 'font-bold' : ''}
          >
            {name}
          </button>
        ))}
      </div>

      {skin && (
        <VideoWithSkin
          src="video.mp4"
          skin={skin}
        />
      )}
    </div>
  );
}
```

### Pattern 4: Preloading Skins

Preload multiple skins for better performance:

```tsx
import { preloadSkins } from '@page-speed/skins';

// In app initialization
await preloadSkins([
  'https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/base.json',
  'https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/linear-inspired.json',
  'https://cdn.jsdelivr.net/npm/@page-speed/skins@0.1.0/skins/video/minimal-hover.json',
]);
```

## Available Skins

### 1. Base
**File**: `skins/video/base.json`
**Description**: Minimal base skin with essential styling
**Best For**: Starting point for custom skins

### 2. Linear-Inspired
**File**: `skins/video/linear-inspired.json`
**Description**: Clean, modern design inspired by Linear
**Best For**: Professional, modern websites
**Colors**: Purple/violet accent (#8b5cf6), dark backgrounds

### 3. Minimal Hover
**File**: `skins/video/minimal-hover.json`
**Description**: Controls appear on hover
**Best For**: Distraction-free viewing

### 4. Social Card
**File**: `skins/video/social-card.json`
**Description**: Optimized for social media embeds
**Best For**: Social sharing, compact displays

### 5. YouTube Classic
**File**: `skins/video/youtube-classic.json`
**Description**: Familiar YouTube-style design
**Best For**: Users familiar with YouTube interface

## API Reference

### VideoPlayer Props

```typescript
interface VideoPlayerProps extends VideoProps {
  skinClasses?: {
    container?: string;
    video?: string;
    controlsBar?: string;
    playButton?: string;
    timeline?: string;
    timelineProgress?: string;
    timelineBuffered?: string;
    timeText?: string;
    volumeControl?: string;
    fullscreenButton?: string;
    playOverlay?: string;
    playOverlayButton?: string;
  };
  skinStyle?: Record<string, string>;
  useNativeControls?: boolean;
}
```

### VideoWithSkin Props

```typescript
interface VideoWithSkinProps extends VideoProps {
  skin?: SkinDefinition | null;
  forceNativeControls?: boolean;
}
```

### Skin Functions

#### resolveVideoClasses(skin)

Extracts all video-related classes from a skin.

```typescript
const classes = resolveVideoClasses(skin);
// Returns: { container: "...", video: "...", controlsBar: "...", ... }
```

#### getSkinStyleObject(skin)

Converts skin tokens to a style object for React.

```typescript
const style = getSkinStyleObject(skin);
// Returns: { "--video-bg": "#000", "--video-accent-color": "#3b82f6", ... }
```

#### loadSkinFromJsDelivr(version, path)

Loads a skin from jsDelivr CDN.

```typescript
const skin = await loadSkinFromJsDelivr('0.1.0', 'skins/video/base.json');
```

## Troubleshooting

### Skins Not Appearing

**Problem**: Skin classes/styles not being applied

**Solutions**:
1. Make sure you're using `VideoPlayer` or `VideoWithSkin`, NOT `Video`
2. Check that Tailwind is configured to include the skin classes
3. Verify the skin loaded successfully (check browser console)

### Controls Not Working

**Problem**: Custom controls are visible but not functional

**Solutions**:
1. Ensure you're not setting `controls={true}` on the component
2. Check browser console for JavaScript errors
3. Verify the component is client-side rendered (`'use client'` if needed)

### TypeScript Errors

**Problem**: Type errors when using skins

**Solutions**:
1. Import types: `import type { SkinDefinition } from '@page-speed/skins'`
2. Update @page-speed/video to latest version
3. Ensure @page-speed/skins is installed

## Best Practices

1. **Preload Skins**: Use `preloadSkins()` during app initialization
2. **Cache Skins**: The built-in cache is enabled by default
3. **Error Handling**: Always handle skin loading errors with try/catch
4. **Fallback**: Provide fallback to native controls if skin fails to load
5. **Performance**: Load skins from CDN, don't bundle them
6. **Testing**: Test with different skins to ensure compatibility

## Next Steps

- Create custom skins (see main README.md)
- Contribute new skins to the package
- Report issues or request features

## Support

- Issues: https://github.com/opensite-ai/page-speed-skins/issues
- Discussions: https://github.com/opensite-ai/page-speed-skins/discussions
