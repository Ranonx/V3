const request = require("request");
const COS = require("cos-nodejs-sdk-v5");
const fs = require("fs");
const path = require("path");

// Configuration
const cosConfig = {
  Bucket: "7072-prod-8gj9vt8j4e3adc47-1317188113", // Fill in the Cloud Hosting Object Storage bucket name
  Region: "ap-shanghai", // Storage bucket region, default is Shanghai, fill in the corresponding region for other environments
};
// 在服务启动时或者页面加载时初始化，注意这是异步的，需要等待完成，可以通过 this.cos 是否存在来判断是否完成。
initcos();

/**
 * 封装的COS-SDK初始化函数，建议在服务启动时挂载全局，通过this.cos使用对象
 */
async function initcos() {
  const COS = require("cos-nodejs-sdk-v5");
  try {
    this.cos = new COS({
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
    console.log("COS初始化成功");
  } catch (e) {
    console.log("COS初始化失败", res);
  }
}

/**
 * 封装的网络请求方法
 */
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
// Download file function
async function getFile(cloudpath, filepath) {
  try {
    const res = await this.cos.getObject({
      Bucket: cosConfig.Bucket,
      Region: cosConfig.Region,
      Key: cloudpath,
      Output: path.join("./", filepath),
    });
    if (res.statusCode === 200) {
      return {
        code: 0,
        file: path.join("./", filepath),
      };
    } else {
      return {
        code: 1,
        msg: JSON.stringify(res),
      };
    }
  } catch (e) {
    console.log("Download file failed", e.toString());
    return {
      code: -1,
      msg: e.toString(),
    };
  }
}

// Upload file function
async function uploadFile(cloudpath, filepath) {
  const authres = await call({
    url: "http://api.weixin.qq.com/_/cos/metaid/encode",
    method: "POST",
    data: {
      openid: "", // Fill in the user openid, management side is an empty string
      bucket: cosConfig.Bucket,
      paths: [cloudpath],
    },
  });

  try {
    const auth = JSON.parse(authres);
    const res = await this.cos.putObject({
      Bucket: cosConfig.Bucket,
      Region: cosConfig.Region,
      Key: cloudpath,
      StorageClass: "STANDARD",
      Body: fs.createReadStream(filepath),
      ContentLength: fs.statSync(filepath).size,
      Headers: {
        "x-cos-security-token": auth[cloudpath].token,
        "x-cos-meta-id": auth[cloudpath].meta_id,
      },
    });
    if (res.statusCode === 200) {
      return {
        code: 0,
        url: `https://${cosConfig.Bucket}.cos.${cosConfig.Region}.myqcloud.com/${cloudpath}`,
      };
    } else {
      return {
        code: 1,
        msg: JSON.stringify(res),
      };
    }
  } catch (e) {
    console.log("Upload file failed", e.toString());
    return {
      code: -1,
      msg: e.toString(),
    };
  }
}

// Export functions
module.exports = {
  initCos,
  getFile,
  uploadFile,
};
