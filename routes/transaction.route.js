import express from "express";
import transactionController from "../app/controllers/transaction.controller.js";

const transactionRouter = express.Router();

transactionRouter.get("/create", transactionController.create);
transactionRouter.post("/", transactionController.store);

export default transactionRouter;
