import type { SkinDefinition } from '../schema.js';

/**
 * Applies a skin's CSS variables to an element
 */
export function applySkinTokens(
  element: HTMLElement,
  tokens: Record<string, string>
): void {
  if (!element || typeof element.style?.setProperty !== 'function') {
    return;
  }

  Object.entries(tokens).forEach(([key, value]) => {
    // Ensure key starts with -- for CSS variables
    const cssVarName = key.startsWith('--') ? key : `--${key}`;
    element.style.setProperty(cssVarName, value);
  });
}

/**
 * Sets data attributes for skin identification and debugging
 */
export function setSkinDataAttributes(
  element: HTMLElement,
  skin: SkinDefinition
): void {
  if (!element || typeof element.setAttribute !== 'function') {
    return;
  }

  element.setAttribute('data-skin-id', skin.id);
  element.setAttribute('data-skin-version', skin.version);
  element.setAttribute('data-skin-targets', skin.targets.join(','));
}

/**
 * Applies a complete skin to an element
 * Sets CSS variables and data attributes
 */
export function applySkinToElement(
  element: HTMLElement,
  skin: SkinDefinition
): void {
  if (!element) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('[applySkinToElement] Invalid element provided');
    }
    return;
  }

  applySkinTokens(element, skin.tokens);
  setSkinDataAttributes(element, skin);
}

/**
 * Resolves classes for a specific slot from a skin
 */
export function resolveClasses(
  skin: SkinDefinition,
  slot: string
): string {
  return skin.classes[slot] || '';
}

/**
 * Resolves multiple classes for multiple slots
 * Returns a map of slot names to class strings
 */
export function resolveMultipleClasses(
  skin: SkinDefinition,
  slots: string[]
): Record<string, string> {
  const result: Record<string, string> = {};

  slots.forEach((slot) => {
    result[slot] = resolveClasses(skin, slot);
  });

  return result;
}

/**
 * Gets all CSS variables from a skin as inline style object
 * Useful for React style prop
 */
export function getSkinStyleObject(
  skin: SkinDefinition
): Record<string, string> {
  const style: Record<string, string> = {};

  Object.entries(skin.tokens).forEach(([key, value]) => {
    const cssVarName = key.startsWith('--') ? key : `--${key}`;
    style[cssVarName] = value;
  });

  return style;
}

/**
 * Removes skin from an element
 * Clears CSS variables and data attributes
 */
export function removeSkinFromElement(
  element: HTMLElement,
  skin: SkinDefinition
): void {
  if (!element) {
    return;
  }

  // Remove CSS variables
  Object.keys(skin.tokens).forEach((key) => {
    const cssVarName = key.startsWith('--') ? key : `--${key}`;
    element.style.removeProperty(cssVarName);
  });

  // Remove data attributes
  element.removeAttribute('data-skin-id');
  element.removeAttribute('data-skin-version');
  element.removeAttribute('data-skin-targets');
}
