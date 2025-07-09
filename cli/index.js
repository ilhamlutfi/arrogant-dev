#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const projectName = process.argv[2];
if (!projectName) {
  console.error("❌ Silakan beri nama project. Contoh: npm create arrogant-app myproject");
  process.exit(1);
}

// Copy semua isi starter kit ke folder baru
const targetPath = path.resolve(process.cwd(), projectName);
fs.cpSync(__dirname + '/../', targetPath, { recursive: true });
console.log(`✅ Berhasil buat project di ${targetPath}`);

// Jalankan install dependencies
console.log('📦 Installing dependencies...');
execSync('npm install', { stdio: 'inherit', cwd: targetPath });

console.log('\n🚀 Selesai! Jalankan project dengan:');
console.log(`cd ${projectName} && npm run dev`);
