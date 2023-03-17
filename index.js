const path = require("path");
const express = require("express");
const cors = require("cors");

const mysql = require("mysql2"); // added mysql library
const morgan = require("morgan");
// const { init: initDB } = require("./db");
// const { sendmess } = require("./sendmess");

console.log("Starting server...");
const logger = morgan("dev");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);
app.use(express.static(path.join(__dirname, "public"))); // add this line to serve static files

// mySQL connection
const connection = mysql.createConnection({
  host: "10.30.109.229",
  port: "3306",
  user: "root",
  password: "Rc19931020",
  database: "appointment",
});

// 预约页面
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "booking.html"));
});

// 预约页面 push
app.post("/booking", (req, res) => {
  const { name, phone, appointment_date } = req.body;
  const sql = `INSERT INTO booking (name, phone, appointment_date) 
             VALUES (?, ?, STR_TO_DATE(?, '%Y-%m-%d %h:%i %p'))`;

  const values = [name, phone, appointment_date];

  console.log(
    `Received booking request with name: ${name},phone: ${phone}, and date:${appointment_date}`
  );

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Failed to book appointment.");
    } else {
      const sqlQuery = "SELECT appointment_date FROM booking WHERE id = ?";
      const id = results.insertId;

      connection.query(sqlQuery, [id], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send("Failed to retrieve appointment date.");
        } else {
          console.log(results);
          const appointment_date = moment
            .tz(results[0].appointment_date, "Asia/Shanghai")
            .format("YYYY-MM-DD HH:mm");
          res.header("Content-Type", "application/json");
          res.send({
            message: "Appointment booked successfully.",
            appointment_date,
          });
        }
      });
    }
  });
});

// 查询预约时间
app.post("/query", (req, res) => {
  const { name, phone } = req.body;
  console.log(`Received query request with name: ${name} and phone: ${phone}`); // Add this line

  // Query the database
  connection.query(
    "SELECT DATE_FORMAT(appointment_date, '%Y-%m-%d %H:%i:%s') AS appointment_date FROM booking WHERE name = ? AND phone = ?",
    [name, phone],
    (error, results) => {
      console.log(results);
      if (error) {
        console.error(error);
        res
          .status(500)
          .json({ message: "An error occurred while querying the database." });
      } else if (results.length === 0) {
        res.status(404).json({
          message: "No appointment found for the given name and phone number.",
        });
      } else {
        const appointment_date = moment
          .tz(results[0].appointment_date, "Asia/Shanghai")
          .format("YYYY-MM-DD HH:mm");
        res.json({ appointment_date });
      }
    }
  );
});

app.post("/cancel", (req, res) => {
  const { name, phone } = req.body;

  console.log("Request body:", req.body); // Debug: Print the request body

  // Input validation
  if (!name || !phone) {
    res.status(400).json({ message: "姓名和电话不能为空。" });
    return;
  }
  // TODO: Add additional validation for phone number format, etc.

  const sql =
    "DELETE FROM appointment.booking WHERE name = ? AND phone = ? LIMIT 1";
  const values = [name, phone];

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error(error); // Debug: Log the error
      res.status(500).json({ message: "无法取消预约，请稍后重试。" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: "未找到匹配的预约记录。" });
    } else {
      console.log(`Deleted ${results.affectedRows} rows.`); // Debug: Log the number of rows deleted
      res.status(200).json({ message: `预约取消成功` });
    }
  });
});

// // 小程序调用，获取微信 Open ID
// app.get("/api/wx_openid", async (req, res) => {
//   if (req.headers["x-wx-source"]) {
//     res.send(req.headers["x-wx-openid"]);
//   }
// });

const port = process.env.PORT || 80;

async function bootstrap() {
  // await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
