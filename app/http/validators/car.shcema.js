const createHttpError = require("http-errors");
const Joi = require("joi");

const addCarSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .trim()
    .required()
    .error(createHttpError.BadRequest("لطفا نام صحیح را وارد کنید")),
  description: Joi.string()
    .min(10)
    .max(250)
    .required()
    .error(
      createHttpError.BadRequest("لطفا معرفی ماشین را به درستی وارد کنید")
    ),
  typeCar: Joi.string()
    .required()
    .error(createHttpError.BadRequest("لطفا نوع خودرو را به درستی وارد کنید")),
  steering: Joi.string()
    .required()
    .error(createHttpError.BadRequest("لطفا مدل فرمان را به درستی وارد کنید")),
  gasoline: Joi.number()
    .required()
    .error(createHttpError.BadRequest("لطفا مقدار باک را به درستی وارد کنید")),
  capacity: Joi.number()
    .required()
    .error(
      createHttpError.BadRequest("لطفا تعداد سرنشین را به درستی وارد کنید")
    ),
  price: Joi.number()
    .required()
    .error(createHttpError.BadRequest("لطفا قیمت ماشین را به درستی وارد کنید")),
  offPrice: Joi.number()
    .required()
    .error(createHttpError.BadRequest("لطفا درصد تخفیف را به درستی وارد کنید")),
});

module.exports = {
  addCarSchema,
};
