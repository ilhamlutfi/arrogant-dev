import { render } from "../config/view.js";

class DashboardController {
    async index(req, res) {
        const data = {
            title: "Beranda",
            name: "Ilham Lutfi"
        };

        return render(req, res, 'dashboard/index', data);
    }
}

export default new DashboardController();
