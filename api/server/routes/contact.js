const ContactController = require("../controllers/contact");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");

router.post("/dropMail", ContactController.create);
router.get("/", ContactController.get);
router.put("/:id", IDParamsRequiredValidation, ContactController.update);
router.delete("/:id", IDParamsRequiredValidation, ContactController.delete);

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
