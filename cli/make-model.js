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
const modelName = args.find(arg => !arg.startsWith('-'));
const force = args.includes('--force');

if (!modelName) {
    console.error('❌ Model name is required. Example: arrogant make:model User');
    process.exit(1);
}

const name = modelName.charAt(0).toUpperCase() + modelName.slice(1);
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

if (!fs.existsSync(schemaPath)) {
    console.error('❌ schema.prisma file not found in prisma folder');
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

let schemaContent = fs.readFileSync(schemaPath, 'utf-8');
const modelRegex = new RegExp(`model\\s+${name}\\s+\\{[\\s\\S]+?\\}`, 'm');

if (schemaContent.includes(`model ${name} `)) {
    if (force) {
        schemaContent = schemaContent.replace(modelRegex, modelTemplate.trim());
        fs.writeFileSync(schemaPath, schemaContent);
        console.log(`♻️ Model '${name}' overwritten in schema.prisma`);
    } else {
        console.warn(`⚠️ Model '${name}' already exists. Use --force to overwrite.`);
        process.exit(1);
    }
} else {
    fs.appendFileSync(schemaPath, `\n${modelTemplate}`);
    console.log(`✅ Model '${name}' added to schema.prisma`);
}

console.log(`👉 Run: npx prisma migrate dev --name add-model-${name.toLowerCase()}`);
