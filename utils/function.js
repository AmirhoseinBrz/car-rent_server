const createHttpError = require("http-errors");
const JWT = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require("fs/promises");
const fsRoot = require("fs");
const path = require("path");
const { UserModel } = require("../app/http/models/user");

async function setAccessToken(res, user) {
  const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 1,
    httpOnly: true,
    signed: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "development" ? false : true,
    domain:
      process.env.NODE_ENV === "development" ? "localhost " : ".iran.liara.run",
  };
  res.cookie(
    "accessToken",
    await generateToken(user, "1d", process.env.ACCESS_TOKEN_SECRET_KEY),
    cookieOptions
  );
}

async function deleteCookie(res, req) {
  const user = req.user;
  const cookieOptions = {
    maxAge: 0,
    httpOnly: true,
    signed: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "development" ? false : true,
    domain:
      process.env.NODE_ENV === "development" ? "localhost " : ".iran.liara.run",
  };

  res.cookie(
    "accessToken",
    await generateToken(user, "-1s", process.env.ACCESS_TOKEN_SECRET_KEY),
    cookieOptions
  );

  res.cookie(
    "refreshToken",
    await generateToken(user, "-1s", process.env.ACCESS_TOKEN_SECRET_KEY),
    cookieOptions
  );
}

async function setRefreshToken(res, user) {
  const cookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    httpOnly: true,
    signed: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "development" ? false : true,
    domain:
      process.env.NODE_ENV === "development" ? "localhost " : ".iran.liara.run",
  };
  res.cookie(
    "refreshToken",
    await generateToken(user, "1y", process.env.REFRESH_TOKEN_SECRET_KEY),
    cookieOptions
  );
}

function verifyRefreshToken(req) {
  const refreshToken = req.signedCookies["refreshToken"];
  if (!refreshToken) {
    throw createHttpError.Unauthorized("please login");
  }
  const token = cookieParser.signedCookie(
    refreshToken,
    process.env.COOKIE_PARSER_SECRET_KEY
  );
  return new Promise((resolve, reject) => {
    JWT.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      async (error, payload) => {
        try {
          if (error) {
            throw reject(createHttpError.Unauthorized("please login"));
          }
          const { _id } = payload;
          const user = await UserModel.findOne({ email: _id });
          if (!user) {
            throw reject(createHttpError.Unauthorized("use not found"));
          }
          return resolve(_id);
        } catch (error) {
          reject(createHttpError.Unauthorized("user not found"));
        }
      }
    );
  });
}

function generateToken(user, expiresIn, secret) {
  return new Promise((resolve, reject) => {
    const payload = {
      _id: user.email,
    };

    const options = {
      expiresIn,
    };

    JWT.sign(
      payload,
      secret || process.env.TOKEN_SECRET_KEY,
      options,
      (error, token) => {
        if (error) {
          reject(createHttpError.InternalServerError("server error"));
        }
        resolve(token);
      }
    );
  });
}

async function deleteAllFilesInDir(req, res, next) {
  try {
    const dirPath = `public/uploads/car/${req.query.id}`;
    if (fsRoot.existsSync(dirPath)) {
      const files = await fs.readdir(dirPath);

      const deleteFilePromises = files.map((file) =>
        fs.unlink(path.join(dirPath, file))
      );
    }
    next();
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  setAccessToken,
  setRefreshToken,
  verifyRefreshToken,
  deleteAllFilesInDir,
  deleteCookie,
};
