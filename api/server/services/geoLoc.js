const database = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const SqlQuery = require("./sqlqueries");
var sqlQ = new SqlQuery
class GeoLocService {
    static async getAll() {
        try {
            const response = await sqlQ.getAll('tblADM_GeoLoc')
            return response
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            let WhereCondition = `PostCodeID = '${id}'`;
            const response = await sqlQ.findByID('tblADM_GeoLoc', WhereCondition)
            return response
        } catch (error) {
            throw error;
        }
    }

    static async addChefDeliveryArea(data) {
        try {
            let response = await sqlQ.create("tbl_ChefDeliveryArea", { ...data }, "LocalityID");
            return response.recordset;
        } catch (error) {
            throw error;
        }
    }

    static async getChefDeliveryArea(ChefID) {
        try {
            let response = await sqlQ.joinQuery(
                `select CA.ChefID,CA.LocalityID,CA.ModifiedOn,GL.PostCode,GL.Locality,GL.State,GL.Category,GL.Longitude,GL.Latittude,GL.Country 
                from  tbl_ChefDeliveryArea CA,tblADM_GeoLoc GL WHERE CA.ChefID = '${ChefID}' AND CA.LocalityID = GL.PostCodeID;`
            );
            return response.recordset;
        } catch (error) {
            throw error;
        }
    }

    static async checkChefDeliveryAreaExist(ChefID, LocalityID) {
        try {
            let response = await sqlQ.joinQuery(
                `select * from tbl_ChefDeliveryArea where ChefID = '${ChefID}' AND LocalityID = '${LocalityID}'`
            );
            return response.recordset;
        } catch (error) {
            throw error;
        }
    }

    static async searchGeoLoc(query) {
        try {
            const response = await sqlQ.joinQuery(
                `SELECT * FROM tblADM_GeoLoc WHERE Category = 'Delivery Area' AND 
                (Locality LIKE '${query.search}%'  OR State LIKE '${query.search}%' OR Country LIKE '${query.search}%' OR PostCode LIKE '${query.search}%')`
            )
            return response
        } catch (error) {
            throw error;
        }
    }

    static async delete(id, UserId) {
        try {
            let WhereCondition = `LocalityID = '${id}' AND ChefID = '${UserId}'`;
            const response = await sqlQ.destroy('tbl_ChefDeliveryArea', WhereCondition)
            return response
        } catch (error) {
            throw error;
        }
    }
}

module.exports = GeoLocService;
