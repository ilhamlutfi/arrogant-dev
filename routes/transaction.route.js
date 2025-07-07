import express from "express";
import transactionController from "../app/controllers/transaction.controller.js";

const transactionRouter = express.Router();

transactionRouter.route('/')
    .get(transactionController.index)
    .post(transactionController.store);

transactionRouter.get("/create", transactionController.create);
transactionRouter.get("/archive", transactionController.archive);
transactionRouter.get('/:year/:month', transactionController.byMonth); // transaksi bulan tertentu


export default transactionRouter;
