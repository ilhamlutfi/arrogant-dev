import { render } from "../config/view.js";

class AuthController {
    async loginView(req, res) {
        return render('auth/login', {}, req, res);
    }
}

export default new AuthController();
