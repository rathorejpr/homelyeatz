const BusinessController = require("../controllers/business");
const router = require("express").Router();

router.post("/", BusinessController.create);
router.get("/", BusinessController.getByChefID);

module.exports = router;
