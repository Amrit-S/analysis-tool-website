/**
 * File contains all routes for any segmentation-related requests.
 */
var express = require("express");
const fs = require("fs");
const path = require("path");
const parser = require("json2csv");
const {
    RAW_IMG_SRC_DIR,
    UNET_IMG_SRC_DIR,
    CROPPED_IMG_DST,
    COLORED_IMG_SRC_DIR,
} = require("../segmentation/constants");
const {
    segmentation,
    analyzeSegmentation,
    naturalCompare,
    base64_encode,
    retrieveCSVHeaders,
} = require("../services/segmentation");
const { str2ab, clearDirectories } = require("../services/general");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
var router = express.Router();

/**
 * Route conducts segmentation and segmentation analysis on a group of images on a set of desired cell
 * features, returning back results of segmentation analysis on success.
 *
 * @param {[JSON]} files - Contains all image information.
 * @param {boolean} size - True if size data is needed.
 * @param {boolean} shape - True if shape data is needed.
 * @param {boolean} pointiness - True if pointiness data is needed.
 * @param {boolean} overlay - True if an image of the segmentation overlay is required.
 *
 * @returns {200} - Successful, returns array of JSON objects with desired segmentation results. Each object denotes the cellular breakdown for each image passed.
 * @returns {400} - Syntax Issue, at least one request body format is incorrect/missing
 * @returns {500} - Internal server error, some issue occurred and request could not be fulfilled.
 */
router.post(
    "/predict",
    [
        body("files")
            .isArray()
            .custom((value) => {
                if (!value) return false;
                // make sure that every entry in the array has a name and buffer key
                for (const i of value) {
                    if (i === undefined || i.name === undefined || i.buffer === undefined) {
                        return false;
                    }
                }
                return true;
            }),
        body("size").isBoolean(),
        body("shape").isBoolean(),
        body("pointiness").isBoolean(),
        body("overlay").isBoolean(),
        isValidated,
    ],
    async (req, res) => {
        const requestedOptions = req.body;
        let filenames = [];

        try {
            // process each image
            for (let i = 0; i < req.body.files.length; i++) {
                // save file with unique filename to a specific directory
                let buf = str2ab(req.body.files[i].buffer);
                const imgPath = `${RAW_IMG_SRC_DIR}${req.body.files[i].name}`;
                filenames.push(req.body.files[i].name);

                fs.writeFileSync(imgPath, Buffer.from(buf));
            }

            // conduct segmentation on all images
            await segmentation(filenames);

            // analyze cells from segmentation on all images
            const statistics = await analyzeSegmentation(filenames, requestedOptions);

            // format results from segmentation
            const results = statistics.map((stat, i) => {
                const filename = filenames[i];
                // filepath to cropped image, otherwise null if no overlay option was chosen
                const raw_img_path = requestedOptions.overlay
                    ? `${CROPPED_IMG_DST}${filename}`
                    : null;
                // filepath to overlayed image with segmentation results
                const overlay_img_path = `${COLORED_IMG_SRC_DIR}${path.parse(filename).name}.png`;
                let totalCells = null;
                for (let key in stat) {
                    totalCells = key.totalCells;
                    break;
                }

                return {
                    filename: filename,
                    stats: stat,
                    totalCells: totalCells,
                    raw_img: base64_encode(raw_img_path),
                    segmented_img: requestedOptions.overlay
                        ? base64_encode(overlay_img_path)
                        : null,
                };
            });

            // sort file objects using natural sort on filenames
            results.sort(function compare(file1, file2) {
                return naturalCompare(file1.filename, file2.filename);
            });

            // clean up all extraneous files
            const directories = [RAW_IMG_SRC_DIR, UNET_IMG_SRC_DIR, CROPPED_IMG_DST];
            if (requestedOptions.overlay) directories.push(COLORED_IMG_SRC_DIR);
            clearDirectories(directories, filenames);

            // success, return with results
            return res.status(200).json(results);

            // uh oh, something failed
        } catch (err) {
            // clean up all extraneous files
            const directories = [RAW_IMG_SRC_DIR, UNET_IMG_SRC_DIR, CROPPED_IMG_DST];
            if (requestedOptions.overlay) directories.push(COLORED_IMG_SRC_DIR);
            clearDirectories(directories, filenames);

            console.error(err);
            return res.status(500).json(err);
        }
    }
);

/**
 * Route takes in some JSON information, and converts it into a corresponding csv file which is
 * then sent back as an attachment to the response.
 *
 * @returns {200} - Successful, returns a csv rendering of the given data.
 * @returns {400} - Syntax Issue, at least one request body format is incorrect/missing
 * @returns {500} - Internal server error, some issue occurred and request could not be fulfilled.
 */
router.post(
    "/download",
    [
        body("stats").custom((value) => {
            if (!value) return false;
            // make sure that every entry has an array object attached to it
            for (const i of Object.keys(value)) {
                if (i === undefined || value[i].length < 0) {
                    return false;
                }
            }
            return true;
        }),
        body("totalCells").isNumeric(),
        isValidated,
    ],
    async (req, res) => {
        try {
            // retrieve data from request
            const entry = req.body;

            // extract csv headers from data
            const fields = retrieveCSVHeaders(entry.stats);
            const numCells = entry.totalCells;

            let jsonData = [];

            // loop through number of cells
            for (let i = 0; i < numCells; i++) {
                // cell row construction
                let cellRow = {
                    cell: i + 1, // index value
                };

                // retrieve cell data per csv header
                for (let header of fields) {
                    let key = header.value;
                    cellRow[key] = entry.stats[key][i];
                }

                // push cell row data to bigger json container
                jsonData.push(cellRow);
            }

            // add cell index as first column in csv headers
            fields.unshift({
                label: "Cell #",
                value: "cell",
            });

            // construct csv constructor object
            const json2csv = new parser.Parser({ fields });
            const csv = json2csv.parse(jsonData);

            // send response
            res.header("Content-Type", "text/csv");
            res.attachment("stats.csv");
            return res.status(200).send(csv);

            // uh oh, something failed
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    }
);

module.exports = router;
