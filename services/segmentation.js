/**
 * Contains all helper methods used in routes/segmentation.
 */
const fs = require("fs");
const jpeg = require("jpeg-js");
const tf = require("@tensorflow/tfjs");
const spawn = require("child_process").spawn;
const {
    PYTHON_FILES_SRC_DIR,
    SEG_WEIGHTS_FILE,
    RAW_IMG_SRC_DIR,
    UNET_IMG_SRC_DIR,
    CROPPED_IMG_DST,
    COLORED_IMG_SRC_DIR,
    CSV_DATA_SRC_DIR,
} = require("../segmentation/constants");
const tfn = require("@tensorflow/tfjs-node");

const MODEL_PATH = "segmentation/pred_model/model.json";

let model = null;

// Unused code - attempted to load UNET using tfn module.
async function loadUnetModel() {
    try {
        const url = tfn.io.fileSystem(MODEL_PATH);
        model = await tf.loadLayersModel(url);
        console.log("Unet model loaded successfully");
    } catch (err) {
        console.log("Unet model load error: " + err);
    }
}

// Unused code - attempted to use UNET using tfjs module instead of python spawns.
async function unetPrediction(imgPath) {
    try {
        // read image
        const buf = fs.readFileSync(imgPath);
        const image = jpeg.decode(buf, true);

        // preprocess image for UNET
        let tensor = tf.browser.fromPixels(image, 1).resizeBilinear([256, 256], false, true);

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

/**
 * Given an array of filenames, a python process will be executed that will produce UNet segmentation predictions on each
 * filename provided.
 *
 * @param {[string]} filenames - Filenames of all images that will be segmented on.
 * @returns Resolved promise if successfull, rejected promise if error occurs
 */
function segmentation(filenames) {
    return new Promise((resolve, reject) => {
        const segmentProcess = spawn("python3", [
            `${PYTHON_FILES_SRC_DIR}segmentCells.py`,
            RAW_IMG_SRC_DIR,
            UNET_IMG_SRC_DIR,
            SEG_WEIGHTS_FILE,
            CROPPED_IMG_DST,
            JSON.stringify(filenames),
        ]);

        // called whenever it received standard output from file
        segmentProcess.stdout.on("data", (data) => {
            console.log(`Received data: ${data}`);
        });

        // called when process is terminated, either on completion or on error
        segmentProcess.on("close", (code) => {
            console.log(`child process close all stdio with code ${code}`);

            // termination on completion
            if (code === 0) {
                resolve();
                // termination on anything else
            } else {
                reject(
                    "Segmentation failed on at least one image. Please make sure that uploaded images follow instruction guidelines."
                );
            }
        });
    });
}

/**
 * Given an array of filenames and options denoting what to analyze, a python process will be executed that will analyze all provide filename's
 * corresponding UNET segmentation predictions for the requested features.
 *
 * @param {[string]} filenames - Filenames of all images that will be segmented on.
 * @param {JSON} requestedOptions - JSON denoting what options the use will like to analyze.
 * @returns Resolved promise with statistic data on all filenames if successfull, rejected promise if error occurs
 */
function analyzeSegmentation(filenames, requestedOptions) {
    return new Promise((resolve, reject) => {
        // determines what the process will analyze
        const options = {
            overlay: requestedOptions.overlay || false,
            size: requestedOptions.size || false,
            shape: requestedOptions.shape || false,
            pointiness: requestedOptions.pointiness || false,
        };

        // analyze segmented images
        const analyzeProcess = spawn("python", [
            `${PYTHON_FILES_SRC_DIR}analyzeCells.py`,
            UNET_IMG_SRC_DIR,
            COLORED_IMG_SRC_DIR,
            CSV_DATA_SRC_DIR,
            CROPPED_IMG_DST,
            JSON.stringify(options),
            JSON.stringify(filenames),
        ]);

        let statistics = [];

        // called whenever it received standard output from file
        analyzeProcess.stdout.on("data", (data) => {
            // track retrieved data on segmentation statistics
            console.log(`Received data: ${data.toString()}`);
            statistics.push(...JSON.parse(data.toString()));
        });

        // called when process is terminated, either on completion or on error
        analyzeProcess.on("close", (code) => {
            console.log(`child process close all stdio with code ${code}`);

            // termination on completion
            if (code === 0) {
                resolve(statistics);

                // termination on anything else
            } else {
                reject(
                    "Segmentation Analysis failed on at least one image. Please make sure that uploaded images follow instruction guidelines."
                );
            }
        });
    });
}

/**
 * Comparison function used for natural sort of strings.
 *
 * @param {string} a - First filename
 * @param {string} b - Second filename
 * @returns {Number} - Precedence value
 */
function naturalCompare(a, b) {
    var ax = [],
        bx = [];

    a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
        ax.push([$1 || Infinity, $2 || ""]);
    });
    b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
        bx.push([$1 || Infinity, $2 || ""]);
    });

    while (ax.length && bx.length) {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = an[0] - bn[0] || an[1].localeCompare(bn[1]);
        if (nn) return nn;
    }

    return ax.length - bx.length;
}

/**
 * Encode file data to base64 encoded string.
 *
 * @param {string} file - File to be encoded.
 * @returns Encoded string.
 */
function base64_encode(file) {
    if (!file) return null;

    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString("base64");
}

/**
 * Retrieves a list of all cell attributes found within a json.
 *
 * @param {JSON} json
 * @returns [String] - Each entry indicates a cell attribute found.
 */
function retrieveCSVHeaders(json) {
    function getHeader(attribute) {
        switch (attribute) {
            case "size":
                return "Size";
            case "shape":
                return "Sides";
            case "pointiness":
                return "Pointiness";
            default:
                return attribute;
        }
    }
    let fields =
        Object.keys(json).map((key) => {
            return {
                label: getHeader(key),
                value: key,
            };
        }) || [];
    return fields;
}

module.exports = {
    loadUnetModel,
    unetPrediction,
    segmentation,
    analyzeSegmentation,
    naturalCompare,
    base64_encode,
    retrieveCSVHeaders,
};
