import { describe, it, expect } from 'vitest';
import {
  getVideoSkinAttributes,
  getVideoContainerAttributes,
  getVideoControlsBarAttributes,
  getVideoPlayButtonAttributes,
  getVideoTimelineAttributes,
  resolveVideoClasses,
} from '../adapters/video';
import type { SkinDefinition } from '../schema';

describe('Video Adapter', () => {
  const skin: SkinDefinition = {
    id: 'test-video-skin',
    name: 'Test Video Skin',
    version: '1.0.0',
    targets: ['video'],
    tokens: {
      '--video-bg': '#000000',
      '--video-accent': '#3b82f6',
    },
    classes: {
      container: 'relative w-full overflow-hidden rounded-lg bg-black',
      video: 'w-full h-full object-contain',
      controlsBar: 'absolute bottom-0 left-0 right-0 flex items-center gap-2 px-4 py-2',
      playButton: 'flex items-center justify-center w-10 h-10 rounded-full',
      timeline: 'flex-1 h-1 bg-white/30 rounded-full cursor-pointer',
      timelineProgress: 'absolute inset-y-0 left-0 bg-blue-500',
      timelineBuffered: 'absolute inset-y-0 left-0 bg-white/50',
      timeText: 'text-sm text-white font-mono',
      volumeControl: 'flex items-center gap-2',
      fullscreenButton: 'flex items-center justify-center w-10 h-10',
      settingsButton: 'flex items-center justify-center w-10 h-10',
      loadingSpinner: 'absolute inset-0 flex items-center justify-center',
      playOverlay: 'absolute inset-0 flex items-center justify-center cursor-pointer',
    },
  };

  describe('getVideoSkinAttributes', () => {
    it('should return video element attributes', () => {
      const attrs = getVideoSkinAttributes(skin);

      expect(attrs.className).toBe('w-full h-full object-contain');
      expect(attrs.style).toEqual({
        '--video-bg': '#000000',
        '--video-accent': '#3b82f6',
      });
      expect(attrs['data-skin-id']).toBe('test-video-skin');
      expect(attrs['data-skin-version']).toBe('1.0.0');
      expect(attrs['data-skin-targets']).toBe('video');
    });

    it('should handle skin without video class', () => {
      const skinWithoutVideo = {
        ...skin,
        classes: { container: 'w-full' },
      };
      const attrs = getVideoSkinAttributes(skinWithoutVideo);

      expect(attrs.className).toBe('');
    });

    it('should handle multiple targets', () => {
      const multiTarget = { ...skin, targets: ['video', 'carousel'] };
      const attrs = getVideoSkinAttributes(multiTarget);

      expect(attrs['data-skin-targets']).toBe('video,carousel');
    });
  });

  describe('getVideoContainerAttributes', () => {
    it('should return container attributes', () => {
      const attrs = getVideoContainerAttributes(skin);

      expect(attrs.className).toBe('relative w-full overflow-hidden rounded-lg bg-black');
      expect(attrs.style).toEqual({
        '--video-bg': '#000000',
        '--video-accent': '#3b82f6',
      });
    });

    it('should handle missing container class', () => {
      const skinWithoutContainer = {
        ...skin,
        classes: { video: 'w-full' },
      };
      const attrs = getVideoContainerAttributes(skinWithoutContainer);

      expect(attrs.className).toBe('');
    });
  });

  describe('getVideoControlsBarAttributes', () => {
    it('should return controls bar className', () => {
      const attrs = getVideoControlsBarAttributes(skin);
      expect(attrs.className).toBe('absolute bottom-0 left-0 right-0 flex items-center gap-2 px-4 py-2');
    });
  });

  describe('getVideoPlayButtonAttributes', () => {
    it('should return play button className', () => {
      const attrs = getVideoPlayButtonAttributes(skin);
      expect(attrs.className).toBe('flex items-center justify-center w-10 h-10 rounded-full');
    });
  });

  describe('getVideoTimelineAttributes', () => {
    it('should return timeline className', () => {
      const attrs = getVideoTimelineAttributes(skin);
      expect(attrs.className).toBe('flex-1 h-1 bg-white/30 rounded-full cursor-pointer');
    });
  });

  describe('resolveVideoClasses', () => {
    it('should resolve all video classes', () => {
      const classes = resolveVideoClasses(skin);

      expect(classes.container).toBe('relative w-full overflow-hidden rounded-lg bg-black');
      expect(classes.video).toBe('w-full h-full object-contain');
      expect(classes.controlsBar).toBe('absolute bottom-0 left-0 right-0 flex items-center gap-2 px-4 py-2');
      expect(classes.playButton).toBe('flex items-center justify-center w-10 h-10 rounded-full');
      expect(classes.timeline).toBe('flex-1 h-1 bg-white/30 rounded-full cursor-pointer');
      expect(classes.timelineProgress).toBe('absolute inset-y-0 left-0 bg-blue-500');
      expect(classes.timelineBuffered).toBe('absolute inset-y-0 left-0 bg-white/50');
      expect(classes.timeText).toBe('text-sm text-white font-mono');
      expect(classes.volumeControl).toBe('flex items-center gap-2');
      expect(classes.fullscreenButton).toBe('flex items-center justify-center w-10 h-10');
      expect(classes.settingsButton).toBe('flex items-center justify-center w-10 h-10');
      expect(classes.loadingSpinner).toBe('absolute inset-0 flex items-center justify-center');
      expect(classes.playOverlay).toBe('absolute inset-0 flex items-center justify-center cursor-pointer');
    });

    it('should return undefined for missing classes', () => {
      const minimalSkin = {
        ...skin,
        classes: { container: 'w-full' },
      };
      const classes = resolveVideoClasses(minimalSkin);

      expect(classes.container).toBe('w-full');
      expect(classes.video).toBe('');
      expect(classes.playButton).toBe('');
    });

    it('should handle empty classes object', () => {
      const emptySkin = { ...skin, classes: {} };
      const classes = resolveVideoClasses(emptySkin);

      expect(classes.container).toBe('');
      expect(classes.video).toBe('');
    });
  });
});
