import express from "express";
import homeRouter from "./front.route.js";
import dashboardRouter from "./dashboard.route.js";
import authRouter from "./auth.route.js";
import transactionRouter from "./transaction.route.js";

const router = express.Router();

router.use("/", homeRouter);
router.use("/dashboard", dashboardRouter);
router.use("/", authRouter);
router.use("/transactions", transactionRouter);

export default router;
