const HEADER = {
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const authentication = async (req, res, next) => {
  //1.Check adminId
  const adminId = req.headers[HEADER.CLIENT_ID];
  if (!adminId) {
    throw new AuthFailureError("Invalid request");
  }
  //2.Get accessToken
  const keyStore = await KeyTokenService.findByUserId(adminId);
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
    if (adminId !== decodeUser.adminId) {
      throw new AuthFailureError("Invalid adminId");
    }
    req.keyStore = keyStore;
    return next();
  } catch (err) {
    console.log(err);
  }
};
