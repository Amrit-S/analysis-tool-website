var express = require("express");
const fs = require("fs");
const { predict } = require("../services/cnn");
const { str2ab } = require("../services/general");
const {
    CNN_IMG_SRC_DIR
} = require("../cnn/constants");
const { body } = require("express-validator");
const { isValidated } = require("../middleware/validation");
var router = express.Router();

// handle image predictions
router.post("/predict", 
[
    body("files").isArray()
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
    isValidated,
],
async (req, res) => {

    const files = req.body.files; 

    try {
        let result = [];

        // process each image
        for (let i = 0; i < files.length; i++) {
            // save file with unique filename
            let buf = str2ab(files[i].buffer);
            const imgPath = `${CNN_IMG_SRC_DIR}${req.headers["x-forwarded-for"]}_${files[i].name}`;

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
                return res.status(500).json(files[i].name);
            }
        }
        return res.status(200).json(result);
    } catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
});

module.exports = router;
