const ProductController = require("../controllers/product");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");
const multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });

router.post(
  "/createrecipe",
  singleFileUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file" },
  ]),
  ProductController.create
);
router.get("/getAll", ProductController.get);
router.get("/getProduct", ProductController.getProductWithPagination);
router.get("/getAllProductByChefID", ProductController.getAllProductByChefID);
router.post("/searchProductByUser", ProductController.searchProductByUser);

router.put(
  "/:id",
  singleFileUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file" },
  ]),
  IDParamsRequiredValidation,
  ProductController.update
);
router.delete("/:id", IDParamsRequiredValidation, ProductController.delete);
router.post("/", ProductController.getById);

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
