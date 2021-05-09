const fs = require("fs");
const jpeg = require("jpeg-js");
const tf = require("@tensorflow/tfjs");
const spawn = require("child_process").spawn;
const {PYTHON_FILES_SRC_DIR, SEG_WEIGHTS_FILE, RAW_IMG_SRC_DIR, UNET_IMG_SRC_DIR, CROPPED_IMG_DST, COLORED_IMG_SRC_DIR, CSV_DATA_SRC_DIR} = require("../segmentation/constants");
const tfn = require("@tensorflow/tfjs-node");

const MODEL_PATH = "segmentation/pred_model/model.json";

let model = null;

async function loadUnetModel() {
    try {
        const url = tfn.io.fileSystem(MODEL_PATH);
        model = await tf.loadLayersModel(url);
        console.log("Unet model loaded successfully");
    } catch (err) {
        console.log("Unet model load error: " + err);
    }
}

async function unetPrediction(imgPath) {
    try {
        // read image
        const buf = fs.readFileSync(imgPath);
        const image = jpeg.decode(buf, true);

        // preprocess image for VGG16
        let tensor = tf.browser.fromPixels(image, 1)
            .resizeBilinear([256, 256], false, true);
        
        // const meanImageNetRGB = tf.tensor1d([104, 117, 123]);
        const processedTensor = tensor
        .mean(2)
        // .toFloat()
        .expandDims(0)
        .expandDims(-1);
        
        // predict
        const prediction = await model.predict(processedTensor);
        console.log(prediction);
        
        return prediction.data();
    } catch (err) {
        console.log("Prediction failed: " + err);
    }
}

function segmentation(filenames){
    return new Promise((resolve, reject) => {
      const segmentProcess = spawn('python',[`${PYTHON_FILES_SRC_DIR}preprocess.py`, RAW_IMG_SRC_DIR, UNET_IMG_SRC_DIR, SEG_WEIGHTS_FILE, CROPPED_IMG_DST, JSON.stringify(filenames)]);
  
      segmentProcess.stdout.on('data', (data) => {
        // Do something with the data returned from python script
        console.log(`Received data: ${data}`);
      });
  
      segmentProcess.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        if(code === 0){
          resolve();
        } else {
          reject("Segmentation failed on at least one image.")
        }
      });
  
    })
  }
  
  function analyzeSegmentation(filenames, requestedOptions){
  
    return new Promise((resolve, reject) => {
  
      const options = {
        "overlay": requestedOptions.overlay || false,
        "size": requestedOptions.size || false, 
        "shape": requestedOptions.shape || false,
        "pointiness": requestedOptions.pointiness || false
      };
  
      // Analyze segmented images
      const analyzeProcess = spawn('python',[`${PYTHON_FILES_SRC_DIR}analyzeCells.py`, UNET_IMG_SRC_DIR, COLORED_IMG_SRC_DIR, CSV_DATA_SRC_DIR, CROPPED_IMG_DST, JSON.stringify(options), JSON.stringify(filenames)]);
  
      let statistics = null;
      analyzeProcess.stdout.on('data', (data) => {
        // Do something with the data returned from python script
        console.log(`Received data: ${data}`);
        statistics = JSON.parse(data);
      });
  
      analyzeProcess.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);

        if(code === 0){
          resolve(statistics);
        } else {
          reject("Segmentation Analysis failed on at least one image.")
        }
      });
  
    })
  }

   /**
     * Comparison function used for natural sort of strings. 
     * 
     * @param {string} a - First filename
     * @param {string} b - Second filename
     * @returns {Number} - Precedence value
     */
    function naturalCompare(a, b) {
        var ax = [], bx = [];
    
        a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
        b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
        
        while(ax.length && bx.length) {
            var an = ax.shift();
            var bn = bx.shift();
            var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
            if(nn) return nn;
        }
    
        return ax.length - bx.length;
    }
    
    // function to encode file data to base64 encoded string
    function base64_encode(file) {
      // read binary data
      var bitmap = fs.readFileSync(file);
      // convert binary data to base64 encoded string
      return new Buffer.from(bitmap).toString('base64');
    }


module.exports = {
    loadUnetModel,
    unetPrediction,
    segmentation,
    analyzeSegmentation,
    naturalCompare,
    base64_encode
};