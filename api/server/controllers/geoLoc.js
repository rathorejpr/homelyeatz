const GeoLocService = require("../services/geoLoc");
const APIResponse = require("../utils/APIResponse");
const JWTHelper = require("../utils/jwt.helper");
const database = require("../models");
const httpStatus = require("http-status");
const Utils = require("../utils/util");
const Sequelize = require("sequelize");
const { response } = require("express");
const messages = require("../utils/constants");
const moment = require("moment");

const Op = Sequelize.Op;

class GeoLocController {
  async get(req, res, next) {
    try {
      let response = await GeoLocService.getAll();
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response.recordset, "GeoLoc Featch SuccessFully")
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

  async addChefDeliveryArea(req, res, next) {
    try {
      if (req.body.LocalityID) {
        let data = req.body;
        data.ChefID = req.user.UserID;
        let checkData = await GeoLocService.getChefDeliveryArea(data.ChefID);
        if (checkData.length >= 20) {
          return res
            .status(httpStatus.OK)
            .json(
              new APIResponse(
                {},
                "You can add only 20 Delivery Area",
                httpStatus.BAD_REQUEST
              )
            );
        } else {
          let checkChefDeliveryAreaExist = await GeoLocService.checkChefDeliveryAreaExist(data.ChefID, data.LocalityID);
          if (checkChefDeliveryAreaExist.length > 0) {
            return res
              .status(httpStatus.OK)
              .json(
                new APIResponse(
                  {},
                  "You have already added this Delivery Area",
                  httpStatus.BAD_REQUEST
                )
              );
          } else {
            data.createdOn = moment(new Date()).format();
            data.modifiedOn = moment(new Date()).format();
            let response = await GeoLocService.addChefDeliveryArea(data);
            if (response) {
              return res
                .status(httpStatus.OK)
                .json(
                  new APIResponse(response, "Add Chef Delivery Area SuccessFully !")
                );
            }
          }
        }
      } else {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response, "LocalityID is required !", httpStatus.BAD_REQUEST)
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

  async getChefDeliveryArea(req, res, next) {
    try {
      let response = await GeoLocService.getChefDeliveryArea(req.user.UserID);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response, "Get Chef Delivery Area SuccessFully !")
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

  async getById(req, res, next) {
    try {
      let response = await GeoLocService.getById(req.params.id);
      if (response) {
        response = response.recordset && response.recordset?.length ? response.recordset[ response.recordset?.length - 1 ] : {};
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response, "Get GeoLoc SuccessFully !")
          );
      } else {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(null, "No GeoLoc Found !")
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

  async searchGeoLoc(req, res, next) {
    try {
      let response = await GeoLocService.searchGeoLoc(req.query);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response.recordset, "GeoLoc Featch SuccessFully")
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

  async delete(req, res, next) {
    try {
      console.log(req.user)
      let response = await GeoLocService.delete(req.params.id, req.user.UserID);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response, "GeoLoc Delete SuccessFully")
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
}
var exports = (module.exports = new GeoLocController());
