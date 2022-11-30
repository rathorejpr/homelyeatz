const FeesController = require("../controllers/fees");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");


router.get("/getAll", FeesController.get);



module.exports = router;
