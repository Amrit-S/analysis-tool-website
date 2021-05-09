const fs = require("fs");
const path = require('path');
const { COLORED_IMG_SRC_DIR} = require("../segmentation/constants");

// convert string back to buffer
function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

function clearDirectories(directories, filenames){

    directories.forEach((dir) => {

        for(const file of filenames){

            if(dir === COLORED_IMG_SRC_DIR){
                for(let prefix of ["OV_", "OV2_", ""]){
                  
                    let filepath = path.join(dir, `${prefix}${path.parse(file).name}.png`);
                   
                    fs.unlink(filepath, err => {
                        if (err) throw err;
                    });

                }
            } else {

                let filepath = path.join(dir, file);

                fs.unlink(filepath, err => {
                    if (err) throw err;
                });

            }
        }

    });
}

module.exports = {
    str2ab,
    clearDirectories
};