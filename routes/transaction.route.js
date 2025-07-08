import express from "express";
import transactionController from "../app/controllers/transaction.controller.js";

const transactionRouter = express.Router();

// main route
transactionRouter.route('/')
    .get(transactionController.index)
    .post(transactionController.store);

// route edit
transactionRouter.get('/:id/edit', transactionController.edit);

// route :id
transactionRouter.route('/:id')
    .put(transactionController.update)
    // .delete(transactionController.destroy);

// Custom routes
transactionRouter.get('/create', transactionController.create);
transactionRouter.get('/archive', transactionController.archive);
transactionRouter.get('/:year/:month', transactionController.byMonth);

export default transactionRouter;
