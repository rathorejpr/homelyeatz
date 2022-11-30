const BusinessService = require("../services/business");
const APIResponse = require("../utils/APIResponse");
const httpStatus = require("http-status");
const Sequelize = require("sequelize");
const moment = require("moment");

const Op = Sequelize.Op;

class BusinessController {

  async create(req, res, next) {
    try {
      if (req.user?.UserType && Number(req.user.UserType) !== 2) {
        return res.status(httpStatus.OK).json(new APIResponse(null, "You are not authorized to perform this action!", httpStatus.BAD_REQUEST));
      } else {
        let { UserID } = req.user;
        let checkExistingData = await BusinessService.get(UserID);
        console.log("checkExistingData", checkExistingData);
        checkExistingData =
          checkExistingData && checkExistingData.recordset && checkExistingData.recordset.length
            ? { ...checkExistingData.recordset[ 0 ] }
            : {};
        let body = {
          ModifiedOn: moment(new Date()).format(),
          BusinessName: req.body.BusinessName,
          ABN: req.body.ABN,
          RegStreetNo: req.body.RegStreetNo,
          RegStreetName: req.body.RegStreetName,
          RegSuburb: req.body.RegSuburb,
          RegState: req.body.RegState,
          RegPostCode: req.body.RegPostCode,
          ChefID: Number(UserID),
        }
        if (Object.keys(checkExistingData).length) {
          delete body.ChefID;
          let update = await BusinessService.update(req.body, Number(UserID));
          update = update && update.recordset && update.recordset.length
            ? { ...update.recordset[ 0 ] }
            : {};
          if (update) {
            return res.status(httpStatus.OK).json(new APIResponse(update, "Business updated successfully!", httpStatus.OK));
          } else {
            return res.status(httpStatus.OK).json(new APIResponse(null, "Business not updated!", httpStatus.OK));
          }
        } else {
          body.CreatedOn = moment(new Date()).format();
          let response = await BusinessService.add(body);
          response =
            response && response.recordset && response.recordset.length
              ? { ...response.recordset[ 0 ] }
              : {};
          if (response) {
            return res
              .status(httpStatus.OK)
              .json(
                new APIResponse(
                  response,
                  "Business Added!",
                  httpStatus.OK
                )
              );
          } else {
            return res
              .status(httpStatus.OK)
              .json(
                new APIResponse(
                  null,
                  "Business Not Added!",
                  httpStatus.BAD_REQUEST
                )
              );
          }
        }
      }
    } catch (err) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            err,
            "Error Authenticating Data",
            httpStatus.INTERNAL_SERVER_ERROR,
            err
          )
        );
    }
  }

  async getByChefID(req, res, next) {
    try {
      if (!req.user?.UserType && Number(req.user.UserType) !== 2) {
        return res.status(httpStatus.OK).json(new APIResponse(null, "You are not authorized to perform this action!", httpStatus.BAD_REQUEST));
      } else {
        let { UserID } = req.user;
        let response = await BusinessService.get(UserID);
        response =
          response && response.recordset && response.recordset.length
            ? { ...response.recordset[ 0 ] }
            : {};
        if (response) {
          return res
            .status(httpStatus.OK)
            .json(
              new APIResponse(
                response,
                "Business get Sucessfully!",
                httpStatus.OK
              )
            );
        } else {
          return res
            .status(httpStatus.OK)
            .json(
              new APIResponse(
                null,
                "Business Not Found!",
                httpStatus.BAD_REQUEST
              )
            );
        }
      }
    } catch (err) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            err,
            "Error Authenticating Data",
            httpStatus.INTERNAL_SERVER_ERROR,
            err
          )
        );
    }
  }

}
var exports = (module.exports = new BusinessController());
