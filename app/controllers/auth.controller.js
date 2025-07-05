import { render } from "../config/view.js";
import RequestValidator from "../config/validator.js";
import { LoginValidate } from "../validations/auth.validation.js";
import prisma from "../../prisma/client.js";
import bcrypt from "bcrypt";

class AuthController {
    async loginView(req, res) {
        return render('auth/login', {}, req, res);
    }
    
    async loginAttempt(req, res) {
        try {
            const errors = await RequestValidator.validate(req, LoginValidate.rules());

            if (errors) {
                return res.status(422).json({ errors});
            }

            const {
                email,
                password
            } = req.body;

            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            });

            if (!user) {
                return res.status(422).json({
                    errors: {
                        email: {
                            msg: 'Email atau password salah'
                        },
                        password: {
                            msg: 'Email atau password salah'
                        }
                    }
                });
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(422).json({
                    errors: {
                        email: {
                            msg: 'Email atau password salah'
                        },
                        password: {
                            msg: 'Email atau password salah'
                        }
                    }
                });
            }

            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            // Override maxAge untuk "remember me"
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 30 hari

            return res.json({
                success: true,
                message: 'Login berhasil!',
                redirect: '/dashboard'
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Terjadi kesalahan saat login: ' + error.message
            });
        }
    }
}

export default new AuthController();
