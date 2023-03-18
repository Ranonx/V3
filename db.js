const mysql = require("mysql2");

function createConnection() {
  const connection = mysql.createConnection({
    host: "10.30.109.229",
    port: "3306",
    user: "root",
    password: "Rc19931020",
    database: "appointment",
  });

  return connection;
}

module.exports = {
  createConnection,
};
