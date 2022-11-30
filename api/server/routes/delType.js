const DelTypeController = require("../controllers/delType");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");

router.get("/getAll", DelTypeController.get);

module.exports = router;
