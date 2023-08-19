const createHttpError = require("http-errors");
const { StatusCodes: Http_Codes } = require("http-status-codes");
const { CarModel } = require("../../models/car");
const { addCarSchema } = require("../../validators/car.shcema");
const Controller = require("../controller");
const { UserModel } = require("../../models/user");
const user = require("../../models/user");

class carController extends Controller {
  constructor() {
    super();
  }

  async getAll(req, res) {
    const filter = req.query;
    const response = await CarModel.find(filter, {
      description: 0,
      rating: 0,
      numReviews: 0,
      gallery: 0,
      comments: 0,
      createdAt: 0,
      updatedAt: 0,
    });

    const carLength = await CarModel.count();

    if (req.user) {
      const userId = req.user._id;
      if (userId) {
        const newCars = response.map((product) => {
          product.isLiked = false;
          if (!req.user._id) {
            product.isLiked = false;
            return product;
          }
          if (product.likes.includes(req.user._id)) {
            product.isLiked = true;
          }
          product.likes = undefined;
          return product;
        });

        return res.status(200).send({ data: newCars, carLength });
      }
    }

    return res.status(200).json({ data: response, carLength });
  }

  async findOne(req, res) {
    const { id: _id } = req.params;

    const response = await CarModel.findOne(
      { _id },
      {
        name: 1,
        typeCar: 1,
        steering: 1,
        capacity: 1,
        gasoline: 1,
        price: 1,
        offPrice: 1,
        isLiked: 1,
        gallery: 1,
        description: 1,
        numReviews: 1,
      }
    );

    res.status(200).json(response);
  }

  async add(req, res) {
    await addCarSchema.validateAsync(req.body);

    const { name } = req.body;

    const car = await CarModel.findOne({ name });

    if (car) {
      throw createHttpError.BadRequest("این اسم قبلا ثبت شده است");
    }

    const newCar = await CarModel.create(req.body);
    if (!newCar) {
      throw createHttpError.BadRequest("ثبت اطلاعات با خطا مواجه شد");
    }

    res.status(Http_Codes.OK).json({
      message: "ثبت خودرو با موفقیت انجام شد!",
      data: newCar,
    });
  }

  async Like(req, res) {
    const { id } = req.params;

    const Car = await CarModel.findOne({ _id: id });

    if (!Car) {
      throw createHttpError.BadRequest("خودرویی با مشخصات وارد شده یافت نشد!");
    }

    if (Car.likes.includes(req.user._id)) {
      Car.likes.pop(id);
      await Car.save();
      return res.status(200).json({ message: "لایک شما برداشته شد" });
    }

    const user = await UserModel.updateOne(
      { email: req.user.email },
      { $addToSet: { likedProducts: Car._id } }
    );

    if (!user) {
      throw createHttpError.BadRequest("لایک محصول با خطا مواجه شد");
    }

    const userId = req.user._id;

    if (!Car.likes.includes(userId)) {
      Car.likes.push(userId);

      await Car.save();
    }

    res.status(200).json({
      message: "لایک شما اضافه شد",
    });
  }

  async addUrlImg(req, res) {
    const { single_img, multi_img } = req.files;

    const { id } = req.query;

    if (!id) {
      throw createHttpError.BadRequest("لطفا شناسه کالا را وارد نمایید");
    }

    const singleImagePath = `${process.env.SERVER_URL}/uploads/car/${id}/${single_img[0].filename}`;

    const multiImagePath = multi_img.map((img) => ({
      address: `${process.env.SERVER_URL}/uploads/car/${id}/${img.filename}`,
    }));

    await CarModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          imageLink: singleImagePath,
          gallery: multiImagePath,
        },
      }
    );

    res.status(200).json({});
  }

  async getProductLiked(req, res) {
    const cars = await CarModel.find();

    const newCars = cars.map((product) => {
      product.isLiked = false;
      if (!req.user._id) {
        product.isLiked = false;
        return product;
      }
      if (product.likes.includes(req.user._id)) {
        product.isLiked = true;
      }
      product.likes = undefined;
      return product;
    });
    return newCars;
  }
}

module.exports = { CarController: new carController() };
