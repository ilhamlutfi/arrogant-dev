import express from "express";

const dashboardRouter = express.Router();

import DashboardController from "../app/controllers/dashboard.controller.js";
import { isNotAuthenticated } from "../app/middlewares/auth.middleware.js";

// must be authenticated to access the dashboard
dashboardRouter.use(isNotAuthenticated);
dashboardRouter.get("/", DashboardController.index);

export default dashboardRouter;
