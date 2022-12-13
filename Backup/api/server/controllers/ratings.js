const RatingService = require("../services/ratings");
const APIResponse = require("../utils/APIResponse");
const httpStatus = require("http-status");
const Sequelize = require("sequelize");
const moment = require("moment");

const Op = Sequelize.Op;

class RatingsController {
  async create(req, res, next) {
    try {
      let { UserID } = req.user;
      req.body.UserID = UserID;
      let body = {
        MealID: req.body.MealID,
        ChefID: req.body.ChefID,
        CustomerID: Number(UserID),
        Rating: req.body.Rating,
        UpdateOn: moment().format(),
      };
      if (req.body.ReviewComments) {
        body = {
          ...body,
          ReviewComments: req.body.ReviewComments,
        };
      }
      try {
        let response = await RatingService.add(body);
        response =
          response && response.recordset && response.recordset.length
            ? { ...response.recordset[0] }
            : {};
        if (response) {
          return res
            .status(httpStatus.OK)
            .json(
              new APIResponse(
                response,
                "Added Item for Ratings!",
                httpStatus.OK
              )
            );
        }
      } catch (error) {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json(
            new APIResponse(
              error,
              "Error Authenticating Data",
              httpStatus.INTERNAL_SERVER_ERROR,
              error
            )
          );
      }
    } catch (err) {
      console.log("err ", err);
    }
  }
}
var exports = (module.exports = new RatingsController());
