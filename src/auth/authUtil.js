import JWT from "jsonwebtoken";

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

export default createTokenPair;
