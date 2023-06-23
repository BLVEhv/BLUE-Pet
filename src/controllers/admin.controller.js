import { createAdmin } from "../services/admin.service.js";
import { OK } from "../core/success.response.js";
class AdminController {
  createAdmin = async (req, res, next) => {
    try {
      new OK({
        metadata: await createAdmin(req.body),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };
}

export default new AdminController();
