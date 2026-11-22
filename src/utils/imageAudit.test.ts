import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const BANNED_RUNDOWN_OR_LOWRES_IMAGES = new Set([
  '/assets/aistudio/down_street_station_1794391687146.jpg',
  '/assets/aistudio/tower_bascule_vault_1794391687426.jpg',
  '/assets/aistudio/kingsway_coldwar_tunnels.jpg',
  '/assets/aistudio/east_end_boxing_1794391694652.jpg',
  '/assets/aistudio/sky_gantry_night_1794391688194.jpg',
  '/assets/aistudio/brunel_brick_shaft_1794391688745.jpg',
  '/assets/aistudio/images__2__92f11072.jpg',
  '/assets/aistudio/rolls-royce-cullinan-chauffeur-service-events_d3e6e421.webp',
  '/assets/aistudio/25_Koenigsegg_CCXR_Trevita_30-Most-Expensive-Cars-in-the-World_Tyroola_0c18f9f0.jpg',
  '/assets/aistudio/images_6534f5fb.jpg',
  '/assets/aistudio/Copper-Club_b58a00e9.jpg',
]);

function collectSourceFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectSourceFiles(full));
    } else if (
      (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) &&
      !entry.name.endsWith('.test.ts') &&
      !entry.name.endsWith('.test.tsx')
    ) {
      results.push(full);
    }
  }
  return results;
}

const IMAGE_PATH_RE = /\/assets\/aistudio\/[A-Za-z0-9._-]+\.(?:jpg|jpeg|png|webp|avif)/g;

test('all /assets/aistudio image references across src/ exist on disk and exclude rundown/low-res assets', () => {
  const srcRoot = path.resolve(process.cwd(), 'src');
  const publicRoot = path.resolve(process.cwd(), 'public');
  const files = collectSourceFiles(srcRoot);

  const missingFiles: string[] = [];
  const bannedUsages: string[] = [];

  for (const file of files) {
    const rel = path.relative(process.cwd(), file);
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(IMAGE_PATH_RE) || [];

    for (const imgPath of matches) {
      const diskPath = path.join(publicRoot, imgPath.replace(/^\//, ''));
      if (!fs.existsSync(diskPath)) {
        missingFiles.push(`${rel}: ${imgPath}`);
      }
      if (BANNED_RUNDOWN_OR_LOWRES_IMAGES.has(imgPath)) {
        bannedUsages.push(`${rel}: ${imgPath}`);
      }
    }
  }

  assert.deepEqual(
    missingFiles,
    [],
    `Found broken /assets/aistudio references missing on disk:\n${missingFiles.join('\n')}`
  );

  assert.deepEqual(
    bannedUsages,
    [],
    `Found rundown or low-res banned images still referenced in src/:\n${bannedUsages.join('\n')}`
  );
});
