#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const rawPath = args[0];
const forceOverwrite = args.includes('--force');

if (!rawPath) {
    console.error('❌ Please enter a service name. Example:');
    console.error('   npm run make:service User');
    console.error('   npm run make:service user/account');
    process.exit(1);
}

const parsed = path.parse(rawPath);
const folderPath = parsed.dir;
const baseName = parsed.name.toLowerCase();
const className = parsed.name.charAt(0).toUpperCase() + parsed.name.slice(1);

const serviceDir = path.join(__dirname, '../app/services', folderPath);
const servicePath = path.join(serviceDir, `${baseName}.service.js`);

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

fs.mkdirSync(serviceDir, {
    recursive: true
});

if (fs.existsSync(servicePath) && !forceOverwrite) {
    console.warn(`⚠️  Service already exists: ${servicePath}`);
    console.warn(`Use '--force' to overwrite.`);
    process.exit(0);
}

fs.writeFileSync(servicePath, template);
console.log(`✅ Service successfully created: ${servicePath}${forceOverwrite ? ' (overwritten)' : ''}`);

