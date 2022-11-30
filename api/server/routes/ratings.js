const RatingController = require("../controllers/ratings");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");

router.post("/", RatingController.create);

module.exports = router;
