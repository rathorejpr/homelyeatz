const FeedbackServices = require("../services/feedback");
const APIResponse = require("../utils/APIResponse");
const httpStatus = require("http-status");
const moment = require("moment");

class FeedbackController {
  async getAllFeedbackQuality(req, res, next) {
    try {
      let response = await FeedbackServices.getAllFeedbackQuality();
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(
              response?.recordset,
              "FeedbackQuality Featch SuccessFully"
            )
          );
      }
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Getting Error For Get Feedback Qulity Data",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }

  async getAllFeedbackFeeling(req, res, next) {
    try {
      let response = await FeedbackServices.getAllFeedbackFeeling();
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(
              response?.recordset,
              "FeedbackFeeling Featch SuccessFully"
            )
          );
      }
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Getting Error For Get Feeling Qulity Data",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }

  async create(req, res, next) {
    try {
      let body = {
        ChefID: Number(req.body.ChefID),
        OrderID: Number(req.body.OrderID),
        DinerID: Number(req.body.DinerID),
        ProductID: Number(req.body.ProductID),
        QualityID: Number(req.body.QualityID),
        FeelingID: Number(req.body.FeelingID),
        RecommendChef: Number(req.body.RecommendChef),
        RecommendHomelyEatz: Number(req.body.RecommendHomelyEatz),
        MissingMenu: req.body.MissingMenu,
        ChefFeedback: req.body.ChefFeedback,
        CreatedOn: moment(new Date()).format(),
        Dispute: 0,
      };
      let feedbackAlredyExist = await FeedbackServices.getAlreadyExistFeedback(
        body
      );
      if (feedbackAlredyExist?.length) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Feedback already submitted",
              httpStatus.BAD_REQUEST
            )
          );
      } else {
        let response = await FeedbackServices.add(body);
        if (response) {
          await FeedbackServices.updateProductRating(Number(body.ProductID));
          await FeedbackServices.addProductRating({
            ProductID: body.ProductID,
            ChefID: body.ChefID,
            ProductRating: (body.QualityID + body.FeelingID) / 2,
            UpdatedOn: moment(new Date()).format(),
            IsCurrent: 1,
          });
          let chefCountForFeedback =
            await FeedbackServices.getChefCountForFeedback(body.ChefID);
          let qualityIDSum = await FeedbackServices.getQualityIDSum(
            body.ChefID
          );
          let feelingIDSum = await FeedbackServices.getFeelingIDSum(
            body.ChefID
          );
          let QualityMeanScore = qualityIDSum / chefCountForFeedback;
          let HomelyMeanScore = feelingIDSum / chefCountForFeedback;
          let ChefRating = (QualityMeanScore + HomelyMeanScore) / 2;
          await FeedbackServices.updateChefRating(Number(body.ChefID));
          await FeedbackServices.addChefRating({
            ChefID: body.ChefID,
            QualityMeanScore: Math.round(QualityMeanScore),
            HomelyMeanScore: Math.round(HomelyMeanScore),
            ChefRating: Math.round(ChefRating),
            UpdatedOn: moment(new Date()).format(),
            IsCurrent: 1,
          });
          return res
            .status(httpStatus.OK)
            .json(
              new APIResponse(
                response,
                "Feedback Add Successfully",
                httpStatus.OK
              )
            );
        }
      }
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Error Authenticating Data",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }
}
var exports = (module.exports = new FeedbackController());
