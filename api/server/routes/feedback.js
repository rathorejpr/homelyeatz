const FeedbackController = require("../controllers/feedback");
const router = require("express").Router();
const httpStatus = require("http-status");
const Joi = require("joi");
const APIResponse = require("../utils/APIResponse");

router.post("/create", Validate, FeedbackController.create);

router.get("/getAllFeedbackFeeling", FeedbackController.getAllFeedbackFeeling);

router.get("/getAllFeedbackQuality", FeedbackController.getAllFeedbackQuality);


function Validate(req, res, next) {
    const Data = req.body;
    Joi.validate(Data, Validation, (error, result) => {
        if (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
        } else {
            return next();
        }
    });
}

const Validation = Joi.object()
    .keys({
        ChefFeedback: Joi.string().required().error(new Error("ChefFeedback is required!")),
        MissingMenu: Joi.string().required().error(new Error("MissingMenu is required!")),
        ChefID: Joi.number().required().error(new Error("ChefID is required and must be number!")),
        OrderID: Joi.number().required().error(new Error("OrderID is required and must be number!")),
        DinerID: Joi.number().required().error(new Error("DinerID is required and must be number!")),
        ProductID: Joi.number().required().error(new Error("ProductID is required and must be number!")),
        QualityID: Joi.number().required().error(new Error("QualityID is required and must be number!")),
        FeelingID: Joi.number().required().error(new Error("FeelingID is required and must be number!")),
        RecommendChef: Joi.number().required().error(new Error("RecommendChef is required and must be number!")),
        RecommendHomelyEatz: Joi.number().required().error(new Error("RecommendHomelyEatz is required and must be number!")),
    })
    .unknown();

module.exports = router;
