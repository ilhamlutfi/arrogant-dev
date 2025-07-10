#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
  fileURLToPath
} from 'url';

// Setup __dirname for ES Module
const __filename = fileURLToPath(
  import.meta.url);
const __dirname = path.dirname(__filename);

// Parse arguments
const args = process.argv.slice(2);
const rawName = args.find(arg => !arg.startsWith('-'));

// Flags
const useService = args.includes('-s') || args.includes('-sv') || args.includes('-vs');
const useView = args.includes('-v') || args.includes('-sv') || args.includes('-vs');
const force = args.includes('--force'); // 🆕 Tambahan

// Validate name
if (!rawName) {
  console.error('❌ Controller name is required. Example: arrogant make:controller User [-s] [-v] [--force]');
  process.exit(1);
}

// Parse name + folder path
const pathParts = rawName.split(/[\\/]/);
const baseName = pathParts.pop();
const folderPath = pathParts.join('/');
const name = baseName.toLowerCase();
const className = baseName.charAt(0).toUpperCase() + baseName.slice(1);

// Path setup
const controllerDir = path.join(__dirname, '../app/controllers', folderPath);
const controllerFileName = `${name}.controller.js`;
const controllerPath = path.join(controllerDir, controllerFileName);
const viewDir = path.join(__dirname, '../views', folderPath || name);

// Controller Templates
const standardTemplate = `
// Controller: ${className}

import { render } from "../config/view.js";

class ${name}Controller {
  index = async (req, res) => {
    return render('${name}/index', {}, req, res);
  };

  create = async (req, res) => {
    return render('${name}/create', {}, req, res);
  };

  store = async (req, res) => {
    return res.json({ message: "store ${name}" });
  };

  show = async (req, res) => {
    return res.json({ message: "show ${name} id " + req.params.id });
  };

  edit = async (req, res) => {
    return render('${name}/edit', {}, req, res);
  };

  update = async (req, res) => {
    return res.json({ message: "update ${name} id " + req.params.id });
  };

  destroy = async (req, res) => {
    return res.json({ message: "delete ${name} id " + req.params.id });
  };
}
export default new ${name}Controller();
`;

const serviceTemplate = `
// Controller: ${className}

import { render } from "../config/view.js";
import ${className}Service from "../services/${name}.service.js";

class ${name}Controller {
  constructor() {
    this.service = ${className}Service;
  }

  async index(req, res) {
    const data = await this.service.getAll();
    return render('${name}/index', { data }, req, res);
  }

  async create(req, res) {
    return render('${name}/create', {}, req, res);
  }

  async store(req, res) {
    await this.service.store(req.body);
    return res.json({ message: "Saved" });
  }

  async show(req, res) {
    const item = await this.service.getById(req.params.id);
    return res.json({ item });
  }

  async edit(req, res) {
    const item = await this.service.getById(req.params.id);
    return render('${name}/edit', { item }, req, res);
  }

  async update(req, res) {
    await this.service.update(req.params.id, req.body);
    return res.json({ message: "Updated" });
  }

  async destroy(req, res) {
    await this.service.delete(req.params.id);
    return res.json({ message: "Deleted" });
  }
}

export default new ${name}Controller();
`;

const content = useService ? serviceTemplate : standardTemplate;

// Create controller directory
fs.mkdirSync(controllerDir, {
  recursive: true
});

// 🧠 Check if controller already exists
if (fs.existsSync(controllerPath) && !force) {
  console.error(`❌ File already exists: ${controllerPath}`);
  console.error(`👉 Use --force to overwrite.`);
  process.exit(1);
}

// ✅ Write controller file (overwrite if --force)
fs.writeFileSync(controllerPath, content);
console.log(`✅ Controller ${force ? 'overwritten' : 'created'}: ${controllerPath}`);
console.log(useService ? '✨ With service' : '✨ Without service');

// 📄 Generate view if needed
if (useView) {
  const fullViewDir = path.join(__dirname, '../views', folderPath, name);
  fs.mkdirSync(fullViewDir, {
    recursive: true
  });
  ['index.edge', 'create.edge', 'edit.edge', 'show.edge'].forEach(file => {
    const filePath = path.join(fullViewDir, file);
    if (!fs.existsSync(filePath) || force) {
      fs.writeFileSync(filePath, `<!-- ${file} view for ${className} -->`);
    }
  });
  console.log(`📄 Views ${force ? 'overwritten' : 'created'} in: ${fullViewDir}`);
}

// 🛠️ Generate service if needed
if (useService) {
  const serviceDir = path.join(__dirname, '../app/services', folderPath);
  const serviceFilePath = path.join(serviceDir, `${name}.service.js`);

  const serviceFileContent = `
  // Service: ${className}
  import prisma from "../../prisma/client.js";

  class ${className}Service {
    getAll = async () => {
      return await prisma.${name}.findMany();
    }

    getById = async (id) => {
      return await prisma.${name}.findUnique({
        where: { id: parseInt(id) }
      });
    }

    store = async (data) => {
      return await prisma.${name}.create({ data });
    }

    update = async (id, data) => {
      return await prisma.${name}.update({
        where: { id: parseInt(id) },
        data
      });
    }

    delete = async (id) => {
      return await prisma.${name}.delete({
        where: { id: parseInt(id) }
      });
    }
  }

  export default new ${className}Service();
  `;

  fs.mkdirSync(serviceDir, {
    recursive: true
  });

  if (!fs.existsSync(serviceFilePath) || force) {
    fs.writeFileSync(serviceFilePath, serviceFileContent);
    console.log(`🔧 Service ${force ? 'overwritten' : 'created'}: ${serviceFilePath}`);
  } else {
    console.log(`⚠️  Service already exists: ${serviceFilePath}`);
  }
}
