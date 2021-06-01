const fs = require("fs");
const jpeg = require("jpeg-js");
const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node");

const MODEL_PATH = "cnn/pred_model/model.json";

let model = null;

async function loadModel() {
    try {
        const url = tfn.io.fileSystem(MODEL_PATH);
        model = await tf.loadLayersModel(url);
        console.log("CNN model loaded successfully");
    } catch (err) {
        console.log("CNN model load error: " + err);
    }
}

async function predict(imgPath) {
    try {
        // read image
        const buf = fs.readFileSync(imgPath);
        const image = jpeg.decode(buf, true);

        // preprocess image for VGG16
        const tensor = tf.browser.fromPixels(image).resizeBilinear([224, 224], false, true);
        const meanImageNetRGB = tf.tensor1d([104, 117, 123]);
        const processedTensor = tensor.sub(meanImageNetRGB).expandDims();

        // predict
        const prediction = await model.predict(processedTensor).data();

        return prediction;
    } catch (err) {
        console.log("Prediction failed: " + err);
    }
}

module.exports = {
    loadModel,
    predict,
};
