const request = require("request");

function sendmess(appid, mess) {
  return new Promise((resolve, reject) => {
    request(
      {
        method: "POST",
        url: `http://api.weixin.qq.com/cgi-bin/message/custom/send?from_appid=${appid}`,
        body: JSON.stringify(mess),
      },
      function (error, response) {
        if (error) {
          console.log("接口返回错误", error);
          reject(error.toString());
        } else {
          console.log("接口返回内容", response.body);
          resolve(response.body);
        }
      }
    );
  });
}
function sendTemplateMessage(appid, data) {
  return new Promise((resolve, reject) => {
    request(
      {
        method: "POST",
        url: `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?from_appid=${appid}`,
        body: JSON.stringify(data),
      },
      function (error, response) {
        if (error) {
          console.log("接口返回错误", error);
          reject(error.toString());
        } else {
          console.log("接口返回内容", response.body);
          resolve(response.body);
        }
      }
    );
  });
}

module.exports = {
  sendmess: sendmess,
  sendTemplateMessage: sendTemplateMessage,
};
