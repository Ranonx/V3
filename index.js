const path = require("path");
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2"); // added mysql library
const morgan = require("morgan");
const { init: initDB, Counter } = require("./db");
const { sendmess } = require("./sendmess");

const logger = morgan("tiny");

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

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 预约页面
app.get("/booking", async (req, res) => {
  res.sendFile(path.join(__dirname, "booking.html"));
});

// 预约页面 push
app.post("/booking", (req, res) => {
  const { name, phone, appointment_date } = req.body;
  const sql =
    "INSERT INTO booking (name, phone, appointment_date) VALUES (?, ?, ?)";
  const values = [name, phone, appointment_date];

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Failed to book appointment.");
    } else {
      console.log(results);
      res.header("Content-Type", "application/json");
      res.send({ message: "Appointment booked successfully." });
    }
  });
});

// 查询预约时间
app.post("/query", (req, res) => {
  const { name, phone } = req.body;
  const sql =
    "SELECT appointment_date FROM booking WHERE name = ? AND phone = ?";
  const values = [name, phone];

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Failed to query appointment.");
    } else {
      res.header("Content-Type", "application/json");
      res.send({
        message: "Appointment found.",
        appointment_date: results[0].appointment_date,
      });
      console.log(results);
    }
  });
});

// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await Counter.count(),
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

// Handle message push
app.all("/", async (req, res) => {
  console.log("消息推送", req.body);
  const appid = req.headers["x-wx-from-appid"] || "";
  const { ToUserName, FromUserName, MsgType, Content, CreateTime } = req.body;
  console.log("推送接收的账号", ToUserName, "创建时间", CreateTime);
  if (MsgType === "text" && Content === "我的报告") {
    try {
      const result = await sendmess(appid, {
        touser: FromUserName,
        msgtype: "text",
        text: {
          content: "你的报告在这里",
        },
      });
      console.log("发送消息成功", result);
      res.send("success");
    } catch (error) {
      console.log("发送消息失败", error);
      res.status(500).send("Failed to send message.");
    }
  } else {
    res.send("success");
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
