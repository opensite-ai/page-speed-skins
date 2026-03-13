import { describe, it, expect, beforeEach } from 'vitest';
import {
  applySkinToElement,
  applySkinTokens,
  setSkinDataAttributes,
  resolveClasses,
  resolveMultipleClasses,
  getSkinStyleObject,
  removeSkinFromElement,
} from '../runtime/applySkin';
import type { SkinDefinition } from '../schema';

describe('applySkin Runtime', () => {
  let element: HTMLElement;
  let skin: SkinDefinition;

  beforeEach(() => {
    element = document.createElement('div');
    skin = {
      id: 'test-skin',
      name: 'Test Skin',
      version: '1.0.0',
      targets: ['video'],
      tokens: {
        '--primary-color': '#3b82f6',
        '--secondary-color': '#10b981',
        'accent-color': '#f43f5e', // Without --
      },
      classes: {
        container: 'w-full h-full bg-black',
        video: 'object-contain',
        playButton: 'flex items-center justify-center',
      },
    };
  });

  describe('applySkinTokens', () => {
    it('should set CSS variables on element', () => {
      applySkinTokens(element, skin.tokens);

      expect(element.style.getPropertyValue('--primary-color')).toBe('#3b82f6');
      expect(element.style.getPropertyValue('--secondary-color')).toBe('#10b981');
    });

    it('should add -- prefix if missing', () => {
      applySkinTokens(element, skin.tokens);

      expect(element.style.getPropertyValue('--accent-color')).toBe('#f43f5e');
    });

    it('should handle empty tokens object', () => {
      expect(() => {
        applySkinTokens(element, {});
      }).not.toThrow();
    });

    it('should handle null element gracefully', () => {
      expect(() => {
        applySkinTokens(null as any, skin.tokens);
      }).not.toThrow();
    });
  });

  describe('setSkinDataAttributes', () => {
    it('should set data-skin-id attribute', () => {
      setSkinDataAttributes(element, skin);
      expect(element.getAttribute('data-skin-id')).toBe('test-skin');
    });

    it('should set data-skin-version attribute', () => {
      setSkinDataAttributes(element, skin);
      expect(element.getAttribute('data-skin-version')).toBe('1.0.0');
    });

    it('should set data-skin-targets attribute', () => {
      setSkinDataAttributes(element, skin);
      expect(element.getAttribute('data-skin-targets')).toBe('video');
    });

    it('should join multiple targets with comma', () => {
      const multiTargetSkin = { ...skin, targets: ['video', 'carousel'] };
      setSkinDataAttributes(element, multiTargetSkin);
      expect(element.getAttribute('data-skin-targets')).toBe('video,carousel');
    });

    it('should handle null element gracefully', () => {
      expect(() => {
        setSkinDataAttributes(null as any, skin);
      }).not.toThrow();
    });
  });

  describe('applySkinToElement', () => {
    it('should apply both tokens and data attributes', () => {
      applySkinToElement(element, skin);

      expect(element.style.getPropertyValue('--primary-color')).toBe('#3b82f6');
      expect(element.getAttribute('data-skin-id')).toBe('test-skin');
      expect(element.getAttribute('data-skin-version')).toBe('1.0.0');
    });

    it('should handle null element with warning', () => {
      expect(() => {
        applySkinToElement(null as any, skin);
      }).not.toThrow();
    });
  });

  describe('resolveClasses', () => {
    it('should return classes for valid slot', () => {
      expect(resolveClasses(skin, 'container')).toBe('w-full h-full bg-black');
      expect(resolveClasses(skin, 'video')).toBe('object-contain');
      expect(resolveClasses(skin, 'playButton')).toBe('flex items-center justify-center');
    });

    it('should return empty string for missing slot', () => {
      expect(resolveClasses(skin, 'nonexistent')).toBe('');
    });

    it('should return empty string for undefined slot', () => {
      expect(resolveClasses(skin, 'undefined')).toBe('');
    });
  });

  describe('resolveMultipleClasses', () => {
    it('should resolve multiple slots', () => {
      const result = resolveMultipleClasses(skin, ['container', 'video', 'playButton']);

      expect(result).toEqual({
        container: 'w-full h-full bg-black',
        video: 'object-contain',
        playButton: 'flex items-center justify-center',
      });
    });

    it('should handle empty slots array', () => {
      const result = resolveMultipleClasses(skin, []);
      expect(result).toEqual({});
    });

    it('should handle missing slots gracefully', () => {
      const result = resolveMultipleClasses(skin, ['container', 'missing', 'video']);

      expect(result).toEqual({
        container: 'w-full h-full bg-black',
        missing: '',
        video: 'object-contain',
      });
    });
  });

  describe('getSkinStyleObject', () => {
    it('should return style object with CSS variables', () => {
      const style = getSkinStyleObject(skin);

      expect(style['--primary-color']).toBe('#3b82f6');
      expect(style['--secondary-color']).toBe('#10b981');
      expect(style['--accent-color']).toBe('#f43f5e');
    });

    it('should add -- prefix to keys without it', () => {
      const style = getSkinStyleObject(skin);
      expect(style['--accent-color']).toBe('#f43f5e');
    });

    it('should handle empty tokens', () => {
      const emptySkin = { ...skin, tokens: {} };
      const style = getSkinStyleObject(emptySkin);
      expect(style).toEqual({});
    });
  });

  describe('removeSkinFromElement', () => {
    beforeEach(() => {
      applySkinToElement(element, skin);
    });

    it('should remove CSS variables', () => {
      removeSkinFromElement(element, skin);

      expect(element.style.getPropertyValue('--primary-color')).toBe('');
      expect(element.style.getPropertyValue('--secondary-color')).toBe('');
    });

    it('should remove data attributes', () => {
      removeSkinFromElement(element, skin);

      expect(element.getAttribute('data-skin-id')).toBeNull();
      expect(element.getAttribute('data-skin-version')).toBeNull();
      expect(element.getAttribute('data-skin-targets')).toBeNull();
    });

    it('should handle null element gracefully', () => {
      expect(() => {
        removeSkinFromElement(null as any, skin);
      }).not.toThrow();
    });

    it('should handle removing from element without skin', () => {
      const cleanElement = document.createElement('div');
      expect(() => {
        removeSkinFromElement(cleanElement, skin);
      }).not.toThrow();
    });
  });
});
