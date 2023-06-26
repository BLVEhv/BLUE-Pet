import jwt from "jsonwebtoken";

function checkRoleMiddleware(roles) {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const decode = token ? jwt.verify(token, process.env.SECRET) : null;

      if (
        decode &&
        decode.user.roles &&
        roles &&
        roles.some((role) => decode.user.roles.includes(role))
      ) {
        return next();
      }

      throw new Error("Access denied");
    } catch (error) {
      res.status(401).send({ msg: error.message });
    }
  };
}

export default checkRoleMiddleware;
