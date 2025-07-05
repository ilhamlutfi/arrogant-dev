import express from "express";
import homeRouter from "./front.route.js";
import dashboardRouter from "./dashboard.route.js";
import authRouter from "./auth.route.js";

const router = express.Router();

router.use("/", homeRouter);
router.use("/dashboard", dashboardRouter);
router.use("/", authRouter);

export default router;
