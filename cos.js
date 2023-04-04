const COS = require("cos-nodejs-sdk-v5");
const fs = require("fs");

const cos = new COS({
  SecretId: "AKID5B7qJVUEpBRVQ9fz71h9TgpkHbkjjot3",
  SecretKey: "GMH1Z5VnzxkQs52iATSHwQnFfy9A3jgS",
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
