var express = require('express');
const fs = require("fs");
const path = require('path');
const {RAW_IMG_SRC_DIR, UNET_IMG_SRC_DIR, CROPPED_IMG_DST, COLORED_IMG_SRC_DIR} = require("../segmentation/constants");
const {segmentation, analyzeSegmentation, naturalCompare, base64_encode} = require("../services/segmentation");
const {str2ab, clearDirectories} = require("../services/general");
var router = express.Router();


// handle image predictions
router.post('/predict', async (req, res) => {

  try{

    let filenames = [];

    // process each image
    for (let i = 0; i < req.body.files.length; i++) {

      // save file with unique filename
      let buf = str2ab(req.body.files[i].buffer);
      const imgPath = `${RAW_IMG_SRC_DIR}${req.body.files[i].name}`;
      filenames.push(req.body.files[i].name);
      
      fs.writeFileSync(imgPath, Buffer.from(buf));

    }

    const requestedOptions = req.body;

    await segmentation(filenames);

    const statistics = await analyzeSegmentation(filenames, requestedOptions);

    const results = statistics.map((stat, i) => {

      const filename = filenames[i];
      const raw_img_path = requestedOptions.overlay ? `${CROPPED_IMG_DST}${filename}`: `${RAW_IMG_SRC_DIR}${filename}`;
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

    const directories = [RAW_IMG_SRC_DIR, UNET_IMG_SRC_DIR, CROPPED_IMG_DST];
    if(requestedOptions.overlay) directories.push(COLORED_IMG_SRC_DIR);
    clearDirectories(directories, filenames);

    return res.status(200).json(results);

} catch(err){
    console.error(err);
    return res.status(400).json(err);
}
});

module.exports = router;
