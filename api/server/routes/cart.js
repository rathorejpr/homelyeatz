const CartController = require("../controllers/cart");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");

router.post("/createCart", CartController.create);
router.get("/getAllCartByUser", CartController.get);
router.put("/:id", IDParamsRequiredValidation, CartController.update);
router.get("/:id", IDParamsRequiredValidation, CartController.getById);

router.delete("/:id", IDParamsRequiredValidation, CartController.delete);

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
