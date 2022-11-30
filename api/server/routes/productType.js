const ProductTypeController = require("../controllers/productType");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");


router.get("/getAll", ProductTypeController.get);



module.exports = router;
