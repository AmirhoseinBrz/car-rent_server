const Controller = require("../controller");
const { UserModel } = require("../../models/user");
const {
  createUserSchema,
  LoginUserSchema,
} = require("../../validators/user.shcema");
const {
  setAccessToken,
  setRefreshToken,
  verifyRefreshToken,
  deleteCookie,
} = require("../../../../utils/function");
const bcrypt = require("bcrypt");
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const fs = require("fs");

class userController extends Controller {
  constructor() {
    super();
  }

  async Register(req, res) {
    await createUserSchema.validateAsync(req.body);
    const { email } = req.body;

    const userCheck = await UserModel.findOne({ email });

    if (userCheck) {
      throw createHttpError.Unauthorized("این نام قبلا ثبت شده است");
    }

    const user = await this.SaveUser(req.body);
    if (!user) {
      throw createHttpError.BadRequest("در هنگام ثبت اطلاعات خطایی رخ داد!");
    }

    await setAccessToken(res, req.body);
    await setRefreshToken(res, req.body);
    return res.status(HttpStatus.OK).json({
      message: `wellcome deare ${user.fullName}`,
    });
  }

  async Login(req, res) {
    await LoginUserSchema.validateAsync(req.body);
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw createHttpError.Unauthorized("کاربری با ایمیل وارد شده پیدا نشد");
    }

    const passwordCheck = await this.compareHashPassword(
      password,
      user.password
    );

    if (!passwordCheck) {
      throw createHttpError.Unauthorized("رمز وارد شده صحیح نمی باشد");
    }

    await setAccessToken(res, req.body);
    await setRefreshToken(res, req.body);

    return res
      .status(HttpStatus.OK)
      .json({ message: `Wellcome back ${user.fullName}` });
  }

  async refreshToken(req, res) {
    const userEmail = await verifyRefreshToken(req);
    const user = await UserModel.findOne({ email: userEmail }, { password: 0 });
    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    return res.status(200).json({
      data: user,
      message: "refreshToken reloaded",
    });
  }

  oploadAvatar(req, res) {
    const { avatar } = req.body;

    if (!avatar) {
      throw createHttpError.BadRequest("لطفا آواتار را ارسال کنید");
    }

    if (!/^image/.test(image.mimetype)) {
      throw createHttpError.BadRequest("فرمت فایل ارسالی باید تصویر باشد");
    }

    const currentWorkingDirectory = process.cwd();

    const uploadDir = `${currentWorkingDirectory}/uploads/avatar/${avatar.name}`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const filePath = path.join(uploadDir, image.name);

    image.mv(filePath, (err) => {
      if (err) {
        console.error("خطا در آپلود فایل:", err);
        return res.sendStatus(500);
      }

      // All good
      res.status(200);
    });
  }

  async getProfile(req, res) {
    const user = req.user;
    return res.status(200).json({
      user,
    });
  }

  async SaveUser({ fullName, email, password }) {
    const hashPassword = await this.hashPassword(password);

    return await UserModel.create({
      fullName,
      email,
      password: hashPassword,
    });
  }

  async DeleteUser(req, res) {
    await deleteCookie(res, req);

    res.status(200).json({
      message: "user logout is successfull !",
    });
  }

  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async compareHashPassword(password, hashPassword) {
    return bcrypt
      .compare(password, hashPassword)
      .then((res) => res)
      .catch((error) => {
        throw createHttpError.BadRequest(
          "خطا در هنگام بررسی کلمه عبور " + error
        );
      });
  }
}

module.exports = { UserController: new userController() };
