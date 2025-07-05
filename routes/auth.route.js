import express from 'express';
import AuthController from '../app/controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.get('/login', AuthController.loginView);

export default authRouter;
