const WallpaperService = require("../services/wallpaper");
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

class WallpaperController {
  async create(req, res, next) {
    let body = {
      ...req.body,
      // Image: req.file.location,
    };
    try {
      let response = await WallpaperService.add(body);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(
              response,
              "Wallpaper Add Successfully",
              httpStatus.OK
            )
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
      let response = await WallpaperService.get();
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Wallpaper Featch SuccessFully"));
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
        // Image: req.file.location,
      };
      const response = await WallpaperService.update(body, id);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Wallpaper Update SuccessFully"));
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
      const response = await WallpaperService.delete(id);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Wallpaper Delete SuccessFully"));
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
var exports = (module.exports = new WallpaperController());
