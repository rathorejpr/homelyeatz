const FooterService = require("../services/footer");
const APIResponse = require("../utils/APIResponse");
const JWTHelper = require("../utils/jwt.helper");
const database = require("../models");
const httpStatus = require("http-status");
const Utils = require("../utils/util");
const { uploadFileToBlob } = require("../utils/azureUpload");
const Sequelize = require("sequelize");
const { response } = require("express");
const messages = require("../utils/constants");

const Op = Sequelize.Op;

class FooterController {
  async create(req, res, next) {
    let body = {
      ...req.body,
    };
    if (req.file) {
      const image = await uploadFileToBlob(req.file, "products");
      console.log("image.url", image.url);
      body = {
        ...req.body,
        Image: image.url,
      };
    }
    try {
      // let response = await FooterService.add(body);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response, "Footer Add SucessFully", httpStatus.OK)
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
      let response = await FooterService.get();
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Footer Featch SuccessFully"));
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
      if (req.file) {
        const image = await uploadFileToBlob(req.file, "products");
        body = {
          ...req.body,
          Image: image.url,
        };
      }
      const response = await FooterService.update(body, id);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Footer Update SuccessFully"));
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
      const response = await FooterService.delete(id);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Footer Delete SuccessFully"));
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

var exports = (module.exports = new FooterController());
