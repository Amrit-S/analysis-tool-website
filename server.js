const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config");
const { loadModel } = require("./services/cnn");
const { loadUnetModel } = require("./services/segmentation");

// initialize cnn prediction model
loadModel();
loadUnetModel();

console.log(`Running on port ${config.app.port}`);

const app = express();

//Middleware
app.use(logger("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ methods: ["GET", "POST", "PUT", "DELETE"] }));

//Routers
app.use("/server/cnn", require("./routes/cnn"));
app.use("/server/segmentation", require("./routes/segmentation"));

// production
if (config.app.env === "production") {
    // link React frontend
    app.use(express.static(path.join(__dirname, "client", "build")));
  
    // any routes called that are not handled by server are forwarded to frontend
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
  
    // development
  } else {
    app.get("/server", (req, res) => {
      res.status(200).json({ message: "Abandon All Hope Ye Who Enter Here..." });
    });
  }

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log("Error caught");
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({ message: err.message });
});

module.exports = app;
