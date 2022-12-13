const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery
class FooterService {
    static async add(data) {
        try {
            let response = await sqlQ.create('tbl_Footers', { ...data }, 'id')
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async get() {
        try {
            let response = await sqlQ.getAll('tbl_Footers')
            return response;
        } catch (error) {
            throw error;
        }
    }



    static async findOne(data) {
        try {
            let response = await database.tbl_Footer.findOne({
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
            let WhereCondition = `id = '${id}'`
            let response = await sqlQ.findByIDAndUpdate('tbl_Footers', { ...data }, WhereCondition)
            // let response = await sql.query(`UPDATE tbl_UserProfile
            // SET ${update_set.join(",")} WHERE UserID = ${id}`)
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            let WhereCondition = `id = '${id}'`
            let response = await sqlQ.findByID('tbl_Footers', WhereCondition)
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            let WhereCondition = `id = '${id}'`
            let response = await sqlQ.destroy('tbl_Footers', WhereCondition)
            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = FooterService