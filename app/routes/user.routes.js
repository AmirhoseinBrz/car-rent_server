const expressAsyncHandler = require("express-async-handler");
const router = require("express").Router();
const { UserController } = require("../http/controllers/user/user.controller");
const { verifyAccessToken } = require("../http/middlewares/user.middleware");

router.post("/register", expressAsyncHandler(UserController.Register));
router.post("/login", expressAsyncHandler(UserController.Login));
router.post(
  "/upload",
  verifyAccessToken,
  expressAsyncHandler(UserController.Login)
);

router.get("/refresh-token", expressAsyncHandler(UserController.refreshToken));
router.get(
  "/profile",
  verifyAccessToken,
  expressAsyncHandler(UserController.getProfile)
);

router.get(
  "/logout",
  verifyAccessToken,
  expressAsyncHandler(UserController.DeleteUser)
);

module.exports = { UserAutRoutes: router };
