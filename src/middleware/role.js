function checkRoleMiddleware(roles) {
  return async (req, res, next) => {
    try {
      if (!roles || roles.length === 0) {
        return res.status(400).send({ msg: "Roles not provided" });
      }

      if (!req.user) {
        return res.status(401).send({ msg: "Access denied" });
      }

      const userRoles = req.user.roles;
      const authorized = roles.some((role) => userRoles.includes(role));

      if (!authorized) {
        return next(new Error("Access denied"));
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export default checkRoleMiddleware;
