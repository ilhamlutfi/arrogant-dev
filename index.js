// app.js
import express from "express";
import dotenv from "dotenv";
import router from "./routes/main.route.js";
import path from "path";
import { Edge } from "edge.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://localhost";

// Inisialisasi Edge.js
const edge = Edge.create();
edge.mount(path.resolve() + "/views");

// Middleware agar bisa diakses di controller
app.use((req, res, next) => {
    res.edge = edge;
    next();
});

// Middleware untuk parsing form
app.use(express.urlencoded({
    extended: true
}));

// static file serving
app.use(express.static(path.resolve('public')));

// Routing
app.use(router);

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server listening on ${BASE_URL}:${PORT}`);
});
