const { sendmess } = require("./sendmess");

const handlePush = async (req, res) => {
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
};

module.exports = { handlePush };
