const fs = require('fs');
require('dotenv').config();

module.exports = {
    // If using onine database
    // development: {
    //   use_env_variable: 'DATABASE_URL'
    // },

    development: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        dialect: 'mssql'
    },

  
    production: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        dialect: 'mssql'
    },
};



// {
//   "development": {
//     "username": "appdev_homedine",
//     "password": "SuperSecret!*",
//     "database": "homedine",
//     "host": "jsssb.database.windows.net",
//     "dialect": "mssql"
   
//   },
//   "production": {
//     "username": "appdev_homedine",
//     "password": "SuperSecret!*",
//     "database": "homedine",
//     "host": "jsssb.database.windows.net",
//     "dialect": "mssql"
   
//   }
// }
