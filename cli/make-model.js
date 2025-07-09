#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import {
    fileURLToPath
} from 'url';

// Setup __dirname
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Argumen
const args = process.argv.slice(2);
const modelName = args[0];

if (!modelName) {
    console.error('❌ Nama model harus diisi. Contoh: npm run make:model User');
    process.exit(1);
}

const name = modelName.charAt(0).toUpperCase() + modelName.slice(1);
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

if (!fs.existsSync(schemaPath)) {
    console.error('❌ File schema.prisma tidak ditemukan di folder prisma');
    process.exit(1);
}

const modelTemplate = `
model ${name} {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // Tambahkan kolom lain di sini
}
`;

const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

if (schemaContent.includes(`model ${name} `)) {
    console.error(`❌ Model '${name}' sudah ada di schema.prisma`);
    process.exit(1);
}

// Tambahkan ke akhir file schema.prisma
fs.appendFileSync(schemaPath, `\n${modelTemplate}`);
console.log(`✅ Model '${name}' berhasil ditambahkan ke schema.prisma`);
console.log(`👉 Jalankan: npx prisma migrate dev --name tambah-model-${name.toLowerCase()}`);
