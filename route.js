const path = require("path");
const { sendmess } = require("./sendmess");
const express = require("express");
const router = express.Router();

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
          content: `感谢您关注伊甸数智医疗技术！

          我们致力于数字化骨科康复矫形和假肢产品的研究、开发和生产。我们的团队由医学专家和数字化医工设计专业人才组成，旨在为全球患者提供高品质的数字化医疗产品和服务。
          
          我们提供在线预约服务，为了方便您的就诊体验。只需点击菜单栏下的“产品服务”，选择“线上预约”，即可预约我们的诊所。我们会提供最专业、最贴心的服务，帮助您重返健康、活力的生活。
          
          感谢您的关注，期待与您一同探索数字化医疗技术的未来。。
          `,
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
