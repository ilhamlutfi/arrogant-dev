#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
    fileURLToPath
} from 'url';

// Setup __dirname untuk ES Module
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Parsing argumen
const args = process.argv.slice(2);
const rawName = args.find(arg => !arg.startsWith('-'));

// Flags
const useService = args.includes('-s') || args.includes('-sv') || args.includes('-vs');
const useView = args.includes('-v') || args.includes('-sv') || args.includes('-vs');

// Validasi nama
if (!rawName) {
    console.error('❌ Nama controller harus diisi. Contoh: npm run make:controller User [-s] [-v]');
    process.exit(1);
}

// Parsing nama + path folder
const pathParts = rawName.split(/[\\/]/); // mendukung slash dan backslash
const baseName = pathParts.pop();
const folderPath = pathParts.join('/');
const name = baseName.toLowerCase();
const className = baseName.charAt(0).toUpperCase() + baseName.slice(1);

// Path untuk controller
const controllerDir = path.join(__dirname, '../app/controllers', folderPath);
const controllerFileName = `${name}.controller.js`;
const controllerPath = path.join(controllerDir, controllerFileName);

// Path untuk view
const viewDir = path.join(__dirname, '../views', folderPath || name); // nama folder = nama controller jika tidak nested

// Template standar controller
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

// Template dengan service
const serviceTemplate = `
// Controller: ${className}

import { render } from "../config/view.js";
import ${className}Service from "../services/${name}.service.js";

class ${name}Controller {
  constructor() {
    this.service = ${className}Service;
  }

  index = async (req, res) => {
    const data = await this.service.getAll();
    return render('${name}/index', { data }, req, res);
  };

  create = async (req, res) => {
    return render('${name}/create', {}, req, res);
  };

  store = async (req, res) => {
    await this.service.store(req.body);
    return res.json({ message: "Data berhasil disimpan" });
  };

  show = async (req, res) => {
    const item = await this.service.getById(req.params.id);
    return res.json({ item });
  };

  edit = async (req, res) => {
    const item = await this.service.getById(req.params.id);
    return render('${name}/edit', { item }, req, res);
  };

  update = async (req, res) => {
    await this.service.update(req.params.id, req.body);
    return res.json({ message: "Data berhasil diupdate" });
  };

  destroy = async (req, res) => {
    await this.service.delete(req.params.id);
    return res.json({ message: "Data berhasil dihapus" });
  };
}

export default new ${name}Controller();
`;

const content = useService ? serviceTemplate : standardTemplate;

// Buat direktori controller jika belum ada
fs.mkdirSync(controllerDir, {
    recursive: true
});

// Cek file duplikat
if (fs.existsSync(controllerPath)) {
    console.error(`❌ File sudah ada: ${controllerPath}`);
    process.exit(1);
}

// Tulis file controller
fs.writeFileSync(controllerPath, content);
console.log(`✅ Controller berhasil dibuat: ${controllerPath}`);
console.log(useService ? '✨ Dengan service' : '✨ Tanpa service');

// 🔧 Tambahan: Buat folder view dan file index/create/edit.edge
if (useView) {
    const viewDir = path.join(__dirname, '../views', folderPath, name); // 👈 gunakan full path

    fs.mkdirSync(viewDir, {
        recursive: true
    });

    const viewFiles = ['index.edge', 'create.edge', 'edit.edge', 'show.edge'];
    viewFiles.forEach(file => {
        const viewFilePath = path.join(viewDir, file);
        if (!fs.existsSync(viewFilePath)) {
            fs.writeFileSync(viewFilePath, `<!-- ${file} view for ${className} -->`);
        }
    });

    console.log(`📄 View berhasil dibuat di folder: ${viewDir}`);
}

// Buat file service jika flag -s
if (useService) {
    const serviceDir = path.join(__dirname, '../app/services', folderPath);
    const serviceFilePath = path.join(serviceDir, `${name}.service.js`);

    const serviceTemplate = `
  // Service: ${className}
  
  import prisma from "../../prisma/client.js";
  
  class ${className}Service {
    getAll = async () => {
      return await prisma.${name}.findMany();
    };
  
    getById = async (id) => {
      return await prisma.${name}.findUnique({
        where: { id: parseInt(id) }
      });
    };
  
    store = async (data) => {
      return await prisma.${name}.create({ data });
    };
  
    update = async (id, data) => {
      return await prisma.${name}.update({
        where: { id: parseInt(id) },
        data
      });
    };
  
    delete = async (id) => {
      return await prisma.${name}.delete({
        where: { id: parseInt(id) }
      });
    };
  }
  
  export default new ${className}Service();
  `;

    fs.mkdirSync(serviceDir, {
        recursive: true
    });

    if (!fs.existsSync(serviceFilePath)) {
        fs.writeFileSync(serviceFilePath, serviceTemplate);
        console.log(`🔧 Service berhasil dibuat: ${serviceFilePath}`);
    } else {
        console.log(`⚠️  Service sudah ada: ${serviceFilePath}`);
    }
}
