const OrderService = require("../services/order");
const APIResponse = require("../utils/APIResponse");
const httpStatus = require("http-status");
const STATUS = require("../utils/constants");
const moment = require("moment");
const CartService = require("../services/cart");

class OrderController {
  async create(req, res, next) {
    try {
      let body = {
        status: STATUS[ 0 ],
        UserID: req.user.UserID,
        CreatedOn: moment().format(),
        ModifiedOn: moment().format(),
        CreatedBy: req.user.UserID,
        ModifiedBy: req.user.UserID,
      };
      let CartID = req.body.CartID;
      let response = [];
      for (let i in CartID) {
        let response1 = await OrderService.add({ ...body, CartID: CartID[ i ] });
        await CartService.update({ IsActive: 0 }, CartID[ i ]);
        response.push(response1.recordset[ 0 ]);
      }
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "SuccessFully Place Order"));
      }
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Error getting place order!",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }

  async get(req, res, next) {
    try {
      let response = await OrderService.getOrderByUser(req.user.UserID);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response.recordset, "Order Featch SuccessFully")
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

  async getProductByMealID(req, res, next) {
    try {
      if (!req.params.orderID) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(new APIResponse(null, "Order ID is required", httpStatus.BAD_REQUEST));
      }
      let response = await OrderService.getProductByMealID(Number(req.params.id), Number(req.params.orderID), req.user.UserID);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response, "Product Featch SuccessFully")
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

  async getByChefID(req, res, next) {
    try {
      let response = await OrderService.getOrderByChef(req.user.UserID);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response.recordset, "Order Featch SuccessFully")
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

  async getByChefIDWithPendingStatus(req, res, next) {
    try {
      let response = await OrderService.getOrderByChef(req.user.UserID);
      if (response) {
        response.recordset = response.recordset.filter(
          (e) => e.status === "Pending"
        );
        let data = { isPendingOrder: false };
        if (response.recordset.length) {
          data.isPendingOrder = true;
        }
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(data, "Order Featch SuccessFully"));
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

  async getLatestOrderFeedbackPending(req, res, next) {
    try {
      let response = await OrderService.getLatestOrderFeedbackPending(req.user.UserID);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Featch pending feedback SuccessFully"));
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

  async OTPGenerate(req, res, next) {
    try {
      let code = await Utils.generateUUID(4, { numericOnly: true });
      let UserData = await UserService.findById(req.user.UserID);
      let data = {
        payload: {
          notification: {
            title: "Home Dine",
            body: `Your `,
          },
          data: {
            type: "RESERVATION",
          },
        },
        deviceId: UserData.recordset[ 0 ].Device_Token,
      };
      if (UserData.recordset[ 0 ] && UserData.recordset[ 0 ].Device_Token) {
        await sendPushNotification(data);
      }
      let response = await OrderService.update(
        {
          ModifiedOn: moment(new Date()).format(),
          OTP: code,
          ModifiedBy: req.user.UserID,
        },
        req.body.OrderID
      );
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response.recordset, "Order Featch SuccessFully")
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
var exports = (module.exports = new OrderController());
