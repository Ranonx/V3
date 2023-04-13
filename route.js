const path = require("path");
const { sendmess } = require("./sendmess");
const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");

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
          content: `欢迎关注伊甸数智医疗技术!

          专注于数字化骨科康复和假肢产品的研发，旗下品牌专注于足和脊柱健康产品的研发。我们的目标是利用高新技术手段，研究数字化骨科康复生物力学和人工智能应用，帮助人们更好地恢复和保护身体健康。
          
          如果您是学校筛查报告的家长或学生，欢迎使用我们的在线足部扫描服务！我们将为您提供详细的报告和建议，帮助您更好地了解和保护自己的足部健康。请点击下方的[报告查询]，或者[我的报告]，以开始您的足部扫描之旅。
          
          感谢您的关注，我们期待与您共同探索数字化医疗技术的未来。`,
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
