import express from 'express';
import AuthController from '../app/controllers/auth.controller.js';
import { isAuthenticated, isNotAuthenticated } from '../app/middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter.get('/login', isAuthenticated, AuthController.loginView);
authRouter.post('/login', AuthController.loginAttempt);

export default authRouter;
