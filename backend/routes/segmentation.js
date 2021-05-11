var express = require('express');
const fs = require("fs");
const path = require('path');
const {RAW_IMG_SRC_DIR, UNET_IMG_SRC_DIR, CROPPED_IMG_DST, COLORED_IMG_SRC_DIR} = require("../segmentation/constants");
const {segmentation, analyzeSegmentation, naturalCompare, base64_encode} = require("../services/segmentation");
const {str2ab, clearDirectories} = require("../services/general");
var router = express.Router();


/**
 * Route conducts segmentation and segmentation analysis on a group of images on a set of desired cell
 * features, returning back results of segmentation analysis on success. 
 */
router.post('/predict', async (req, res) => {

  try{

    let filenames = [];

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
    const requestedOptions = req.body;
    const statistics = await analyzeSegmentation(filenames, requestedOptions);

    // format results from segmentation 
    const results = statistics.map((stat, i) => {

      const filename = filenames[i];
      // filepath to raw image (cropped if an overlay was done, otherwise original image)
      const raw_img_path = requestedOptions.overlay ? `${CROPPED_IMG_DST}${filename}`: `${RAW_IMG_SRC_DIR}${filename}`;
      // filepath to overlayed image with segmentation results 
      const overlay_img_path = `${COLORED_IMG_SRC_DIR}${path.parse(filename).name}.png`;
      let totalCells = null;
      for(let key in stat){ 
        totalCells = key.totalCells;
        break;
      }

      return {
        "filename": filename,
        "stats": stat,
        "totalCells": totalCells,
        "raw_img": base64_encode(raw_img_path),
        "segmented_img": requestedOptions.overlay ? base64_encode(overlay_img_path): null
      }
    });

    // sort file objects using natural sort on filenames
    results.sort(function compare(file1, file2){
      return naturalCompare(file1.filename, file2.filename);
    });

    // clean up all extraneous files 
    const directories = [RAW_IMG_SRC_DIR, UNET_IMG_SRC_DIR, CROPPED_IMG_DST];
    if(requestedOptions.overlay) directories.push(COLORED_IMG_SRC_DIR);
    clearDirectories(directories, filenames);

    // success, return with results 
    return res.status(200).json(results);

  // uh oh, something failed 
} catch(err){
    console.error(err);
    return res.status(400).json(err);
}
});

module.exports = router;
