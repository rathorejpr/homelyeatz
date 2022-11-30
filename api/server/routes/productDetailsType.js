const ProductDetailsTypeController = require("../controllers/productDetailsType");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");


router.get("/getAll", ProductDetailsTypeController.get);



module.exports = router;
