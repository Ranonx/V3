const { createConnection } = require("./db");

function bookAppointment(values, callback) {
  const connection = createConnection();
  const sql = `INSERT INTO booking (name, phone, appointment_date, openid) 
             VALUES (?, ?, STR_TO_DATE(?, '%Y-%m-%d %h:%i %p'), ?)`;

  connection.query(sql, values, callback);
}

function getAppointmentDateById(id, callback) {
  const connection = createConnection();
  const sqlQuery = "SELECT appointment_date FROM booking WHERE id = ?";

  connection.query(sqlQuery, [id], callback);
}

function queryAppointment(name, phone, callback) {
  const connection = createConnection();
  const sql =
    "SELECT DATE_FORMAT(appointment_date, '%Y-%m-%d %H:%i:%s') AS appointment_date FROM booking WHERE name = ? AND phone = ?";

  connection.query(sql, [name, phone], callback);
}

function cancelAppointment(name, phone, callback) {
  const connection = createConnection();
  const sql =
    "DELETE FROM appointment.booking WHERE name = ? AND phone = ? LIMIT 1";
  const values = [name, phone];

  connection.query(sql, values, callback);
}

module.exports = {
  bookAppointment,
  getAppointmentDateById,
  queryAppointment,
  cancelAppointment,
};
