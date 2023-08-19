const createError = require("http-errors");
const { UserModel } = require("../models/user");

function authorize(...allowwedRoles) {
  return async function (req, res, next) {
    try {
      const userId = req.user._id;
      const user = await UserModel.findById(userId);
      if (allowwedRoles.length === 0 || allowwedRoles.includes(user.role))
        return next();
      throw createError.Forbidden("you dont have access to this section");
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { authorize };
