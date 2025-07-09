# 💰 Cash App - Express MVC Boilerplate

Cash App adalah boilerplate Express.js bergaya MVC (Model-View-Controller) + Service Layer yang dibangun dengan:
- Express 5
- Prisma ORM
- Edge.js View Engine
- SweetAlert + FormHandler Ajax (jQuery)
- CLI Artisan-style (seperti Laravel) untuk membuat controller, view, service, dan model

---

# 🚀 CLI Commands - Express Generator

## 📦 Setup
Tambahkan ke `package.json`:

```json
"scripts": {
  "make:controller": "node ./cli/make-controller.js",
  "make:view": "node ./cli/make-view.js",
  "make:service": "node ./cli/make-service.js",
  "make:model": "node ./cli/make-model.js"
}

🔧 Controller

npm run make:controller [path/name] 
npm run make:controller -- [path/name] [flags]

Flags :
-s : Buat service
-v : Buat view (index/create/edit/show)
-sv / -vs : Buat service + view

📄 Model Schema Prisma

npm run make:model [name]

Contoh:
npm run make:model Account

🧩 View

npm run make:view [path/name]
npm run make:view -- [path/name] [--force]

Contoh:
npm run make:view user/dashboard

🔌 Service

npm run make:service [path/name]
npm run make:service -- [path/name] [--force]

Contoh:
- npm run make:service user/account
