const FoodHandlingService = require("../services/foodhandlingcert");
const APIResponse = require("../utils/APIResponse");
const JWTHelper = require("../utils/jwt.helper");
const database = require("../models");
const httpStatus = require("http-status");
const Utils = require("../utils/util");
const Sequelize = require("sequelize");
const { response } = require("express");
const UserService = require("../services/user");
const Op = Sequelize.Op;
const { uploadFileToBlob } = require("../utils/azureUpload");
const moment = require("moment");

class FoodCertificationController {
  async create(req, res, next) {
    try {
      let body = {
        ProviderName: req.body.ProviderName,
        DocumentName: req.body.DocumentName,
        CertificationTitle: req.body.CertificationTitle,
        CertificateNumber: req.body.CertificateNumber,
        CertificateExpiryDate: req.body.CertificateExpiryDate,
        Status: req.body.Status,
        StateofIssue: req.body.StateofIssue,
        ApprovedBy: req.body.ApprovedBy,
        UploadedBy: req.user.UserID,
        UploadedOn: moment(new Date()).format(),
        CertificateIssuedOn: moment(
          new Date(req.body.CertificateIssuedOn)
        ).format(),
      };
      if (req.file) {
        const image = await uploadFileToBlob(
          req.file,
          "certificates",
          req.user.UserID
        );
        body = {
          ...body,
          FileName: image.url,
        };
      }
      let response = await FoodHandlingService.add(body);
      if (response) {
        // let data = {
        //   IsFoodHandlingVerified: 1,
        // };

        // await UserService.updateData(data, req.user.UserID);
        let responseUser = await UserService.findById(req.user.UserID);
        return res.status(httpStatus.OK).json(
          new APIResponse(
            {
              FoodCertificateData: response,
              UserData: responseUser && responseUser.recordset[0],
            },
            "Food Certificate Add Successfully",
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
      let response = await FoodHandlingService.get(req.user.UserID);
      response = response && response.recordset ? response.recordset : {};

      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response, "Food Certificate Featch SuccessFully")
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

  async update(req, res, next) {
    try {
      let { id } = req.params;
      let body = {
        ...req.body,
        UploadedBy: req.user.UserID,
        UploadedOn: moment(new Date()).format(),
      };
      console.log(req.body);
      if (req.body.CertificateExpiryDate) {
        body.CertificateExpiryDate = req.body.CertificateExpiryDate;
      }
      if (req.body.CertificateIssuedOn) {
        body.CertificateIssuedOn = moment(
          new Date(req.body.CertificateIssuedOn)
        ).format();
      }
      if (req.file) {
        const image = await uploadFileToBlob(
          req.file,
          "certificates",
          req.user.UserID
        );
        body = {
          ...body,
          FileName: image.url,
        };
      }

      const response = await FoodHandlingService.update(body, id);
      console.log("response.recordset", response);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response, "Food Certificate Update SuccessFully")
          );
      }
    } catch (error) {
      console.log(error);
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
      const response = await FoodHandlingService.delete(id);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response, "Food Certificate Delete SuccessFully")
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
var exports = (module.exports = new FoodCertificationController());
