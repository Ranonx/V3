const COS = require("cos-nodejs-sdk-v5");
const fs = require("fs");

const cos = new COS({
  SecretId: "wx3c17a0ae33647659",
  SecretKey: "33dc9b068d60a7e084dff0f0aade54b9",
});

const Bucket = "7072-prod-8gj9vt8j4e3adc47-1317188113";
const Region = "ap-shanghai";

function uploadFile(localPath, cosPath, callback) {
  cos.putObject(
    {
      Bucket,
      Region,
      Key: cosPath,
      Body: fs.createReadStream(localPath),
      onProgress: function (progressData) {
        console.log(JSON.stringify(progressData));
      },
    },
    function (err, data) {
      if (err) {
        console.error("Upload error:", err);
        callback(err, null);
      } else {
        console.log("Upload success:", data);
        callback(null, data);
      }
    }
  );
}

module.exports = {
  uploadFile,
};