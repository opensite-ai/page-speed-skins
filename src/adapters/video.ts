import type { SkinDefinition } from '../schema.js';
import { getSkinStyleObject, resolveClasses } from '../runtime/applySkin.js';

/**
 * Attributes to apply to a <video> element for a given skin
 */
export interface VideoSkinAttributes {
  /** Class name for the video element */
  className?: string;

  /** Inline style object with CSS variables */
  style?: Record<string, string>;

  /** Data attributes for debugging */
  'data-skin-id'?: string;
  'data-skin-version'?: string;
  'data-skin-targets'?: string;
}

/**
 * Gets attributes to apply to a <video> element from a skin
 * Returns props that can be spread onto a React <video> element
 */
export function getVideoSkinAttributes(
  skin: SkinDefinition
): VideoSkinAttributes {
  return {
    className: resolveClasses(skin, 'video'),
    style: getSkinStyleObject(skin),
    'data-skin-id': skin.id,
    'data-skin-version': skin.version,
    'data-skin-targets': skin.targets.join(','),
  };
}

/**
 * Gets attributes for a video container wrapper
 */
export function getVideoContainerAttributes(
  skin: SkinDefinition
): { className?: string; style?: Record<string, string> } {
  return {
    className: resolveClasses(skin, 'container'),
    style: getSkinStyleObject(skin),
  };
}

/**
 * Gets attributes for video controls bar
 */
export function getVideoControlsBarAttributes(
  skin: SkinDefinition
): { className?: string } {
  return {
    className: resolveClasses(skin, 'controlsBar'),
  };
}

/**
 * Gets attributes for play button
 */
export function getVideoPlayButtonAttributes(
  skin: SkinDefinition
): { className?: string } {
  return {
    className: resolveClasses(skin, 'playButton'),
  };
}

/**
 * Gets attributes for timeline/progress bar
 */
export function getVideoTimelineAttributes(
  skin: SkinDefinition
): { className?: string } {
  return {
    className: resolveClasses(skin, 'timeline'),
  };
}

/**
 * Resolves all video-related classes from a skin
 */
export function resolveVideoClasses(skin: SkinDefinition): {
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
  settingsButton?: string;
  loadingSpinner?: string;
  playOverlay?: string;
} {
  return {
    container: resolveClasses(skin, 'container'),
    video: resolveClasses(skin, 'video'),
    controlsBar: resolveClasses(skin, 'controlsBar'),
    playButton: resolveClasses(skin, 'playButton'),
    timeline: resolveClasses(skin, 'timeline'),
    timelineProgress: resolveClasses(skin, 'timelineProgress'),
    timelineBuffered: resolveClasses(skin, 'timelineBuffered'),
    timeText: resolveClasses(skin, 'timeText'),
    volumeControl: resolveClasses(skin, 'volumeControl'),
    fullscreenButton: resolveClasses(skin, 'fullscreenButton'),
    settingsButton: resolveClasses(skin, 'settingsButton'),
    loadingSpinner: resolveClasses(skin, 'loadingSpinner'),
    playOverlay: resolveClasses(skin, 'playOverlay'),
  };
}
