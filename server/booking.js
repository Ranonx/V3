const express = require("express");
const mysql = require("mysql");
const path = require("path");

const app = express();

const connection = mysql.createConnection({
  host: "<database_host>",
  user: "<database_user>",
  password: "<database_password>",
  database: "<database_name>",
});

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));

app.post("/book-appointment", (req, res) => {
  const { name, phone, appointment_date } = req.body;
  const sql =
    "INSERT INTO appointments (name, phone, appointment_date) VALUES (?, ?, ?)";
  const values = [name, phone, appointment_date];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      console.log("Appointment booked successfully!");
      res.sendStatus(200);
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
