var express = require('express');
const fs = require("fs");
const path = require('path');
const parser = require('json2csv');
const {RAW_IMG_SRC_DIR, UNET_IMG_SRC_DIR, CROPPED_IMG_DST, COLORED_IMG_SRC_DIR} = require("../segmentation/constants");
const {segmentation, analyzeSegmentation, naturalCompare, base64_encode, retrieveCSVHeaders} = require("../services/segmentation");
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
      // filepath to cropped image, otherwise null if no overlay option was chosen 
      const raw_img_path = requestedOptions.overlay ? `${CROPPED_IMG_DST}${filename}`: null;
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


router.post('/download', async (req, res) => {
  try{
    const data = req.body.data;
    // for all stats in array
    for(const entry of data){
      const fields = retrieveCSVHeaders(entry.stats);
      const numCells = entry.totalCells;
      console.log(entry);
      console.log(fields);
      let jsonData = [];
      for(let i = 0; i < numCells; i++){
        let cellRow = {
          "cell": i + 1
        };
        for(let header of fields){
          let key = header.value;
          cellRow[key] = entry.stats[key][i];
        }
        jsonData.push(cellRow);
      };
      console.log(jsonData);
      // change to unshift
      fields.unshift({
           label: 'Cell #',
           value: 'cell'
      })
      const json2csv = new parser.Parser({ fields });
      const csv = json2csv.parse(jsonData);
      res.header('Content-Type', 'text/csv');
      res.attachment('stats.csv');
      return res.status(200).send(csv);
    }
  // uh oh, something failed
    } catch(err){
      console.error(err);
      return res.status(400).json(err);
    }
});

module.exports = router;
