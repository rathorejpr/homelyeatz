const GeoLocController = require("../controllers/geoLoc");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");


router.get("/getAll", GeoLocController.get);

router.get("/searchGeoLoc", GeoLocController.searchGeoLoc);

router.get("/getChefDeliveryArea", GeoLocController.getChefDeliveryArea);

router.post("/addChefDeliveryArea", GeoLocController.addChefDeliveryArea);

router.get("/getById/:id", GeoLocController.getById);

router.delete("/:id", GeoLocController.delete);



module.exports = router;
