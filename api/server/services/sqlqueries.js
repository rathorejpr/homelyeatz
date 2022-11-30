/* istanbul ignore file */
const sql = require("mssql");

class SqlQuery {
  async findByOR_ANDQuery(TableName, data, data1) {
    let keys = Object.keys(data);
    let OR_Set = keys.map((value) => {
      return `${value} = '${data[ value ]}'`;
    });
    let keys1 = Object.keys(data1);
    let AND_Set = keys1.map((value) => {
      return `${value} = '${data1[ value ]}'`;
    });
    return await sql.query(
      `SELECT * FROM ${TableName} WHERE (${OR_Set.join(
        " OR "
      )}) AND ${AND_Set.join(" AND ")} `
    );
  }

  async findByORQuery(TableName, data) {
    let keys = Object.keys(data);
    let OR_Set = keys.map((value) => {
      return `${value} = '${data[ value ]}'`;
    });
    return await sql.query(
      `SELECT * FROM ${TableName} WHERE ${OR_Set.join(" OR ")}`
    );
  }

  async create(TableName, data, id) {
    let keys = Object.keys(data);
    let value = keys.map((value, index) => {
      if (TableName === 'tbl_Search' && keys[ index ] === 'GeoLoc') {
        return `${data[ value ]}`;
      } else {
        return `'${data[ value ]}'`;
      }
    });
    return await sql.query(
      `INSERT INTO ${TableName}
            (${keys.join(",")})
                    OUTPUT inserted.${id}
            VALUES(${value.join(",")})`
    );
  }

  async joinQuery(query) {
    return await sql.query(query);
  }
  async findByIDAndUpdate(TableName, data, WhereCondition) {
    let update_set = Object.keys(data).map((value) => {
      return `${value} = '${data[ value ]}'`;
    });
    return await sql.query(`UPDATE ${TableName}
        SET ${update_set.join(",")} WHERE ${WhereCondition}`);
  }

  async findByID(TableName, WhereCondition) {
    console.log(`SELECT * FROM ${TableName} WHERE ${WhereCondition}`);
    return await sql.query(
      `SELECT * FROM ${TableName} WHERE ${WhereCondition}`
    );
  }

  async getAll(TableName) {
    return await sql.query(`SELECT * FROM ${TableName} `);
  }

  async destroy(TableName, WhereCondition) {
    return await sql.query(`DELETE FROM ${TableName} WHERE ${WhereCondition}`);
  }
}

module.exports = SqlQuery;
