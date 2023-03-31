// cosOperations.js
const COS = require("cos-nodejs-sdk-v5");

async function initcos() {
  const cos = new COS({
    getAuthorization: async function (options, callback) {
      const res = await call({
        url: "http://api.weixin.qq.com/_/cos/getauth",
        method: "GET",
      });
      const info = JSON.parse(res);
      const auth = {
        TmpSecretId: info.TmpSecretId,
        TmpSecretKey: info.TmpSecretKey,
        SecurityToken: info.Token,
        ExpiredTime: info.ExpiredTime,
      };
      callback(auth);
    },
  });

  // 在这里使用 cos 进行操作，例如上传、下载文件等
}

function call(obj) {
  return new Promise((resolve, reject) => {
    request(
      {
        url: obj.url,
        method: obj.method || "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(obj.data || {}),
      },
      function (err, response) {
        if (err) reject(err);
        resolve(response.body);
      }
    );
  });
}

// Call initcos() to initialize the COS SDK with temporary credentials
initcos()
  .then(() => {
    // Perform COS operations here, e.g., upload and download files
  })
  .catch((error) => {
    console.error("Failed to initialize COS SDK:", error);
  });

module.exports = {
  initcos,
  uploadFile,
  getFile,
};
