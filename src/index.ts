// Core schema and types
export type {
  SkinDefinition,
  SkinTokens,
  SkinClasses,
  SkinAssets,
  VideoSkinSlots,
} from './schema.js';

export { isVideoSkin, isValidSkin } from './schema.js';

// Runtime utilities
export {
  applySkinToElement,
  applySkinTokens,
  setSkinDataAttributes,
  resolveClasses,
  resolveMultipleClasses,
  getSkinStyleObject,
  removeSkinFromElement,
} from './runtime/index.js';

// Video adapter
export type { VideoSkinAttributes } from './adapters/video.js';

export {
  getVideoSkinAttributes,
  getVideoContainerAttributes,
  getVideoControlsBarAttributes,
  getVideoPlayButtonAttributes,
  getVideoTimelineAttributes,
  resolveVideoClasses,
} from './adapters/video.js';

// Utilities
export type { LoadSkinOptions } from './utils/index.js';

export {
  loadSkin,
  loadSkinFromJsDelivr,
  preloadSkins,
  clearSkinCache,
  getSkinCacheStats,
} from './utils/index.js';
