import process from 'node:process';
import { execSync } from 'node:child_process';
import { dirname, resolve  } from 'node:path'
import { fileURLToPath } from 'node:url';


const versionTag = getGitTagOrShortHash();
console.log(`Building ⚒️ release for version: '${versionTag}'`);
const scriptParentDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

process.chdir(scriptParentDir);
execSync('pnpm run build', { stdio: 'inherit' });
execSync(`zip -r "release-${versionTag}.zip" ./dist`, { stdio: 'inherit' });

function getGitTagOrShortHash() {
  try {
    return execSync('git describe --tags --exact-match').toString().trim();
  } catch {
    return execSync('git rev-parse --short HEAD').toString().trim();
  }
}
