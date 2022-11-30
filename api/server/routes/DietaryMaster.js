const DietaryController = require("../controllers/DietaryMaster");
const router = require("express").Router();

router.get("/getAll", DietaryController.get);

module.exports = router;
