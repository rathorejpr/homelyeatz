const UserController = require("../controllers/user");
const router = require("express").Router();
const httpStatus = require("http-status");
const Joi = require("joi");
const APIResponse = require("../utils/APIResponse");
const multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });

router.get("/getAllUsers", UserController.getAllUsers);
router.post("/addAbout", UserController.AddAbout);
router.post("/signup", signupValidate, UserController.create);

router.post("/login", loginValidate, UserController.login);
router.get("/getTermsAndConditions", UserController.getTermsAndConditions);

router.put("/:id", UserController.update);

router.put("/V2/:id",
  singleFileUpload.single("ImgProfile"),
  UserController.updateV2);

router.get("/:id", UserController.getByID);

router.post(
  "/ChangePassword",
  changePasswordValidationValidate,
  UserController.changePassword
);

router.post("/verify", UserController.verify);

router.post("/verifyByPhone", UserController.verifyByPhone);

router.post(
  "/forgatePassword",
  forgatePasswordValidationValidate,
  UserController.forgatePassword
);

router.post("/resetpassword", UserController.resetPassword);

router.get("/getAllLocation", UserController.get);

function signupValidate(req, res, next) {
  const Data = req.body;
  Joi.validate(Data, signupValidation, (error, result) => {
    if (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
    } else {
      return next();
    }
  });
}

const loginValidation = Joi.object()
  .keys({
    Email: Joi.string().required().error(new Error("Email is required!")),
    Password: Joi.string().required().error(new Error("Password is required!")),
    UserType: Joi.number().required().error(new Error("Role is required!")),
  })
  .unknown();

function loginValidate(req, res, next) {
  const Data = req.body;
  Joi.validate(Data, loginValidation, (error, result) => {
    if (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
    } else {
      return next();
    }
  });
}

const forgatePasswordValidation = Joi.object()
  .keys({
    Email: Joi.string().required().error(new Error("Email is required!")),
  })
  .unknown();

function forgatePasswordValidationValidate(req, res, next) {
  const Data = req.body;
  Joi.validate(Data, forgatePasswordValidation, (error, result) => {
    if (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
    } else {
      return next();
    }
  });
}

function changePasswordValidationValidate(req, res, next) {
  const Data = req.body;
  Joi.validate(Data, changePasswordValidation, (error, result) => {
    if (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
    } else {
      return next();
    }
  });
}

const changePasswordValidation = Joi.object()
  .keys({
    Email: Joi.string().required().error(new Error("Email is required!")),
    oldPassword: Joi.string()
      .required()
      .error(new Error("Old Password is required!")),
    newPassword: Joi.string()
      .required()
      .error(new Error("New Password is required!")),
    UserType: Joi.number().required().error(new Error("role is required!")),
  })
  .unknown();

const signupValidation = Joi.object()
  .keys({
    // UserName: Joi.string()
    //   .required()
    //   .error(new Error("User Name is Required!")),
    // Email: Joi.string().required().error(new Error("Email is Required!")),
    Password: Joi.string().required().error(new Error("Password is Required")),
    // mobile: Joi.string().required().error(new Error('Mobile Number is Required')),
    // role: Joi.string().required().error(new Error("Role  is Required")),
  })
  .unknown();

module.exports = router;
