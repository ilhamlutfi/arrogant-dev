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
program
    .name('arrogant')
    .description('🦅 Arrogant.js CLI - The Bold MVC Framework for Express')
    .version('1.0.0');

// Helper to resolve CLI file paths
const cliPath = (tool) => path.join(__dirname, `make-${tool}.js`);

// 🧠 make:controller
program
    .command('make:controller <name>')
    .option('-s, --service', 'Also create a service')
    .option('-v, --view', 'Also create views')
    .option('-m, --model', 'Also generate model')
    .option('--force', 'Overwrite existing files')
    .description('Generate a new controller')
    .action((name, options) => {
        const args = [`"${name}"`];
        if (options.service) args.push('-s');
        if (options.view) args.push('-v');
        if (options.model) args.push('-m');
        if (options.force) args.push('--force');
        execSync(`node "${cliPath('controller')}" ${args.join(' ')}`, {
            stdio: 'inherit'
        });
    });

// 🧠 make:model
program
    .command('make:model <name>')
    .option('--force', 'Overwrite if exists')
    .description('Generate a new Prisma model schema')
    .action((name, options) => {
        const args = [`"${name}"`];
        if (options.force) args.push('--force');
        execSync(`node "${cliPath('model')}" ${args.join(' ')}`, {
            stdio: 'inherit'
        });
    });

// 🧠 make:service
program
    .command('make:service <name>')
    .option('--force', 'Overwrite existing file')
    .description('Generate a new service file')
    .action((name, options) => {
        const args = [`"${name}"`];
        if (options.force) args.push('--force');
        execSync(`node "${cliPath('service')}" ${args.join(' ')}`, {
            stdio: 'inherit'
        });
    });

// 🧠 make:view
program
    .command('make:view <name>')
    .option('--force', 'Overwrite if exists')
    .description('Generate view files (index, create, edit, show)')
    .action((name, options) => {
        const args = [`"${name}"`];
        if (options.force) args.push('--force');
        execSync(`node "${cliPath('view')}" ${args.join(' ')}`, {
            stdio: 'inherit'
        });
    });

// 🧠 route:list
    program
        .command('route:list')
        .description('Display all registered routes')
        .action(() => {
            execSync(`node "${cliPath('routes-list')}"`, {
                stdio: 'inherit'
            });
        });

// 🧠 run
program
    .command('run <script>')
    .description('Run npm script (e.g. dev, seed)')
    .action((script) => {
        execSync(`npm run ${script}`, {
            stdio: 'inherit'
        });
    });

// 🧠 dev
program
    .command('dev')
    .description('Run dev script')
    .action(() => {
        execSync('npm run dev', {
            stdio: 'inherit'
        });
    });

program.parse();

