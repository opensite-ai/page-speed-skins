import { describe, it, expect } from 'vitest';
import * as SkinsExports from '../index';

describe('Smoke Tests', () => {
  describe('Module Exports', () => {
    it('should export isValidSkin', () => {
      expect(SkinsExports.isValidSkin).toBeDefined();
      expect(typeof SkinsExports.isValidSkin).toBe('function');
    });

    it('should export isVideoSkin', () => {
      expect(SkinsExports.isVideoSkin).toBeDefined();
      expect(typeof SkinsExports.isVideoSkin).toBe('function');
    });

    it('should export applySkinToElement', () => {
      expect(SkinsExports.applySkinToElement).toBeDefined();
      expect(typeof SkinsExports.applySkinToElement).toBe('function');
    });

    it('should export applySkinTokens', () => {
      expect(SkinsExports.applySkinTokens).toBeDefined();
      expect(typeof SkinsExports.applySkinTokens).toBe('function');
    });

    it('should export setSkinDataAttributes', () => {
      expect(SkinsExports.setSkinDataAttributes).toBeDefined();
      expect(typeof SkinsExports.setSkinDataAttributes).toBe('function');
    });

    it('should export resolveClasses', () => {
      expect(SkinsExports.resolveClasses).toBeDefined();
      expect(typeof SkinsExports.resolveClasses).toBe('function');
    });

    it('should export resolveMultipleClasses', () => {
      expect(SkinsExports.resolveMultipleClasses).toBeDefined();
      expect(typeof SkinsExports.resolveMultipleClasses).toBe('function');
    });

    it('should export getSkinStyleObject', () => {
      expect(SkinsExports.getSkinStyleObject).toBeDefined();
      expect(typeof SkinsExports.getSkinStyleObject).toBe('function');
    });

    it('should export removeSkinFromElement', () => {
      expect(SkinsExports.removeSkinFromElement).toBeDefined();
      expect(typeof SkinsExports.removeSkinFromElement).toBe('function');
    });

    it('should export getVideoSkinAttributes', () => {
      expect(SkinsExports.getVideoSkinAttributes).toBeDefined();
      expect(typeof SkinsExports.getVideoSkinAttributes).toBe('function');
    });

    it('should export getVideoContainerAttributes', () => {
      expect(SkinsExports.getVideoContainerAttributes).toBeDefined();
      expect(typeof SkinsExports.getVideoContainerAttributes).toBe('function');
    });

    it('should export loadSkin', () => {
      expect(SkinsExports.loadSkin).toBeDefined();
      expect(typeof SkinsExports.loadSkin).toBe('function');
    });

    it('should export loadSkinFromJsDelivr', () => {
      expect(SkinsExports.loadSkinFromJsDelivr).toBeDefined();
      expect(typeof SkinsExports.loadSkinFromJsDelivr).toBe('function');
    });

    it('should export preloadSkins', () => {
      expect(SkinsExports.preloadSkins).toBeDefined();
      expect(typeof SkinsExports.preloadSkins).toBe('function');
    });

    it('should export clearSkinCache', () => {
      expect(SkinsExports.clearSkinCache).toBeDefined();
      expect(typeof SkinsExports.clearSkinCache).toBe('function');
    });

    it('should export getSkinCacheStats', () => {
      expect(SkinsExports.getSkinCacheStats).toBeDefined();
      expect(typeof SkinsExports.getSkinCacheStats).toBe('function');
    });
  });

  describe('Function Calls', () => {
    it('should call isValidSkin without errors', () => {
      expect(() => {
        SkinsExports.isValidSkin({});
      }).not.toThrow();
    });

    it('should call isVideoSkin without errors', () => {
      const skin = {
        id: 'test',
        name: 'Test',
        version: '1.0.0',
        targets: ['video'],
        tokens: {},
        classes: {},
      };
      expect(() => {
        SkinsExports.isVideoSkin(skin);
      }).not.toThrow();
    });

    it('should call resolveClasses without errors', () => {
      const skin = {
        id: 'test',
        name: 'Test',
        version: '1.0.0',
        targets: ['video'],
        tokens: {},
        classes: { container: 'w-full' },
      };
      expect(() => {
        SkinsExports.resolveClasses(skin, 'container');
      }).not.toThrow();
    });

    it('should call getSkinStyleObject without errors', () => {
      const skin = {
        id: 'test',
        name: 'Test',
        version: '1.0.0',
        targets: ['video'],
        tokens: { '--color': '#000' },
        classes: {},
      };
      expect(() => {
        SkinsExports.getSkinStyleObject(skin);
      }).not.toThrow();
    });

    it('should call clearSkinCache without errors', () => {
      expect(() => {
        SkinsExports.clearSkinCache();
      }).not.toThrow();
    });

    it('should call getSkinCacheStats without errors', () => {
      expect(() => {
        const stats = SkinsExports.getSkinCacheStats();
        expect(stats).toHaveProperty('size');
        expect(stats).toHaveProperty('urls');
      }).not.toThrow();
    });
  });

  describe('Type Safety', () => {
    it('should accept valid SkinDefinition', () => {
      const validSkin: SkinsExports.SkinDefinition = {
        id: 'test',
        name: 'Test',
        version: '1.0.0',
        targets: ['video'],
        tokens: { '--color': '#fff' },
        classes: { container: 'w-full' },
      };

      expect(validSkin).toBeDefined();
    });

    it('should accept LoadSkinOptions', () => {
      const options: SkinsExports.LoadSkinOptions = {
        url: 'https://example.com/skin.json',
        timeout: 5000,
        cache: true,
        debug: false,
      };

      expect(options).toBeDefined();
    });
  });
});
