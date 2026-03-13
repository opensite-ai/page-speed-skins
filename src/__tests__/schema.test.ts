import { describe, it, expect } from 'vitest';
import { isVideoSkin, isValidSkin } from '../schema';
import type { SkinDefinition } from '../schema';

describe('Schema Validation', () => {
  const validSkin: SkinDefinition = {
    id: 'test-skin',
    name: 'Test Skin',
    version: '1.0.0',
    targets: ['video'],
    tokens: {
      '--primary-color': '#3b82f6',
    },
    classes: {
      container: 'w-full h-full',
    },
  };

  describe('isValidSkin', () => {
    it('should validate complete skin', () => {
      expect(isValidSkin(validSkin)).toBe(true);
    });

    it('should reject skin without id', () => {
      const { id, ...incomplete } = validSkin;
      expect(isValidSkin(incomplete)).toBe(false);
    });

    it('should reject skin without name', () => {
      const { name, ...incomplete } = validSkin;
      expect(isValidSkin(incomplete)).toBe(false);
    });

    it('should reject skin without version', () => {
      const { version, ...incomplete } = validSkin;
      expect(isValidSkin(incomplete)).toBe(false);
    });

    it('should reject skin without targets', () => {
      const { targets, ...incomplete } = validSkin;
      expect(isValidSkin(incomplete)).toBe(false);
    });

    it('should reject skin with non-array targets', () => {
      const invalid = { ...validSkin, targets: 'video' };
      expect(isValidSkin(invalid)).toBe(false);
    });

    it('should reject skin without tokens', () => {
      const { tokens, ...incomplete } = validSkin;
      expect(isValidSkin(incomplete)).toBe(false);
    });

    it('should reject skin without classes', () => {
      const { classes, ...incomplete } = validSkin;
      expect(isValidSkin(incomplete)).toBe(false);
    });

    it('should reject null', () => {
      expect(isValidSkin(null as any)).toBe(false);
    });

    it('should reject undefined', () => {
      expect(isValidSkin(undefined as any)).toBe(false);
    });

    it('should reject primitives', () => {
      expect(isValidSkin('string')).toBe(false);
      expect(isValidSkin(123)).toBe(false);
      expect(isValidSkin(true)).toBe(false);
    });

    it('should accept skin with optional fields', () => {
      const withOptional = {
        ...validSkin,
        description: 'Test description',
        assets: { icon: 'url' },
        metadata: { author: 'Test' },
      };
      expect(isValidSkin(withOptional)).toBe(true);
    });
  });

  describe('isVideoSkin', () => {
    it('should return true for video skin', () => {
      expect(isVideoSkin(validSkin)).toBe(true);
    });

    it('should return false for non-video skin', () => {
      const carouselSkin = { ...validSkin, targets: ['carousel'] };
      expect(isVideoSkin(carouselSkin)).toBe(false);
    });

    it('should return true if video is one of multiple targets', () => {
      const multiTarget = { ...validSkin, targets: ['video', 'carousel'] };
      expect(isVideoSkin(multiTarget)).toBe(true);
    });

    it('should return false for empty targets', () => {
      const noTargets = { ...validSkin, targets: [] };
      expect(isVideoSkin(noTargets)).toBe(false);
    });
  });
});
