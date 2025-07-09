#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import {
    fileURLToPath
} from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const modelName = args[0];

if (!modelName) {
    console.error('Error: Model name is required. Example: npm run make:model User');
    process.exit(1);
}

const name = modelName.charAt(0).toUpperCase() + modelName.slice(1);
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

if (!fs.existsSync(schemaPath)) {
    console.error('Error: schema.prisma file not found in prisma folder');
    process.exit(1);
}

const modelTemplate = `
model ${name} {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // Add other columns here
}
`;

const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

if (schemaContent.includes(`model ${name} `)) {
    console.error(`Error: Model '${name}' already exists in schema.prisma`);
    process.exit(1);
}

fs.appendFileSync(schemaPath, `\n${modelTemplate}`);
console.log(`Success: Model '${name}' added to schema.prisma`);
console.log(`Next step: Run npx prisma migrate dev --name add-model-${name.toLowerCase()}`);

