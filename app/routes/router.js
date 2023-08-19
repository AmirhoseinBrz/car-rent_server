const router = require("express").Router();
const { verifyRefreshToken } = require("../../utils/function");
const { verifyAccessToken } = require("../http/middlewares/user.middleware");
const { CarRoutes } = require("./car");
const { UserAutRoutes } = require("./user.routes");

router.use("/user", UserAutRoutes);
router.use("/car", CarRoutes);

module.exports = { AllRoutes: router };
