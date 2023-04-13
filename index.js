const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./route");

console.log("Starting server...");
const logger = morgan("dev");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);
app.use(express.static(path.join(__dirname, "public")));

// Use routes from route.js
app.use("/", routes);

const port = process.env.PORT || 80;

async function bootstrap() {
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
