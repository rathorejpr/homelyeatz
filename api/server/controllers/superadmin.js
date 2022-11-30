const SuperAdminService = require("../services/superadmin");
const APIResponse = require("../utils/APIResponse");
const JWTHelper = require("../utils/jwt.helper");
const database = require("../models");
const httpStatus = require("http-status");
const Utils = require("../utils/util");
const Sequelize = require("sequelize");
const { response } = require("express");
const emailHelper = require("../utils/email-helper");
const messages = require("../utils/constants");
const { sendPushNotification } = require("../utils/pushnotification");
const LocationService = require("../services/location");

const Op = Sequelize.Op;

class SuperAdminController {
  async roleAdd(req, res, next) {
    let body = req.body;
    try {
      // if (!req.user.id) {
      //   // return res
      //   //   .status(httpStatus.UNAUTHORIZED)
      //   //   .json(
      //   //     new APIResponse(
      //   //       {},
      //   //       "Error authenticating user",
      //   //       httpStatus.UNAUTHORIZED
      //   //     )
      //   //   );
      // } else {
      let response = await SuperAdminService.addRole(body);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response, "Role add successfully", httpStatus.OK)
          );
      }
      // }
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Error authenticating user",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }
}
var exports = (module.exports = new SuperAdminController());
