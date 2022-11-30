const CartService = require("../services/cart");
const APIResponse = require("../utils/APIResponse");
const httpStatus = require("http-status");
const Sequelize = require("sequelize");
const moment = require("moment");

const Op = Sequelize.Op;

class CartController {
  // constructor() {
  //   this.update = this.update.bind(this);
  // }

  async create(req, res, next) {
    try {
      let { UserID } = req.user;
      req.body.UserID = UserID;
      let body = {
        CreatedOn: moment(new Date()).format(),
        ModifiedOn: moment(new Date()).format(),
        MealID: req.body.MealID,
        // MealType: req.body.MealType,
        // ProductType: req.body.ProductType,
        Quantity: req.body.Quantity,
        //   Price: req.body.Price,
        IsActive: 1,
        IsDeleted: 0,
        UserID: UserID,
      };
      let CartExist = await CartService.find(body);
      if (CartExist.length) {
        const response1 = await CartController.cartUpdate(
          { id: CartExist[CartExist.length - 1].CartID },
          req.body,
          req
        );
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response1, "Cart Already Exits!", httpStatus.OK)
          );
      } else {
        // let IngredientsID = [];
        // if (req.body.IngredientsID) {
        //   IngredientsID = req.body.IngredientsID.split(",");
        // }
        try {
          let response = await CartService.add(body);
          response =
            response && response.recordset && response.recordset.length
              ? { ...response.recordset[0] }
              : {};
          if (response) {
            // for (let i in IngredientsID) {
            //   let body1 = {
            //     ProductID: Number(req.body.ProductID),
            //     IngredientsID: Number(IngredientsID[i]),
            //     CartID: Number(response.CartID),
            //     CreatedOn: moment(new Date()).format(),
            //     ModifiedOn: moment(new Date()).format(),
            //   };
            //   let response1 = await CartService.addCartIngredient(body1);
            // }
            return res
              .status(httpStatus.OK)
              .json(
                new APIResponse(
                  response,
                  "Cart Add Successfully",
                  httpStatus.OK
                )
              );
          }
        } catch (error) {
          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json(
              new APIResponse(
                error,
                "Error Authenticating Data",
                httpStatus.INTERNAL_SERVER_ERROR,
                error
              )
            );
        }
      }
    } catch (err) {
      console.log("err ", err);
    }
  }

  async get(req, res, next) {
    try {
      let { UserID } = req.user;
      let response = await CartService.get(UserID);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(
              { cartData: response.response.recordset, Total: response.Total },
              "Cart Featch SuccessFully"
            )
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

  async getById(req, res, next) {
    try {
      let CartExist = await CartService.findById(
        req.params.id,
        req.user && req.user.UserID
      );
      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            CartExist[CartExist.length - 1],
            "Cart fetch Successfully",
            httpStatus.OK
          )
        );
    } catch (err) {
      console.log("err ", err);
    }
  }

  async update(req, res, next) {
    try {
      const response = await CartController.cartUpdate(
        req.params,
        req.body,
        req
      );

      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Cart Update SuccessFully"));
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

  static async cartUpdate(params, body, req) {
    let { id } = params;
    id = id ? id : body.CartID;
    let { UserID } = req.user;
    let CartExist = await CartService.findById(id, UserID);
    CartExist = CartExist && CartExist.recordset ? CartExist.recordset[0] : {};
    let cartBody = {
      ModifiedOn: moment(new Date()).format(),
      MealID: body.MealID,
      Quantity: body.Quantity,
      IsActive: 1,
      IsDeleted: 0,
      UserID: UserID,
    };
    const response = await CartService.update(cartBody, id);
    return response;
  }

  async delete(req, res, next) {
    try {
      let { id } = req.params;
      const response = await CartService.delete(id);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Cart Delete SuccessFully"));
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
var exports = (module.exports = new CartController());
