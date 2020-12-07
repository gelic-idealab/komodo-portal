const mysql = require('mysql2');
const config = require("../config");
// create the connection to database
const pool = mysql.createPool({
  ...config.mysql,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
