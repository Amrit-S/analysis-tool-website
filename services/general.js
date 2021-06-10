const fs = require("fs");
const path = require("path");
const { COLORED_IMG_SRC_DIR } = require("../segmentation/constants");

// convert string back to buffer
function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

/**
 * Removes all given filenames in given directories.
 *
 * @param {[string]} directories - A list of directories that need to be cleaned out.
 * @param {[string]} filenames - A list of filenames that need to be cleaned out in those directories.
 */
function clearDirectories(directories, filenames) {
    // loop through all directories
    directories.forEach((dir) => {
        // loop through all files
        for (const file of filenames) {
            // special case - has multiple versions of each file to unlink
            if (dir === COLORED_IMG_SRC_DIR) {
                // all possible versions
                for (let prefix of ["OV_", ""]) {
                    let filepath = path.join(dir, `${prefix}${path.parse(file).name}.png`);

                    // remove file
                    fs.unlink(filepath, (err) => {
                        if (err) console.log(err);
                    });
                }
                // general case
            } else {
                let filepath = path.join(dir, file);

                // remove file
                fs.unlink(filepath, (err) => {
                    if (err) console.log(err);
                });
            }
        }
    });
}

module.exports = {
    str2ab,
    clearDirectories,
};
