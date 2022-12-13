const FoodHandlingCertiController = require("../controllers/foodhandlingcert");
const router = require("express").Router();
const httpStatus = require("http-status");
const Joi = require("joi");
const APIResponse = require("../utils/APIResponse");
const multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });

router.post(
  "/createFood",
  singleFileUpload.single("FileName"),
  FoodHandlingCertiController.create
);
router.get("/getAllFood", FoodHandlingCertiController.get);
router.put(
  "/:id",
  singleFileUpload.single("FileName"),
  IDParamsRequiredValidation,
  FoodHandlingCertiController.update
);
router.delete(
  "/:id",
  IDParamsRequiredValidation,
  FoodHandlingCertiController.delete
);

const Validation = Joi.object()
  .keys({
    documentName: Joi.string()
      .required()
      .error(new Error("documentName is required!")),
  })
  .unknown();

function Validate(req, res, next) {
  const Data = req.body;
  Joi.validate(Data, Validation, (error, result) => {
    if (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
    } else {
      return next();
    }
  });
}

function IDParamsRequiredValidation(req, res, next) {
  if (req.params && req.params.hasOwnProperty("id")) {
    next();
  } else {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(
        new APIResponse(null, "id param not found", httpStatus.BAD_REQUEST)
      );
  }
}
module.exports = router;
