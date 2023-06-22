import JWT from "jsonwebtoken";
import { AuthFailureError, NotFoundError } from "../core/error.response.js";
import KeyTokenService from "../services/keytoken.service.js";

const HEADER = {
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (playload, publicKey, privateKey) => {
  try {
    //accessToken
    const accessToken = await JWT.sign(playload, publicKey, {
      expiresIn: "2 days",
    });
    //refreshToken
    const refreshToken = await JWT.sign(playload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("Error verify:", err);
      } else {
        console.log("Decode verify:", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err);
  }
};

const authentication = async (req, res, next) => {
  //1.Check userId
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid request");
  }
  //2.Get accessToken
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Not found keyStore");
  }
  //3.Verify token
  const accessToken = req.headers[HEADER.AUTHORIZATION].split(" ")[1];
  if (!accessToken) {
    throw new AuthFailureError("Unauthorization");
  }
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid userId");
    }
    req.keyStore = keyStore;
    return next();
  } catch (err) {
    console.log(err);
  }
};

export { createTokenPair, authentication };
