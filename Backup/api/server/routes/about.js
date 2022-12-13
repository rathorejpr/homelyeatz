const AboutController = require("../controllers/about");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");

router.post("/", AboutController.create);
router.get("/", AboutController.get);
router.put("/:id", IDParamsRequiredValidation, AboutController.update);
router.delete("/:id", IDParamsRequiredValidation, AboutController.delete);

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
