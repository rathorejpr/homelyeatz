const ProductService = require("../services/product");
const ProductsIngredientsService = require("../services/ProductsIngredients");
const ProductDetailsService = require("../services/ProductDetails");
const APIResponse = require("../utils/APIResponse");
const JWTHelper = require("../utils/jwt.helper");
const database = require("../models");
const httpStatus = require("http-status");
const Utils = require("../utils/util");
const Sequelize = require("sequelize");
const { response } = require("express");
const messages = require("../utils/constants");
const moment = require("moment");
const { sendPushNotification } = require("../utils/pushnotification");
const { uploadFileToBlob } = require("../utils/azureUpload");
const ProductImagesService = require("../services/productImages");

const Op = Sequelize.Op;

class ProductController {
  async create(req, res, next) {
    let body = {
      ChefID: req.user.UserID,
      ProductName: req.body.ProductName,
      ServeSizeID: req.body.ServeSizeID,
      QuantityML: req.body.QuantityML,
      SpiceLvl: req.body.SpiceLvl,
      Pieces: req.body.Pieces,
      Price: req.body.Price,
      CreatedOn: moment(new Date()).format(),
      ModifiedOn: moment(new Date()).format(),
    };
    if (req.body.ProfileName) {
      body = {
        ...body,
        ProfileName: req.body.ProfileName
      }
    }
    try {
      let response = await ProductService.add(body);
      response =
        response && response.recordset && response.recordset.length
          ? { ...response.recordset[ 0 ] }
          : {};
      if (response) {
        let Ingredient = req.body.IngredientID.split(",");
        for (let i in Ingredient) {
          let body1 = {
            ProductID: Number(response.ProductID),
            IngredientID: Number(Ingredient[ i ]),
            CreatedBy: Number(req.user.UserID),
            ModifiedBy: Number(req.user.UserID),
            ModifiedOn: moment(new Date()).format(),
            CreatedOn: moment(new Date()).format(),
          };
          let response1 = await ProductsIngredientsService.add(body1);
        }
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response, "Product Add Successfully", httpStatus.OK)
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
      let response = await ProductService.get(req.query);
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

  async getProductWithPagination(req, res, next) {
    try {
      let response = await ProductService.getProductWithPagination(req.query);
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

  async getAllProductByChefID(req, res, next) {
    try {
      let response = await ProductService.getAllProductByChefID(
        req.user.UserID,
        req.query
      );
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

  async getById(req, res, next) {
    try {
      let { id } = req.body;
      let response = await ProductService.findById(id);
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

  async update(req, res, next) {
    try {
      let { id } = req.params;
      let response1 = await ProductService.findById(id);

      let IngredientID = [];
      if (req.body && req.body.IngredientID) {
        IngredientID = req.body.IngredientID.split(",");
        let IngredientAdd = [];
        let IngredientID2 = [];
        response1.IngredientData.map((e) => IngredientID2.push(e.IngredientID));
        let RemoveIngredient = [];
        IngredientID2.some((item) => {
          if (!IngredientID.includes(item)) {
            RemoveIngredient.push(Number(item));
          }
        });
        IngredientID.some((item) => {
          if (!IngredientID2.includes(item)) {
            IngredientAdd.push(Number(item));
          }
        });
        if (RemoveIngredient.length) {
          let response23 =
            await ProductsIngredientsService.deleteByIngredientIDAndProductID(
              RemoveIngredient,
              id
            );
        }
        if (IngredientAdd.length) {
          for (let i in IngredientAdd) {
            let body1 = {
              ProductID: Number(id),
              IngredientID: Number(IngredientAdd[ i ]),
              CreatedBy: Number(req.user.UserID),
              ModifiedBy: Number(req.user.UserID),
              ModifiedOn: moment(new Date()).format(),
              CreatedOn: moment(new Date()).format(),
            };
            let response1 = await ProductsIngredientsService.add(body1);
          }
        }
        delete req.body.IngredientID;
      }

      let body = {
        ChefID: req.user.UserID,
        SpiceLvl:
          req.body && req.body.SpiceLvl
            ? req.body.SpiceLvl
            : response1.SpiceLvl,
        ProductName:
          req.body && req.body.ProductName
            ? req.body.ProductName
            : response1.ProductName,
        ServeSizeID:
          req.body && req.body.ServeSizeID
            ? req.body.ServeSizeID
            : response1.ServeSizeID,
        QuantityML:
          req.body && req.body.QuantityML
            ? req.body.QuantityML
            : response1.QuantityML,
        Pieces:
          req.body && req.body.Pieces ? req.body.Pieces : response1.Pieces,
        Price: req.body && req.body.Price ? req.body.Price : response1.Price,
        ModifiedOn: moment(new Date()).format(),
      };

      const response = await ProductService.update(body, Number(id));

      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Product Update SuccessFully"));
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

  async searchProductByUser(req, res, next) {
    try {
      const response = await ProductService.searchProductByUser(
        req.body,
        req.query
      );
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response.recordset, "Product fetch SuccessFully")
          );
      }
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Error fetch Product Data",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }

  async delete(req, res, next) {
    try {
      let { id } = req.params;
      const response = await ProductService.delete(id);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Product Delete SuccessFully"));
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
var exports = (module.exports = new ProductController());
