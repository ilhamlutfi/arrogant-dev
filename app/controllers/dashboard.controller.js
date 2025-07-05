import { render } from "../config/view.js";

class DashboardController {
    async index(req, res) {
        const data = {
            title: "Cash App",
        };

        return render('dashboard/index', data, req, res);
    }
}

export default new DashboardController();
