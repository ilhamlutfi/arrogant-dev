import express from "express";
import homeController from "../app/controllers/home.controller.js";

const router = express.Router();

router.get("/", homeController.index);

export default router;
