const AboutService = require("../services/about");
const APIResponse = require("../utils/APIResponse");
const JWTHelper = require("../utils/jwt.helper");
const database = require("../models");
const httpStatus = require("http-status");
const Utils = require("../utils/util");
const Sequelize = require("sequelize");
const { response } = require("express");
const messages = require("../utils/constants");
const { sendPushNotification } = require("../utils/pushnotification");

const Op = Sequelize.Op;

class AboutController {
  async create(req, res, next) {
    let body = {
      ...req.body,
      Image: req.file.location,
    };
    console.log(body);
    try {
      let response = await AboutService.add(body);
      console.log("response", response);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response, "About Add Successfully", httpStatus.OK)
          );
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

  async get(req, res, next) {
    try {
      let response = await AboutService.get();
      console.log("response", response);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "About Featch SuccessFully"));
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

  async update(req, res, next) {
    try {
      let { id } = req.params;
      let body = {
        ...req.body,
      };
      const response = await AboutService.update(body, id);
      console.log("response", response);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "About Update SuccessFully"));
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

  async delete(req, res, next) {
    try {
      let { id } = req.params;
      const response = await AboutService.delete(id);
      console.log("response", response);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "About Delete SuccessFully"));
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
var exports = (module.exports = new AboutController());
