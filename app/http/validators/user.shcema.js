const Joi = require("joi");
const createHttpError = require("http-errors");

const createUserSchema = Joi.object({
  fullName: Joi.string()
    .required()
    .error(createHttpError.BadRequest("please set your name!")),
  email: Joi.string()
    .email()
    .required()
    .error(createHttpError("please wset your email")),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .error(createHttpError.BadRequest("please set a password")),
});

const LoginUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .error(createHttpError("please wset your email")),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .error(createHttpError.BadRequest("passwrod field is requied")),
});

// const updateUser = Joi.object({

// })

module.exports = {
  createUserSchema,
  LoginUserSchema,
};
