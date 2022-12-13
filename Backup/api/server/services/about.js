const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class AboutService {
    static async add(data) {
        try {
            return await database.tbl_About.create(data);
        } catch (error) {
            throw error;
        }
    }

    static async get() {
        try {
            let response = await database.tbl_About.findOne();
            return response
        } catch (error) {
            throw error;
        }
    }

    static async checkExitUser(data) {
        try {
            return await database.User.count({
                where: {
                    [Op.or]: [{ email: data.email }, { phone: data.email }],
                },
            });
        } catch (error) {
            throw error;
        }
    }

    static async findOne(data) {
        try {
            let response = await database.tbl_About.findOne({
                where: {
                    [Op.or]: [{ email: data.email }, { phone: data.email }],
                    role: data.role,
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async update(data, id) {
        try {
            let response = await database.tbl_About.update(data, { where: { id: id } });
            console.log("response", response);
            if (response) {
                response = await database.tbl_About.findOne({ where: { id: id } });
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            let response = await database.User.findOne({
                where: { id: id },
                include: [
                    {
                        model: database.Location,
                        as: "locationDetails",
                        required: false,
                    },
                ],
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            let response = await database.tbl_About.destroy({
                where: { id: id }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AboutService;
