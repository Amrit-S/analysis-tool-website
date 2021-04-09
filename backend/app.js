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
app.use(express.json());
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

// handle image predictions
app.post('/predict', async (req, res) => {
  const data = [];

  //read image data as it comes in
  req.on('data', chunk => {
    data.push(chunk);
  });

  // predict
  req.on('end', async () => {
    // save file with unique filename
    const imgPath = "./ml/img_dest/" + req.headers['x-forwarded-for'] + "_" + req.headers.filename;
    fs.writeFileSync(imgPath, Buffer.concat(data));

    // predict and return via response
    let pred = await predict.predict(imgPath);
    res.status(200).json({ prediction: pred });

    // delete file
    fs.rm(imgPath, (err) => {
      if (err) {
        console.log("File delete error: " + err.message);
      }
    });
  });
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
