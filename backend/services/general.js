const fs = require("fs");
const path = require('path');

// convert string back to buffer
function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

function clearDirectories(directories){

    directories.forEach((dir) => {

        fs.readdir(dir, (err, files) => {
            if (err) throw err;
        
            for (const file of files) {
            fs.unlink(path.join(dir, file), err => {
                if (err) throw err;
            });
            }
        });

    });
}

module.exports = {
    str2ab,
    clearDirectories
};