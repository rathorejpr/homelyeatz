const OrderController = require("../controllers/order");
const router = require("express").Router();
const httpStatus = require("http-status");
const APIResponse = require("../utils/APIResponse");

router.post("/createOrder", OrderController.create);
router.post("/OTPGenerate", OrderController.OTPGenerate);
router.get("/getAllOrderByUser", OrderController.get);
router.get("/getAllOrderByChef", OrderController.getByChefID);
router.get(
  "/getByChefIDWithPendingStatus",
  OrderController.getByChefIDWithPendingStatus
);
router.get(
  "/getLatestOrderFeedbackPending",
  OrderController.getLatestOrderFeedbackPending
);
router.get(
  "/getProductByMealID/:id/:orderID",
  OrderController.getProductByMealID
);
module.exports = router;
