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

// Argumen CLI
const args = process.argv.slice(2);
const rawPath = args[0];
const forceOverwrite = args.includes('--force');

// Validasi
if (!rawPath) {
    console.error('❌ Harap masukkan nama service. Contoh:');
    console.error('   npm run make:service User');
    console.error('   npm run make:service user/account');
    process.exit(1);
}

// Pisahkan path folder dan nama file
const parsed = path.parse(rawPath);
const folderPath = parsed.dir;
const baseName = parsed.name.toLowerCase();
const className = parsed.name.charAt(0).toUpperCase() + parsed.name.slice(1);

// Buat path file
const serviceDir = path.join(__dirname, '../app/services', folderPath);
const servicePath = path.join(serviceDir, `${baseName}.service.js`);

// Template isi service
const template = `
// Service: ${className}

import prisma from "../../prisma/client.js";

class ${className}Service {
  getAll = async () => {
    return await prisma.${baseName}.findMany();
  };

  getById = async (id) => {
    return await prisma.${baseName}.findUnique({
      where: { id: parseInt(id) }
    });
  };

  store = async (data) => {
    return await prisma.${baseName}.create({ data });
  };

  update = async (id, data) => {
    return await prisma.${baseName}.update({
      where: { id: parseInt(id) },
      data
    });
  };

  delete = async (id) => {
    return await prisma.${baseName}.delete({
      where: { id: parseInt(id) }
    });
  };
}

export default new ${className}Service();
`;

// Buat folder jika belum ada
fs.mkdirSync(serviceDir, {
    recursive: true
});

// Cek duplikat
if (fs.existsSync(servicePath) && !forceOverwrite) {
    console.warn(`⚠️  Service sudah ada: ${servicePath}`);
    console.warn(`Gunakan '--force' untuk menimpa.`);
    process.exit(0);
}

// Tulis file service
fs.writeFileSync(servicePath, template);
console.log(`✅ Service berhasil dibuat: ${servicePath}${forceOverwrite ? ' (ditimpa)' : ''}`);
