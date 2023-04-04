const COS_SECRET_ID = "AKID5B7qJVUEpBRVQ9fz71h9TgpkHbkjjot3";
const COS_SECRET_KEY = "GMH1Z5VnzxkQs52iATSHwQnFfy9A3jgS";
const BUCKET_REGION = "7072-prod-8gj9vt8j4e3adc47-1317188113";
const BUCKET_NAME = "ap-shanghai";

document.getElementById("upload-btn").addEventListener("click", uploadFile);

async function uploadFile() {
  console.log("uploadFile detected"); // Debugging statement
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];
  const url = `https://${BUCKET_NAME}.cos.${BUCKET_REGION}.myqcloud.com/${file.name}`;
  const authorization = await getAuthorization(url, file);
  console.log("Authorization:", authorization); // Debugging statement
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: authorization,
      "Content-Type": file.type,
    },
    body: file,
  });
  if (response.ok) {
    console.log("File uploaded successfully."); // Debugging statement
  } else {
    console.error("Failed to upload file."); // Debugging statement
  }
}

async function getAuthorization(url, file) {
  const currentTime = parseInt(Date.now() / 1000);
  const expiredTime = currentTime + 600; // URL expires in 10 minutes
  const keyTime = `${currentTime};${expiredTime}`;
  const signKey = CryptoJS.HmacSHA1(keyTime, COS_SECRET_KEY).toString();
  const signString = `PUT\n\n${file.type}\n${keyTime}\n/${BUCKET_NAME}.cos.${BUCKET_REGION}.myqcloud.com/${file.name}`;
  const signature = CryptoJS.HmacSHA1(signString, signKey).toString();
  const authorization = `q-sign-algorithm=sha1&q-ak=${COS_SECRET_ID}&q-sign-time=${keyTime}&q-key-time=${keyTime}&q-header-list=&q-url-param-list=&q-signature=${signature}`;
  console.log("getAuthorization: Authorization", authorization); // Debugging statement
  return authorization;
}
