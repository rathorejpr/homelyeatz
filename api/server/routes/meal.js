const MealController = require("../controllers/meal");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");
const multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });

router.post(
  "/createMeal",
  singleFileUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file" },
  ]),
  MealController.create
);
router.get("/getAll", MealController.get);
router.get("/getminandmaxkm", MealController.getMinAndMaxKM);
router.get("/getAllMealByChefID", MealController.getAllMealByChefID);
router.post("/searchMealByUser", MealController.searchMealByUser);
router.post("/whishlistMealByUser", MealController.whishlistMealByUser);
router.put(
  "/:id",
  singleFileUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file" },
  ]),
  IDParamsRequiredValidation,
  MealController.update
);
router.delete("/:id", IDParamsRequiredValidation, MealController.delete);
router.post("/", MealController.getById);
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
