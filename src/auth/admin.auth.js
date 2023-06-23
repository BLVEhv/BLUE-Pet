import { findAdminById } from "../services/admin.service.js";
import KeyAdminService from "../services/keyadmin.service.js";
import { AuthFailureError, NotFoundError } from "../core/error.response.js";
import JWT from "jsonwebtoken";
const HEADER = {
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const adminAuthentication = async (req, res, next) => {
  //Check adminId
  const adminId = req.headers[HEADER.CLIENT_ID];
  if (!adminId) {
    throw new AuthFailureError("Invalid request");
  }
  //Check role
  const adminFound = await findAdminById(adminId);
  if (!adminFound) {
    throw new AuthFailureError("Invalid request");
  }
  if (adminFound.role !== "Admin") {
    throw new AuthFailureError("Invalid request");
  }
  //Get accessToken
  const keyStoreAdmin = await KeyAdminService.findByAdminId(adminId);
  if (!keyStoreAdmin) {
    throw new NotFoundError("Not found keyStoreAdmin");
  }
  //Verify token
  const accessToken = req.headers[HEADER.AUTHORIZATION].split(" ")[1];
  if (!accessToken) {
    throw new AuthFailureError("Unauthorization");
  }
  try {
    const decodeUser = JWT.verify(accessToken, keyStoreAdmin.publicKey);
    if (adminId !== decodeUser.adminId) {
      throw new AuthFailureError("Invalid admin");
    }
    req.keyStoreAdmin = keyStoreAdmin;
    return next();
  } catch (err) {
    console.log(err);
  }
};

export default adminAuthentication;
