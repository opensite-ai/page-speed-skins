// Validates all skin JSON files to ensure they're valid and complete
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const SKINS_DIR = 'skins';

function validateSkin(skinPath, skinData) {
  const required = ['id', 'name', 'version', 'targets', 'tokens', 'classes'];
  const missing = required.filter(field => !skinData[field]);

  if (missing.length > 0) {
    throw new Error(`${skinPath}: Missing required fields: ${missing.join(', ')}`);
  }

  if (!Array.isArray(skinData.targets) || skinData.targets.length === 0) {
    throw new Error(`${skinPath}: targets must be a non-empty array`);
  }

  if (typeof skinData.tokens !== 'object' || skinData.tokens === null) {
    throw new Error(`${skinPath}: tokens must be an object`);
  }

  if (typeof skinData.classes !== 'object' || skinData.classes === null) {
    throw new Error(`${skinPath}: classes must be an object`);
  }

  // Validate version format (semver-like)
  if (!/^\d+\.\d+\.\d+/.test(skinData.version)) {
    throw new Error(`${skinPath}: version must follow semver format (x.y.z)`);
  }

  return true;
}

function walkDir(dir, callback) {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      callback(fullPath);
    }
  }
}

let validatedCount = 0;
let errors = [];

walkDir(SKINS_DIR, (skinPath) => {
  try {
    const content = readFileSync(skinPath, 'utf-8');
    const skinData = JSON.parse(content);
    validateSkin(skinPath, skinData);
    validatedCount++;
    console.log(`✓ ${skinPath}`);
  } catch (err) {
    errors.push({ path: skinPath, error: err.message });
    console.error(`✗ ${skinPath}: ${err.message}`);
  }
});

console.log(`\nValidated ${validatedCount} skin(s)`);

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s) found:`);
  errors.forEach(({ path, error }) => {
    console.error(`  - ${path}: ${error}`);
  });
  process.exit(1);
} else {
  console.log('All skins are valid! ✨');
}
