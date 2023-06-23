import AccessService from "../services/access.service.js";

class AdminController {
  logIn = async (req, res, next) => {
    new OK({
      metadata: await AccessService.logInAdmin(req.body),
    }).send(res);
  };
}

export default new AdminController();
