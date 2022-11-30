const CusineController = require("../controllers/cusine");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");


router.get("/getAll", CusineController.get);



module.exports = router;
