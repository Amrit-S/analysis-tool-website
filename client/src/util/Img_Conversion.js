/**
 * File contains image conversion functions used in displaying results.
 */

/**
 * Converts a string back to an array buffer.
 * 
 * @param {string} str - A stringified array buffer.
 * @returns - An array buffer.
 */
function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

/**
 * Converts an array buffer image to base 64 to display in an img tag.
 * 
 * @param {ArrayBuffer} buffer - An array buffer of an image.
 * @returns - Base 64 version of array buffer image.
 */
function arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
}

export { str2ab, arrayBufferToBase64 };
