const cookieParser = require("cookie-parser");
const createHttpError = require("http-errors");
const JWT = require("jsonwebtoken");
const { UserModel } = require("../models/user");

async function verifyAccessToken(req, res, next) {
  try {
    const accessToken = req.signedCookies["accessToken"];
    if (!accessToken) {
      throw createHttpError.Unauthorized("please sign to your account !!!");
    }

    const token = cookieParser.signedCookie(
      accessToken,
      process.env.COOKIE_PARSER_SECRET_KEY
    );
    JWT.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      async (error, payload) => {
        try {
          if (error) {
            throw createHttpError.Unauthorized("token is invalid !!!");
          }
          const { _id } = payload;
          const user = await UserModel.findOne(
            { email: _id },
            {
              password: 0,
            }
          );
          if (!user)
            throw createHttpError.Unauthorized("account is not found !!!");
          req.user = user;
          return next();
        } catch (error) {
          next(error);
        }
      }
    );
  } catch (error) {
    next(error);
  }
}

function decideAuthMiddleware(req, res, next) {
  const accessToken = req.signedCookies["accessToken"];
  if (accessToken) {
    return verifyAccessToken(req, res, next);
  }
  next();
}

module.exports = {
  verifyAccessToken,
  decideAuthMiddleware,
};
