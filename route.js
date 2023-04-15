const path = require("path");
const express = require("express");
const router = express.Router();
const { sendmess, sendTemplateMessage } = require("./sendmess");

router.post("/", async (req, res) => {
  console.log("Received event:", req.body);
  const { ToUserName, FromUserName, MsgType, Content, CreateTime, Event } =
    req.body;
  const appid = req.headers["x-wx-from-appid"] || "";

  if (Event === "subscribe") {
    console.log("Received subscription event:", req.body);
    const { ToUserName, FromUserName, Event } = req.body;

    if (Event === "subscribe") {
      const appid = req.headers["x-wx-from-appid"] || "";
      try {
        const result = await sendmess(appid, {
          touser: FromUserName,
          msgtype: "text",
          text: {
            content: `感谢关注伊甸数智医疗技术！我们致力于数字化骨科康复矫形和假肢产品的研究、开发和生产，旨在为全球患者提供高品质的数字化医疗产品和服务。
    
    我们提供以下服务：
    1. 在线预约服务，方便您的就诊体验。点击<a href="https://ud8dwa5smb.jiandaoyun.com/f/643915f4aa01e10008bb341b">「产品服务」，选择「预约到店」</a>即可。
    2. 报告查询服务，快速查询您的检查报告。点击<a href="https://ud8dwa5smb.jiandaoyun.com/q/643915f4aa01e10008bb341b">「点我查询」</a>即可。
    
    期待与您一同探索数字化医疗技术的未来。`,
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
  } else if (MsgType === "text") {
    // Handle message push
    if (Content === "我的报告") {
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
    } else if (Content === "开始扫描") {
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
    } else if (Content === "/testing") {
      try {
        const data = {
          touser: FromUserName,
          template_id: "-AFIZ8hpUujuNnsLUr1CMaeC2JPU9KnsiUmVhA_ydSo",
          data: {
            thing65: {
              value: "Ranon Chow",
            },
            thing66: {
              value: "123 Main Street",
            },
            phone_number4: {
              value: "19926495842",
            },
            time60: {
              value: "",
            },
            thing8: {
              value: "Please arrive 15 minutes early.",
            },
          },
        };

        const result = await sendTemplateMessage(appid, data);
        console.log("发送模板消息成功", result);
        res.send("success");
      } catch (error) {
        console.log("发送模板消息失败", error);
        res.status(500).send("Failed to send template message.");
      }
    } else {
      res.send("success");
    }
  }
});

module.exports = router;
