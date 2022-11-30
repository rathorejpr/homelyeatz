exports.dbConnection = function () {
  var dbConfig = {
    user: "appdev_homedine", // SQL Server Login
    password: "SuperSecret!*", // SQL Server Password
    server: "jsssb.database.windows.net", // SQL Server Server name
    database: "homedine", // SQL Server Database name
    requestTimeout: 300000,
  };
  return dbConfig;
};
