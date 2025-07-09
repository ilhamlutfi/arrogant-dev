#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
    fileURLToPath
} from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const rawPath = args[0];
const forceOverwrite = args.includes('--force');

if (!rawPath) {
    console.error('❌ Please enter a valid view path. Example:');
    console.error('   npm run make:view dashboard');
    console.error('   npm run make:view user/profile/index');
    console.error('   npm run make:view admin/users/index --force');
    process.exit(1);
}

const parsed = path.parse(rawPath);
const folderPath = parsed.dir;
const viewName = parsed.name;
const viewDir = path.join(__dirname, '../views', folderPath);
const viewFile = path.join(viewDir, `${viewName}.edge`);

fs.mkdirSync(viewDir, {
    recursive: true
});

if (fs.existsSync(viewFile) && !forceOverwrite) {
    console.warn(`⚠️  View already exists: ${viewFile}`);
    console.warn(`Use '--force' to overwrite.`);
    process.exit(0);
}

const content = `<!-- View: ${folderPath}/${viewName} -->`;

fs.writeFileSync(viewFile, content);
console.log(`✅ View created successfully: ${viewFile}${forceOverwrite ? ' (overwritten)' : ''}`);

