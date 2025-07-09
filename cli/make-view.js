#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
    fileURLToPath
} from 'url';

// Setup __dirname
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Parsing argumen: npm run make:view user/profile/index [--force]
const args = process.argv.slice(2);
const rawPath = args[0];
const forceOverwrite = args.includes('--force');

// Validasi input
if (!rawPath) {
    console.error('❌ Harap masukkan path view. Contoh:');
    console.error('   npm run make:view dashboard');
    console.error('   npm run make:view user/profile/index');
    console.error('   npm run make:view admin/users/index --force');
    process.exit(1);
}

// Split dan ambil path folder + file
const parsed = path.parse(rawPath);
const folderPath = parsed.dir;
const viewName = parsed.name;
const viewDir = path.join(__dirname, '../views', folderPath);
const viewFile = path.join(viewDir, `${viewName}.edge`);

// Buat folder jika belum ada
fs.mkdirSync(viewDir, {
    recursive: true
});

// Cek jika file sudah ada
if (fs.existsSync(viewFile) && !forceOverwrite) {
    console.warn(`⚠️  View sudah ada: ${viewFile}`);
    console.warn(`Gunakan '--force' untuk menimpa.`);
    process.exit(0);
}

// Isi file default
const content = `<!-- View: ${folderPath}/${viewName} -->`;

fs.writeFileSync(viewFile, content);
console.log(`✅ View berhasil dibuat: ${viewFile}${forceOverwrite ? ' (ditimpa)' : ''}`);
