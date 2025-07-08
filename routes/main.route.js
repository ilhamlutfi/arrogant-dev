import express from "express";
import dashboardRouter from "./dashboard.route.js";
import authRouter from "./auth.route.js";
import transactionRouter from "./transaction.route.js";

const router = express.Router();

router.get("/", (req, res) => {
    return res.redirect("/login");
});

router.use("/dashboard", dashboardRouter);
router.use("/", authRouter);
router.use("/transactions", transactionRouter);

export default router;
