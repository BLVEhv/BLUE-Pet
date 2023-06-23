import { OK } from "../core/success.response.js";
import { userChangePassword } from "../services/user.service.js";
class UserController {
  changePassword = async (req, res, next) => {
    const clientId = req.headers["x-client-id"];
    try {
      new OK({
        metadata: await userChangePassword(clientId, req.body),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };
}

export default new UserController();
