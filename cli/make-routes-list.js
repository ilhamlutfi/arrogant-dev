#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
    fileURLToPath
} from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const routeFile = path.join(__dirname, '../routes/web.route.js');

if (!fs.existsSync(routeFile)) {
    console.error(chalk.red('❌ routes/web.route.js not found'));
    process.exit(1);
}

const content = fs.readFileSync(routeFile, 'utf-8');

// ✅ Improved regex: match controller OR anonymous function
const routeRegex = /router\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*([\w.]+|(?:\(\s*.*?\s*\)\s*=>\s*{))/g;

let match;
const routes = [];

while ((match = routeRegex.exec(content)) !== null) {
    const [_, method, path, handler] = match;

    const isAnon = handler.startsWith('(') ? 'anonymous function' : handler;
    routes.push({
        method: method.toUpperCase(),
        path,
        handler: isAnon
    });
}

// Tampilkan hasil
if (routes.length === 0) {
    console.log(chalk.yellow('⚠️  No routes found in routes/web.route.js'));
    process.exit(0);
}

console.log(chalk.bold('\nMethod  Path                Handler'));
console.log(chalk.gray('-------------------------------------------'));
routes.forEach(route => {
    const method = route.method.padEnd(7);
    const path = route.path.padEnd(20);
    console.log(`${chalk.green(method)} ${chalk.cyan(path)} ${chalk.yellow(route.handler)}`);
});
