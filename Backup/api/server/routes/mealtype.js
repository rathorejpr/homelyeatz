const MealTypeController = require("../controllers/mealtype");
const router = require("express").Router();


router.get("/getAll", MealTypeController.get);

module.exports = router;
