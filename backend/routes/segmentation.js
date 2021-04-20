var express = require('express');
const fs = require("fs");
const {unetPrediction} = require("../services/segmentation");
var router = express.Router();

const SEG_IMG_SRC_DIR = "./segmentation/img_dest/";

// convert string back to buffer
function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function test(float32Array){


    var output = new Uint8Array(float32Array.length);

    for (var i = 0; i < float32Array.length; i++) {
        var tmp = Math.max(-1, Math.min(1, float32Array[i]));
        tmp = tmp < 0 ? (tmp * 0x8000) : (tmp * 0x7FFF);
        tmp = tmp / 256;
        output[i] = tmp + 128;
    }
    console.log(output);

    return output;
}

function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}

// handle image predictions
router.post('/predict', async (req, res) => {
  let result = [];

  // process each image
  for (let i = 0; i < req.body.length; i++) {
    // save file with unique filename
    let buf = str2ab(req.body[i].buffer);
    const imgPath = `${SEG_IMG_SRC_DIR}${req.body[i].name}`;
    
    fs.writeFileSync(imgPath, Buffer.from(buf));
    console.log(imgPath);

    // predict and return via response
    const prediction = await unetPrediction(imgPath);
    console.log(prediction);

    // const l = prediction.reduce(function(map, obj) {
    //     if(obj in map){
    //         map[obj] += 1;
    //     } else {
    //         map[obj] = 1;
    //     }
    //     return map;
    // }, {});
    // console.log(l);


    fs.writeFileSync(`${SEG_IMG_SRC_DIR}UNET_${req.body[i].name}`, y)
    // result.push(pred);

    // // delete file
    // fs.rm(imgPath, (err) => {
    //   if (err) {
    //     console.log("File delete error: " + err.message);
    //   }
    // });

    // // check for valid prediction
    // if (!pred) {
    //   return res.status(400).json(req.body[i].name);
    // }
  }
  return res.status(200).json(result);
});

module.exports = router;
