var express = require('express');
const fs = require("fs");
const {predict} = require("../services/cnn");
var router = express.Router();

const CNN_IMG_SRC_DIR = "./cnn/img_dest/";

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
router.post('/predict', async (req, res) => {
  let result = [];

  // process each image
  for (let i = 0; i < req.body.length; i++) {
    // save file with unique filename
    let buf = str2ab(req.body[i].buffer);
    const imgPath = `${CNN_IMG_SRC_DIR}${req.headers['x-forwarded-for']}_${req.body[i].name}`;
    
    fs.writeFileSync(imgPath, Buffer.from(buf));

    // predict and return via response
    let pred = await predict(imgPath);
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

module.exports = router;
