// app.js
import express from "express";
import dotenv from "dotenv";
import router from "./routes/main.route.js";
import path from "path";
import { Edge } from "edge.js";
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import { generateCsrfToken, verifyCsrfToken } from './app/config/csrf.js';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import flash from 'connect-flash';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://localhost";
const edge = Edge.create();

// limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    headers: true,
});

app.use(limiter);
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true })); // Middleware untuk parsing form data
app.use(express.json()); // Middleware untuk parsing JSON
app.use(cookieParser());
app.use(flash());

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true if https
        maxAge: 24 * 60 * 60 * 1000
    },
    store: new(createMemoryStore(session))({
        checkPeriod: 43200000 // prune expired entries every 12h
    }),
}));

// CSRF
app.use(generateCsrfToken);
app.use((req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        return verifyCsrfToken(req, res, next);
    }
    next();
});

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

// Set view engine
edge.mount(path.resolve() + "/views");


// Routing
app.use(router);

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server listening on ${BASE_URL}:${PORT}`);
});
