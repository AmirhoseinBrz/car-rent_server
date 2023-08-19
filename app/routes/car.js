const router = require("express").Router();
const {
  verifyAccessToken,
  decideAuthMiddleware,
} = require("../http/middlewares/user.middleware");
const { CarController } = require("../http/controllers/car/car.controller");
const expressAsyncHandler = require("express-async-handler");
const { upload } = require("../../utils/upload");
const { deleteAllFilesInDir } = require("../../utils/function");

router.get(
  "/",
  decideAuthMiddleware,
  (expressAsyncHandler(CarController.getAll))
);

router.get(
  "/like",
  verifyAccessToken,
  expressAsyncHandler(CarController.getProductLiked)
);

router.get(
  "/like/:id",
  verifyAccessToken,
  expressAsyncHandler(CarController.Like)
);

router.get(
  "/:id",
  decideAuthMiddleware,
  expressAsyncHandler(CarController.findOne)
);

router.post("/", verifyAccessToken, expressAsyncHandler(CarController.add));



router.post(
  "/upload",
  verifyAccessToken,
  deleteAllFilesInDir,
  upload("car").fields([
    { name: "single_img", maxCount: 1 },
    { name: "multi_img", maxCount: 3 },
  ]),
  expressAsyncHandler(CarController.addUrlImg)
);

module.exports = { CarRoutes: router };
