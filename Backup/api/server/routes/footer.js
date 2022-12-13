const FooterController = require("../controllers/footer");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIRESPONSE = require("../utils/APIResponse");
const multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });
router.post("/", singleFileUpload.single("Image"), FooterController.create);
router.get("/", FooterController.get);
router.put(
  "/:id",
  singleFileUpload.single("Image"),
  IDParamsRequiredValidation,
  FooterController.update
);
router.delete("/:id", IDParamsRequiredValidation, FooterController.delete);

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
