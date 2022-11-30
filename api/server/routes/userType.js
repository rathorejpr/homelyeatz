const UserTypeController = require("../controllers/userType");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");


router.get("/getAll", UserTypeController.get);



module.exports = router;
