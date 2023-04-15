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
        // Send the original message
        const result1 = await sendmess(appid, {
          touser: FromUserName,
          msgtype: "text",
          text: {
            content: `感谢关注伊甸数智医疗技术！我们专注于数字化医疗产品的研发和生产，致力于为全球患者提供高品质的医疗服务。
  
    我们提供以下服务：
    1. 在线预约服务，方便您的就诊体验。点击<a href="https://ud8dwa5smb.jiandaoyun.com/f/643915f4aa01e10008bb341b">「预约到店」</a>。
  
    2. 预约查询服务，快速查询您的预约。点击<a href="https://ud8dwa5smb.jiandaoyun.com/q/643915f4aa01e10008bb341b">「点我查询」</a>。
    
    期待与您一同探索数字化医疗技术的未来。`,
          },
        });
        console.log("发送消息成功", result1);

        // Send the new article
        const result2 = await sendmess(appid, {
          touser: FromUserName,
          msgtype: "news",
          news: {
            articles: [
              {
                title: "迈向康复的智能化未来",
                description: "了解更多关于伊甸数智医疗技术的信息",
                url: "http://www.eddiorthopros.com/",
                picurl:
                  "http://42.193.219.49/wp-content/themes/eddi-ortho-pros-lab/assets/images/tpu-_080223.jpeg",
              },
            ],
          },
        });
        console.log("发送消息成功", result2);

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
