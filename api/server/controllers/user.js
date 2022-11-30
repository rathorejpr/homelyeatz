const UserServices = require("../services/user");
const APIResponse = require("../utils/APIResponse");
const JWTHelper = require("../utils/jwt.helper");
const database = require("../models");
const httpStatus = require("http-status");
const Utils = require("../utils/util");
const Sequelize = require("sequelize");
const { response } = require("express");
const emailHelper = require("../utils/email-helper");
const messages = require("../utils/constants");
const { sendPushNotification } = require("../utils/pushnotification");
const LocationService = require("../services/location");
var sql = require("mssql");
const { uploadFileToBlob } = require("../utils/azureUpload");

const Op = Sequelize.Op;

class UserController {
  // sign up user
  async create(req, res, next) {
    try {
      req.body.Password = Utils.encrypt(req.body.Password.trim());

      req.body.Email = req.body.Email.trim();
      req.body.Mobile = req.body.Mobile;
      let body = req.body;
      let existData = await UserServices.checkExitUser(req.body);
      if (existData && existData.recordset && existData.recordset.length) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              {},
              `Email Or Phone  Number Already Exists`,
              httpStatus.BAD_REQUEST
            )
          );
      } else {
        let response = await UserServices.add(req.body);
        response =
          response && response.recordset && response.recordset.length
            ? { ...response.recordset[ 0 ] }
            : {};
        if (Object.keys(response).length) {
          if (body.Device_Token) {
            await UserServices.updateData(
              { Device_Token: body.Device_Token },
              response.UserID
            );
          }
          response = JSON.parse(JSON.stringify(response));
          delete response.Password;
          delete response.otp;
          let token = JWTHelper.getJWTToken({
            UserID: response.UserID,
            Email: req.body.Email,
            isActive: req.body.isActive,
            UserType: req.body.UserType,
          });

          response = {
            ...JSON.parse(JSON.stringify(response)),
            token: token,
          };
          return res
            .status(httpStatus.OK)
            .json(
              new APIResponse(
                response,
                `User Registered successfully`,
                httpStatus.OK
              )
            );
        } else {
          return res
            .status(httpStatus.BAD_REQUEST)
            .json(
              new APIResponse({}, `Error adding user`, httpStatus.BAD_REQUEST)
            );
        }
      }
    } catch (error) {
      console.log("error", error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Error adding user",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }

  async login(req, res, next) {
    let body = req.body;
    body.Email = body.Email.trim();
    body.UserType = body.UserType;

    if (body.Device_Token) {
      body.Device_Token = body.Device_Token.trim();
    }

    try {
      let response = await UserServices.findOne(req.body);
      response =
        response && response.recordset && response.recordset.length
          ? { ...response.recordset[ 0 ] }
          : {};

      let password;
      if (Object.keys(response).length) {
        password = Utils.compare(response.Password, body.Password);
      }

      if (password) {
        if (body.Device_Token) {
          await UserServices.updateData(
            { Device_Token: body.Device_Token },
            response.UserID
          );
        }

        const token = JWTHelper.getJWTToken({
          UserID: response.UserID,
          Email: response.Email,
          isActive: response.isActive,
          UserType: response.UserType,
        });
        response = {
          ...JSON.parse(JSON.stringify(response)),
          token: token,
        };
        delete response.Password;
        delete response.otp;
        if (response.EmailVerified == 0 || response.MobileVerified == 0) {
          let code = await Utils.generateUUID1(6);
          let code2 = Math.floor(100000 + Math.random() * 900000);

          let mailData = {
            OTP: code?.length < 6 ? code2 : Number(code),
            Username: response.Name,
          };
          let data = {
            otp: code?.length < 6 ? code2 : Number(code),
          };

          await UserServices.updateData(data, response.UserID);

          if (
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
              response.Email.trim()
            )
          ) {
            await emailHelper.sendMail(
              response.Email.trim(),
              `OTP`,
              "user/customer-forgotpassword.html",
              mailData
            );
          }
        }
        if (response.Device_Token) {
          let data = {
            payload: {
              notification: {
                title: "Home Dine",
                body: "Welcome to Home Dine",
              },
              data: {
                type: "RESERVATION",
              },
            },
            deviceId: response.Device_Token,
          };
          // await sendPushNotification(data);
        }
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Login successfully", httpStatus.OK));
      } else {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json(
            new APIResponse(
              {},
              "Email or Password are incorrect",
              httpStatus.UNAUTHORIZED
            )
          );
      }
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Error authenticating user",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }

  async update(req, res, next) {
    let body = req.body;
    try {
      if (body.Password) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json(
            new APIResponse(
              {},
              "Error authenticating user",
              httpStatus.UNAUTHORIZED
            )
          );
      } else {
        await UserServices.updateData(body, req.params.id);
        let response = await UserServices.findById(req.params.id);
        response = JSON.parse(JSON.stringify(response));
        delete response.password;
        delete response.otp;
        if (response) {
          res
            .status(httpStatus.OK)
            .send(
              new APIResponse(response.recordset[ 0 ], messages.SUCCESS_UPDATE)
            );
        }
      }
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Error authenticating user",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }

  async updateV2(req, res, next) {
    let body = req.body;

    try {
      if (body.Password) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json(
            new APIResponse(
              {},
              "Error authenticating user",
              httpStatus.UNAUTHORIZED
            )
          );
      } else {
        if (req.body.ProfileName && req.body.ProfileName) {
          let existProfileName = await UserServices.findByProfileName(req.body.ProfileName, req.params.id);
          if (existProfileName && existProfileName.recordset && existProfileName.recordset.length) {
            return res
              .status(httpStatus.OK)
              .json(
                new APIResponse(
                  {},
                  "Profile name already exist",
                  httpStatus.BAD_REQUEST
                )
              );
          }
        }
        if (req.body.MyStory && req.body.MyStory.length > 1000) {
          return res
            .status(httpStatus.OK)
            .json(
              new APIResponse(
                {},
                "MyStory should be more than 1000 characters",
                httpStatus.BAD_REQUEST
              )
            );
        }
        if (req.file && Object.keys(req.file).length) {
          let image = await uploadFileToBlob(
            req.file,
            "products",
            req.params.id,
            'profile'
          );
          if (image) {
            body.ImgProfile = image.url;
          }
        }
        await UserServices.updateData(body, req.params.id);
        let response = await UserServices.findById(req.params.id);
        response = JSON.parse(JSON.stringify(response));
        if (response?.recordset?.length) {
          response = response.recordset[ response?.recordset?.length - 1 ];
          const token = JWTHelper.getJWTToken({
            UserID: response.UserID,
            Email: response.Email,
            isActive: response.isActive,
            UserType: response.UserType,
          });
          response = {
            ...JSON.parse(JSON.stringify(response)),
            token: token,
          };
          delete response.Password;
          delete response.otp;
          res
            .status(httpStatus.OK)
            .send(
              new APIResponse(response, messages.SUCCESS_UPDATE)
            );
        }
      }
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Error authenticating user",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }

  async changePassword(req, res, next) {
    try {
      let user = await UserServices.findOne(req.body);
      user =
        user && user.recordset && user.recordset.length
          ? { ...user.recordset[ 0 ] }
          : {};
      if (Object.keys(user).length) {
        if (req.body.oldPassword == Utils.decrypt(user.Password)) {
          let newPassword = Utils.encrypt(req.body.newPassword);

          let response = await UserServices.updateData(
            {
              Password: newPassword,
            },
            user.UserID
          );
          if (response) {
            return res
              .status(httpStatus.OK)
              .send(new APIResponse(null, messages.SUCCESS_RESETPASS));
          }
        } else {
          return res
            .status(httpStatus.BAD_REQUEST)
            .send(
              new APIResponse(
                null,
                messages.NOT_MATCH_OLDPASSWORD,
                httpStatus.BAD_REQUEST
              )
            );
        }
      } else {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send(
            new APIResponse(
              null,
              messages.USER_EMAIL_NOT_EXISTS,
              httpStatus.BAD_REQUEST
            )
          );
      }
    } catch (e) {
      next(e);
    }
  }

  async verify(req, res, next) {
    let { UserID } = req.user;
    try {
      let verification = await UserServices.findById(UserID);

      verification =
        verification && verification.recordset && verification.recordset.length
          ? { ...verification.recordset[ 0 ] }
          : {};
      if (Object.keys(verification).length) {
        if (verification.otp == req.body.otp) {
          let data = {
            EmailVerified: 1,
            MobileVerified: 1,
          };
          const savedUser = await UserServices.updateData(data, UserID);

          const token = JWTHelper.getJWTToken({
            UserID: verification.UserID,
            Email: verification.Email,
            isActive: verification.isActive,
            UserType: verification.UserType,
          });

          return res.status(httpStatus.OK).json(
            new APIResponse(
              {
                ...verification,
                EmailVerified: true,
                MobileVerified: true,
                token,
              },
              "Verification Successfully",
              200
            )
          );
        } else {
          return res
            .status(httpStatus.BAD_REQUEST)
            .send(
              new APIResponse(
                null,
                "Please Enter Valid OTP",
                httpStatus.BAD_REQUEST
              )
            );
        }
      } else {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send(
            new APIResponse(null, "User Not Exist!", httpStatus.BAD_REQUEST)
          );
      }
    } catch (error) {
      next(error);
    }
  }

  async forgatePassword(req, res, next) {
    try {
      let user = await UserServices.findOne(req.body);
      user =
        user && user.recordset && user.recordset.length
          ? { ...user.recordset[ 0 ] }
          : {};
      if (Object.keys(user).length) {
        let code = Utils.generateUUID(6);

        let mailData = {
          OTP: code,
        };
        if (
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            user.Email.trim()
          )
        ) {
          await emailHelper.sendMail(
            user.Email.trim(),
            `OTP`,
            "user/customer-forgotpassword.html",
            mailData
          );
        }
        let data = {
          otp: code,
        };
        await UserServices.updateData(data, user.UserID);
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(
              {},
              "Your Password Sucessfully Send Your Mail ",
              httpStatus.OK
            )
          );
      } else {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send(
            new APIResponse(null, "Please Valid Email", httpStatus.BAD_REQUEST)
          );
      }
    } catch (e) {
      next(e);
    }
  }

  async verifyByPhone(req, res, next) {
    let { UserID } = req.user;
    try {
      let verification = await UserServices.findById(UserID);

      verification =
        verification && verification.recordset && verification.recordset.length
          ? { ...verification.recordset[ 0 ] }
          : {};

      if (Object.keys(verification).length) {
        let data = {
          EmailVerified: 1,
          MobileVerified: 1,
        };
        const savedUser = await UserServices.updateData(data, UserID);
        const token = JWTHelper.getJWTToken({
          UserID: verification.UserID,
          Email: verification.Email,
          isActive: verification.isActive,
          UserType: verification.UserType,
        });

        return res.status(httpStatus.OK).json(
          new APIResponse(
            {
              ...verification,
              EmailVerified: true,
              MobileVerified: true,
              token,
            },
            "Verification Successfully",
            200
          )
        );
      } else {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send(
            new APIResponse(
              null,
              "Please Enter Valid OTP",
              httpStatus.BAD_REQUEST
            )
          );
      }
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      let { otp, Email, newPassword } = req.body;
      newPassword = Utils.encrypt(newPassword);
      let verification = await UserServices.find({ otp: otp, Email: Email });
      verification =
        verification && verification.recordset && verification.recordset.length
          ? { ...verification.recordset[ 0 ] }
          : {};

      if (Object.keys(verification).length) {
        let UserID = verification[ "UserID" ];
        let data = {
          Password: newPassword,
          otp: null,
        };

        await UserServices.updateData(data, UserID);
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse({}, "Reset Password Successfully", httpStatus.OK)
          );
      } else {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send(
            new APIResponse(
              null,
              "Please Enter Valid OTP",
              httpStatus.BAD_REQUEST
            )
          );
      }
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      let response = await UserServices.getAll();
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response.recordset, "Location Featch SuccessFully")
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

  async getByID(req, res, next) {
    try {
      let { UserID } = req.user.UserID;
      if (!UserID) {
        UserID = req.params.id;
      }
      let response = await UserServices.findById(UserID);
      if (response) {
        delete response.recordset[ response.recordset.length - 1 ].Password;
        delete response.recordset[ response.recordset.length - 1 ].otp;
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(
              response.recordset[ response.recordset.length - 1 ],
              "User Featch SuccessFully"
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

  async getAllUsers(req, res, next) {
    try {
      let response = await sql.query("SELECT * FROM tbl_UserProfile;");
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Location Featch SuccessFully"));
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

  async AddAbout(req, res, next) {
    const { Image, Title, Description, createdAt, updatedAt } = req.body;
    try {
      let response = sql.query(
        `INSERT INTO tbl_Abouts(Image, Title, Description, createdAt, updatedAt) VALUES ('${Image}', '${Title}','${Description}', '${createdAt}', '${updatedAt}')`
      );
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(response, "Location Featch SuccessFully"));
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

  async getTermsAndConditions(req, res, next) {
    try {
      let response = await UserServices.getTermsAndConditions();
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(response.recordset, "Fetch Terms And Conditions")
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

var exports = (module.exports = new UserController());
