const path = require("path");
const express = require("express");
const cors = require("cors");
const moment = require("moment-timezone");
const { createConnection } = require("./db");
const {
  bookAppointment,
  getAppointmentDateById,
  queryAppointment,
  cancelAppointment,
} = require("./dbQueries");

const morgan = require("morgan");
// const { sendmess } = require("./sendmess");

console.log("Starting server...");
const logger = morgan("dev");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);
app.use(express.static(path.join(__dirname, "public")));

// SQLdb connection
const connection = createConnection();

// 预约页面
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "booking.html"));
});

app.get("/login", async (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// 预约页面 push
app.post("/booking", (req, res) => {
  const { name, phone, appointment_date } = req.body;
  const openid = req.headers["x-wx-openid"];
  console.log(
    `Received booking request with name: ${name}, phone: ${phone}, openid: ${openid}, and date:${appointment_date}`
  );

  const values = [name, phone, appointment_date, openid];

  bookAppointment(values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Failed to book appointment.");
    } else {
      const id = results.insertId;

      getAppointmentDateById(id, (error, results) => {
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
  console.log(`Received query request with name: ${name} and phone: ${phone}`);

  queryAppointment(name, phone, (error, results) => {
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
  });
});

app.post("/cancel", (req, res) => {
  const { name, phone } = req.body;

  console.log("Request body:", req.body);

  // Input validation
  if (!name || !phone) {
    res.status(400).json({ message: "姓名和电话不能为空。" });
    return;
  }
  // TODO: Add additional validation for phone number format, etc.

  cancelAppointment(name, phone, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "无法取消预约，请稍后重试。" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: "未找到匹配的预约记录。" });
    } else {
      console.log(`Deleted ${results.affectedRows} rows.`);
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
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
