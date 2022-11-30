const FeeTypeController = require("../controllers/feeType");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");


router.get("/getAll", FeeTypeController.get);



module.exports = router;
