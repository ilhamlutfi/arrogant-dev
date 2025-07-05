import express from 'express';
import authController from '../app/controllers/auth.controller.js';
import { isAuthenticated, isNotAuthenticated } from '../app/middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter.get('/login', isAuthenticated, authController.loginView);
authRouter.post('/login', authController.loginAttempt);

export default authRouter;
