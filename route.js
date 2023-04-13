const path = require("path");
const { sendmess } = require("./sendmess");
const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const {
  bookAppointment,
  getAppointmentDateById,
  queryAppointment,
  cancelAppointment,
} = require("./dbQueries");

// Handle subscription event
router.post("/", async (req, res) => {
  console.log("Received subscription event:", req.body);
  const { ToUserName, FromUserName, Event } = req.body;

  if (Event === "subscribe") {
    const appid = req.headers["x-wx-from-appid"] || "";
    try {
      const result = await sendmess(appid, {
        touser: FromUserName,
        msgtype: "text",
        text: {
          content: "欢迎关注伊甸智的公众号！",
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

router.get("/login", async (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// 预约页面 push
router.post("/booking", (req, res) => {
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
router.post("/query", (req, res) => {
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

router.post("/cancel", (req, res) => {
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

// Handle message push
router.all("/", async (req, res) => {
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
  } else if (MsgType === "text" && Content === "开始扫描") {
    try {
      const result = await sendmess(appid, {
        touser: FromUserName,
        msgtype: "news",
        news: {
          articles: [
            {
              title: "聚焦足部健康，从脚型测量开始！",
              description: "手机拍照，即享3D足型扫描",
              url: "https://yd-wx.epoque.cn/sweeping/",
              picurl:
                "https://oss-yd-foot.oss-cn-shenzhen.aliyuncs.com/yd_photo/scan_icon.jpg",
            },
          ],
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

module.exports = router;
