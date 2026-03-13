/**
 * Core skin definition schema for @page-speed/skins
 * Supports any component type through a flexible slot-based system
 */

/**
 * CSS variable tokens for theming
 * Key-value pairs that map to CSS custom properties
 */
export interface SkinTokens {
  [key: string]: string;
}

/**
 * Class mappings for component slots
 * Each slot can have Tailwind classes or custom CSS classes
 */
export interface SkinClasses {
  [slot: string]: string;
}

/**
 * Optional asset URLs (icons, images, etc.)
 */
export interface SkinAssets {
  [key: string]: string;
}

/**
 * Complete skin definition
 */
export interface SkinDefinition {
  /** Unique identifier for this skin */
  id: string;

  /** Human-readable name */
  name: string;

  /** Semantic version */
  version: string;

  /** Target component types (e.g., ["video"], ["carousel"]) */
  targets: string[];

  /** CSS variable tokens */
  tokens: SkinTokens;

  /** Class mappings for component slots */
  classes: SkinClasses;

  /** Optional asset URLs */
  assets?: SkinAssets;

  /** Optional description */
  description?: string;

  /** Optional metadata */
  metadata?: {
    author?: string;
    license?: string;
    tags?: string[];
    [key: string]: any;
  };
}

/**
 * Video player skin slots
 * Standard slots for video player components
 */
export interface VideoSkinSlots {
  /** Container/wrapper element */
  container?: string;

  /** Video element itself */
  video?: string;

  /** Controls bar container */
  controlsBar?: string;

  /** Play/pause button */
  playButton?: string;

  /** Timeline/progress bar container */
  timeline?: string;

  /** Timeline progress indicator */
  timelineProgress?: string;

  /** Timeline buffered indicator */
  timelineBuffered?: string;

  /** Time display text */
  timeText?: string;

  /** Volume control */
  volumeControl?: string;

  /** Fullscreen button */
  fullscreenButton?: string;

  /** Settings button */
  settingsButton?: string;

  /** Loading spinner */
  loadingSpinner?: string;

  /** Play overlay (big play button) */
  playOverlay?: string;

  /** Custom slots for extensibility */
  [key: string]: string | undefined;
}

/**
 * Type guard to check if a skin targets video players
 */
export function isVideoSkin(skin: SkinDefinition): boolean {
  return skin.targets.includes('video');
}

/**
 * Type guard to validate skin definition structure
 */
export function isValidSkin(obj: any): obj is SkinDefinition {
  return (
    obj !== null &&
    obj !== undefined &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.version === 'string' &&
    Array.isArray(obj.targets) &&
    typeof obj.tokens === 'object' &&
    obj.tokens !== null &&
    typeof obj.classes === 'object' &&
    obj.classes !== null
  );
}
