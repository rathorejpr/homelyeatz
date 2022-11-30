const MealTypeService = require("../services/mealtype");
const APIResponse = require("../utils/APIResponse");
const JWTHelper = require("../utils/jwt.helper");
const database = require("../models");
const httpStatus = require("http-status");
const Utils = require("../utils/util");
const Sequelize = require("sequelize");
const { response } = require("express");
const messages = require("../utils/constants");

const Op = Sequelize.Op;

class DietaryController {
  async get(req, res, next) {
    try {
      let response = await MealTypeService.getAll();
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Meal type Featch SuccessFully"));
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
var exports = (module.exports = new DietaryController());
