const fs = require("fs");
const jpeg = require("jpeg-js");
const tf = require("@tensorflow/tfjs");
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
        const prediction = await model.predict(processedTensor).data();
        
        return prediction;
    } catch (err) {
        console.log("Prediction failed: " + err);
    }
}


module.exports = {
    loadUnetModel,
    unetPrediction
};