
// Controller: Home

import { render } from "../config/view.js";

class homeController {
  index = async (req, res) => {
    return render('home', {}, req, res);
  };
}

export default new homeController();
