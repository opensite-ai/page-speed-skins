import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { isValidSkin, isVideoSkin } from '../schema';
import type { SkinDefinition } from '../schema';

describe('Bundled Skins', () => {
  const skinsDir = 'skins/video';
  const skinFiles = readdirSync(skinsDir).filter(f => f.endsWith('.json'));

  describe('Video Skins Validation', () => {
    skinFiles.forEach((filename) => {
      describe(filename, () => {
        let skin: SkinDefinition;

        it('should be valid JSON', () => {
          const content = readFileSync(join(skinsDir, filename), 'utf-8');
          expect(() => {
            skin = JSON.parse(content);
          }).not.toThrow();
        });

        it('should be a valid skin', () => {
          const content = readFileSync(join(skinsDir, filename), 'utf-8');
          skin = JSON.parse(content);
          expect(isValidSkin(skin)).toBe(true);
        });

        it('should target video', () => {
          const content = readFileSync(join(skinsDir, filename), 'utf-8');
          skin = JSON.parse(content);
          expect(isVideoSkin(skin)).toBe(true);
        });

        it('should have required fields', () => {
          const content = readFileSync(join(skinsDir, filename), 'utf-8');
          skin = JSON.parse(content);

          expect(skin.id).toBeTruthy();
          expect(skin.name).toBeTruthy();
          expect(skin.version).toBeTruthy();
          expect(skin.targets).toBeInstanceOf(Array);
          expect(skin.tokens).toBeInstanceOf(Object);
          expect(skin.classes).toBeInstanceOf(Object);
        });

        it('should have semver version', () => {
          const content = readFileSync(join(skinsDir, filename), 'utf-8');
          skin = JSON.parse(content);
          expect(skin.version).toMatch(/^\d+\.\d+\.\d+/);
        });

        it('should have at least one token', () => {
          const content = readFileSync(join(skinsDir, filename), 'utf-8');
          skin = JSON.parse(content);
          expect(Object.keys(skin.tokens).length).toBeGreaterThan(0);
        });

        it('should have at least one class', () => {
          const content = readFileSync(join(skinsDir, filename), 'utf-8');
          skin = JSON.parse(content);
          expect(Object.keys(skin.classes).length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Skin Collection', () => {
    it('should have at least 4 video skins', () => {
      expect(skinFiles.length).toBeGreaterThanOrEqual(4);
    });

    it('should have unique IDs', () => {
      const ids = new Set<string>();

      skinFiles.forEach((filename) => {
        const content = readFileSync(join(skinsDir, filename), 'utf-8');
        const skin = JSON.parse(content);
        expect(ids.has(skin.id)).toBe(false);
        ids.add(skin.id);
      });
    });

    it('should all be version 1.0.0 or higher', () => {
      skinFiles.forEach((filename) => {
        const content = readFileSync(join(skinsDir, filename), 'utf-8');
        const skin = JSON.parse(content);
        const [major] = skin.version.split('.').map(Number);
        expect(major).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Specific Skins', () => {
    it('should have base.json', () => {
      expect(skinFiles).toContain('base.json');
    });

    it('should have linear-inspired.json', () => {
      expect(skinFiles).toContain('linear-inspired.json');
    });

    it('should have minimal-hover.json', () => {
      expect(skinFiles).toContain('minimal-hover.json');
    });

    it('should have social-card.json', () => {
      expect(skinFiles).toContain('social-card.json');
    });
  });
});
