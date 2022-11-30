const WallpaperController = require("../controllers/wallpaper");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");

router.post("/", WallpaperController.create);
router.get("/getAll", WallpaperController.get);
router.put("/:id", IDParamsRequiredValidation, WallpaperController.update);
router.delete("/:id", IDParamsRequiredValidation, WallpaperController.delete);

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
