import express from "express";

const dashboardRouter = express.Router();

import DashboardController from "../app/controllers/dashboard.controller.js";

dashboardRouter.get("/", DashboardController.index);

export default dashboardRouter;
