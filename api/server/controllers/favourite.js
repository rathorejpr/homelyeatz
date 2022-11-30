const FavouriteService = require("../services/favourite");
const APIResponse = require("../utils/APIResponse");
const httpStatus = require("http-status");
const Sequelize = require("sequelize");
const moment = require("moment");

const Op = Sequelize.Op;

class FavouriteController {
  // constructor() {
  //   this.update = this.update.bind(this);
  // }

  async create(req, res, next) {
    try {
      let { UserID } = req.user;
      req.body.UserID = UserID;
      let body = {
        ChefID: req.body.ChefID,
        isFav: 1,
        CustomerID: Number(UserID),
      };
      if (req.body.MealID) {
        body = {
          ...body,
          MealID: req.body.MealID
        }
      }
      let FavouriteExist = req.body.MealID ? await FavouriteService.find(body) : await FavouriteService.findMealIdByNull(body);
      if (FavouriteExist.length > 0) {
        body = {
          ...body,
          isFav: FavouriteExist[ FavouriteExist.length - 1 ].isFav ? 0 : 1,
          ModifiedOn: moment(new Date()).format(),
        };
        const response1 = await FavouriteController.FavouriteUpdate(
          { id: FavouriteExist[ FavouriteExist.length - 1 ].Fav_ID },
          body,
          req
        );
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(
              response1.recordset[ response1.recordset.length - 1 ],
              body.isFav === 0 ? "Remove to Favourite!" : "Added to Favourite!",
              httpStatus.OK
            )
          );
      } else {
        try {
          let response = await FavouriteService.add(body);
          response =
            response && response.recordset && response.recordset.length
              ? { ...response.recordset[ response.recordset.length - 1 ] }
              : {};
          if (response) {
            return res
              .status(httpStatus.OK)
              .json(
                new APIResponse(
                  response,
                  "Added to Favourite!",
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


  async update(req, res, next) {
    try {
      const response = await FavouriteController.FavouriteUpdate(
        req.params,
        req.body,
        req
      );

      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Favourite Update SuccessFully"));
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

  static async FavouriteUpdate(params, body, req) {
    let { id } = params;
    const response = await FavouriteService.update(body, id);
    return response;
  }
}
var exports = (module.exports = new FavouriteController());
