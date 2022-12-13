const ContactService = require("../services/contact");
const APIResponse = require("../utils/APIResponse");
const JWTHelper = require("../utils/jwt.helper");
const database = require("../models");
const httpStatus = require("http-status");
const Utils = require("../utils/util");
const Sequelize = require("sequelize");
const { response } = require("express");
const messages = require("../utils/constants");
const { sendPushNotification } = require("../utils/pushnotification");
const emailHelper = require("../utils/email-helper");
const config = require('./../../server/utils/config');

const Op = Sequelize.Op;

class ContactController {
    async create(req, res, next) {
        let body = req.body;
        console.log(body);
        try {
            let response = await ContactService.add(body);
            if (response) {
                await emailHelper.sendMail(config.mailer.email, 'Contact Request', 'user/contact-message.html', response);
                return res.status(httpStatus.OK).json(new APIResponse(response, "Contact Add Successfully", httpStatus.OK));
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, "Error Authenticating Data", httpStatus.INTERNAL_SERVER_ERROR, error)
            );
        }
    }

    async get(req, res, next) {
        try {
            let response = await ContactService.get();
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, "Contact Featch SuccessFully"))
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, "Error Authenticating Data", httpStatus.INTERNAL_SERVER_ERROR, error));

        }
    }

    async update(req, res, next) {
        try {
            let { id } = req.params;
            let body = {
                ...req.body
            }
            const response = await ContactService.update(body, id)
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, "Contact Update SuccessFully"))
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, "Error Authenticating Data", httpStatus.INTERNAL_SERVER_ERROR, error));

        }
    }


    async delete(req, res, next) {
        try {
            let { id } = req.params;
            const response = await ContactService.delete(id)
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, "Contact Delete SuccessFully"))
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, "Error Authenticating Data", httpStatus.INTERNAL_SERVER_ERROR, error));

        }
    }
}
var exports = (module.exports = new ContactController());
