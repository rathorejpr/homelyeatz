const FavouriteController = require("../controllers/favourite");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");

router.post("/", FavouriteController.create);

module.exports = router;
