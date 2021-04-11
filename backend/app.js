const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config");
const fs = require("fs");
const predict = require("./ml/predict");

// initialize prediction model
predict.loadModel();

console.log(`Running on port ${config.app.port}`);

const app = express();

//Middleware
app.use(logger("dev"));
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ methods: ["GET", "POST", "PUT", "DELETE"] }));

//Routers
app.get("/", function (req, res) {
  res.status(200).json({ message: "Abandon All Hope Ye Who Enter Here..." });
});

// convert string back to buffer
function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// handle image predictions
app.post('/predict', async (req, res) => {
  let result = [];

  // process each image
  for (let i = 0; i < req.body.length; i++) {
    // save file with unique filename
    let buf = str2ab(req.body[i].buffer);
    const imgPath = "./ml/img_dest/" + req.headers['x-forwarded-for'] + "_" + req.body[i].name;
    fs.writeFileSync(imgPath, Buffer.from(buf));

    // predict and return via response
    let pred = await predict.predict(imgPath);
    result.push(pred);

    // delete file
    fs.rm(imgPath, (err) => {
      if (err) {
        console.log("File delete error: " + err.message);
      }
    });

    // check for valid prediction
    if (!pred) {
      res.status(400).send("Prediction error: couldn't predict on file " + req.body[i].name);
      return;
    }
  }
  
  res.status(200).json(JSON.stringify(result));
});

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
