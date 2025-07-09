#!/usr/bin/env node

import {
    execSync
} from 'child_process';
import {
    Command
} from 'commander';
import path from 'path';
import {
    fileURLToPath
} from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();
program.name('arrogant').description('🦅 Arrogant.js CLI - The Bold MVC Framework for Express').version('1.0.0');

// Helper to resolve CLI tool paths
const cliPath = (tool) => path.join(__dirname, `make-${tool}.js`);

program
    .command('make:controller <name>')
    .option('-s, --service', 'Create service')
    .option('-v, --view', 'Create views')
    .description('Generate a new controller')
    .action((name, options) => {
        const args = [`"${name}"`];
        if (options.service) args.push('-s');
        if (options.view) args.push('-v');
        execSync(`node ${cliPath('controller')} ${args.join(' ')}`, {
            stdio: 'inherit'
        });
    });

program
    .command('make:model <name>')
    .description('Generate a new Prisma model schema')
    .action((name) => {
        execSync(`node ${cliPath('model')} "${name}"`, {
            stdio: 'inherit'
        });
    });

program
    .command('make:service <name>')
    .description('Generate a new service file')
    .action((name) => {
        execSync(`node ${cliPath('service')} "${name}"`, {
            stdio: 'inherit'
        });
    });

program
    .command('make:view <name>')
    .option('--force', 'Overwrite if exists')
    .description('Generate view files (index, create, edit, show)')
    .action((name, options) => {
        const args = [`"${name}"`];
        if (options.force) args.push('--force');
        execSync(`node ${cliPath('view')} ${args.join(' ')}`, {
            stdio: 'inherit'
        });
    });

program
    .command('run <script>')
    .description('Run npm script (e.g. dev, seed)')
    .action((script) => {
        execSync(`npm run ${script}`, {
            stdio: 'inherit'
        });
    });

program.parse();
