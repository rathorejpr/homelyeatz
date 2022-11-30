const MealService = require("../services/meal");
const MealProductService = require("../services/mealProduct");
const MealImagesService = require("../services/mealImages");
const APIResponse = require("../utils/APIResponse");
const JWTHelper = require("../utils/jwt.helper");
const database = require("../models");
const httpStatus = require("http-status");
const Utils = require("../utils/util");
const Sequelize = require("sequelize");
const { response } = require("express");
const messages = require("../utils/constants");
const { sendPushNotification } = require("../utils/pushnotification");
const { uploadFileToBlob } = require("../utils/azureUpload");
const moment = require("moment");
const ProductService = require("../services/product");
const { date } = require("azure-storage");
const SqlQuery = require("../services/sqlqueries");
var sqlQ = new SqlQuery();

const Op = Sequelize.Op;

class MealController {
  async create(req, res, next) {
    let { UserID } = req.user;
    req.body.ChefID = UserID;
    let body = {
      CreatedOn: moment(new Date()).format(),
      ModifiedOn: moment(new Date()).format(),
      IsPublished: 0,
      IsDeleted: 0,
      MealName: req.body.MealName,
      CuisineTypeID: req.body.CuisineTypeID,
      MealTypeID: req.body.MealTypeID,
      DietaryTypeID: req.body.DietaryTypeID,
      TotalSum: req.body.TotalSum,
      TotalDiscocunt: req.body.TotalDiscocunt,
      TotalSumAfterDiscount: req.body.TotalSum - req.body.TotalDiscocunt,
      ChefID: req.body.ChefID,
      MealDesc: req.body.MealDesc,
    };
    try {
      let response = await MealService.add(body);
      response =
        response && response.recordset && response.recordset.length
          ? { ...response.recordset[ 0 ] }
          : {};
      if (response) {
        if (req.files.coverImage) {
          for (let i in req.files.coverImage) {
            let image = await uploadFileToBlob(
              req.files.coverImage[ i ],
              "products"
            );
            let body1 = {
              MealID: Number(response.MealID),
              MealImg: image.url,
              IsCover: 1,
            };
            let response1 = await MealImagesService.add(body1);
          }
        }
        if (req.files.file) {
          for (let i in req.files.file) {
            let image = await uploadFileToBlob(req.files.file[ i ], "products");
            let body1 = {
              MealID: Number(response.MealID),
              MealImg: image.url,
              IsCover: 0,
            };
            let response1 = await MealImagesService.add(body1);
          }
        }
        let product = JSON.parse(req.body.ProductID);
        for (let i in product) {
          let body1 = {
            MealID: Number(response.MealID),
            ProductID: Number(product[ i ].ProductID),
            OrgProductPrice: product[ i ].OrgProductPrice,
            NewProductPrice: product[ i ].NewProductPrice,
            CreatedOn: moment(new Date()).format(),
            ModifiedOn: moment(new Date()).format(),
          };
          let response1 = await MealProductService.add(body1);
        }
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response, "Meal Add Successfully", httpStatus.OK)
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
      let response = await MealService.get();
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response.recordset, "Meal Featch SuccessFully")
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
      let user = await JWTHelper.getAuthUser(req.headers.authorization);
      let { id } = req.body;
      let response = await MealService.findById(id, user && user.UserID);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Product Featch SuccessFully"));
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

  async getAllMealByChefID(req, res, next) {
    try {
      let response = await MealService.getAllMealByChefID(req.user.UserID, req.query);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response.recordset, "Product Featch SuccessFully")
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
      if (id) {
        let pendingOrder = await sqlQ.joinQuery(`select count(*) as count from tbl_Order O,tbl_Cart tc  where O.status = 'Accept' AND tc.CartID = O.CartID AND tc.MealID = '${id}'`);
        if (pendingOrder?.recordsets && pendingOrder?.recordsets?.length && pendingOrder?.recordsets[ pendingOrder?.recordsets?.length - 1 ][ 0 ].count > 0) {
          return res
            .status(httpStatus.OK)
            .json(
              new APIResponse({}, "You can not update meal as you have active order", httpStatus.BAD_REQUEST)
            );
        } else {
          let deleteImage;
          if (req.body.deleteImage) {
            deleteImage = JSON.parse(req.body.deleteImage);
          }
          delete req.body.deleteImage;
          if (req.body.LeadTime) {
            req.body.LeadTime = Number(req.body.LeadTime);
          }
          if (req.body.AvailableFrom) {
            req.body.AvailableFrom = moment(req.body.AvailableFrom).format();
          }
          if (req.body.AvailableTo) {
            req.body.AvailableTo = moment(req.body.AvailableTo).format();
          }
          if (req.body.DelTimeFrom) {
            req.body.DelTimeFrom = moment(req.body.DelTimeFrom).format();
          }
          if (req.body.DelTimeTo) {
            req.body.DelTimeTo = moment(req.body.DelTimeTo).format();
          }
          if (req.body.PublishedOn) {
            req.body.PublishedOn = moment(req.body.PublishedOn).format();
          }
          let ProductID;
          if (req.body.ProductID) {
            let response1 = await MealService.findById(
              id,
              req.user && req.user.UserID
            );
            ProductID = JSON.parse(req.body.ProductID);
            0;
            let RemoveProduct = [];
            response1.ProductData.map((e) =>
              RemoveProduct.push(Number(e.ProductID))
            );
            if (RemoveProduct.length) {
              let response = await MealProductService.deleteByProductIDAndMealID(
                RemoveProduct,
                id
              );
            }
            if (ProductID.length) {
              for (let i in ProductID) {
                let body1 = {
                  MealID: Number(id),
                  ProductID: Number(ProductID[ i ].ProductID),
                  OrgProductPrice: ProductID[ i ].OrgProductPrice,
                  NewProductPrice: ProductID[ i ].NewProductPrice,
                  CreatedOn: moment(new Date()).format(),
                  ModifiedOn: moment(new Date()).format(),
                };
                let response1 = await MealProductService.add(body1);
              }
            }
            delete req.body.ProductID;
          }
          if (req.files && req.files.coverImage && req.files.coverImage.length) {
            let responseImage = await MealImagesService.deleteByMealID(id, 1);
            for (let i in req.files.coverImage) {
              let image = await uploadFileToBlob(
                req.files.coverImage[ i ],
                "products"
              );
              let body1 = {
                MealID: Number(id),
                MealImg: image.url,
                IsCover: 1,
              };
              let response1 = await MealImagesService.add(body1);
            }
          }
          if (deleteImage && deleteImage.length) {
            let responseImage = await MealImagesService.deleteByMealImg(
              deleteImage
            );
          }

          if (req.files && req.files.file && req.files.file.length) {
            for (let i in req.files.file) {
              let image = await uploadFileToBlob(req.files.file[ i ], "products");
              let body1 = {
                MealID: Number(id),
                MealImg: image.url,
                IsCover: 0,
              };
              let response1 = await MealImagesService.add(body1);
            }
          }

          req.body = req.body ? req.body : {};
          let body = {
            ...req.body,
            ModifiedOn: moment(new Date()).format(),
          };
          const response = await MealService.update(body, id);
          if (response) {
            return res
              .status(httpStatus.OK)
              .json(new APIResponse(response, "Meal Update SuccessFully"));
          }
        }
      } else {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse({}, "Id is required", httpStatus.BAD_REQUEST)
          );
      }
    } catch (error) {
      console.log("error", error);
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
      const response = await MealService.delete(id);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Meal Delete SuccessFully"));
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

  async searchMealByUser(req, res, next) {
    try {
      let user = await JWTHelper.getAuthUser(req.headers.authorization);
      const response = await MealService.searchMealByUser(
        req.body,
        req.query,
        user && Number(user.UserID)
      );
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response.recordset, "Meal fetch SuccessFully"));
      }
    } catch (error) {
      console.log(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Error fetch Meal Data",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }

  async getMinAndMaxKM(req, res, next) {
    try {
      const response = await MealService.getMinAndMaxKM();
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Min and Max Km fetch SuccessFully"));
      }
    } catch (error) {
      console.log(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Error fetch Min and Max Km Meal Data",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }

  async whishlistMealByUser(req, res, next) {
    try {
      const response = await MealService.whishlistMealByUser(
        req.query,
        req.user.UserID
      );
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response.recordset, "Meal fetch SuccessFully"));
      }
    } catch (error) {
      console.log(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Error fetch Meal Data",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }
}
var exports = (module.exports = new MealController());
