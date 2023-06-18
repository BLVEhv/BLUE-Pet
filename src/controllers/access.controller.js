"use strict";

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(req.body);
      return res.status(201).json({
        metadata: { userId: 1 },
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new AccessController();
