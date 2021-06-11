/**
 * File contains all code to represent and manage the internal state and display
 * of the DropBox component. The component itself allows for the user to drop
 * files, showcasing all inputted files that met a set of restrictions imposed.
 * For all of these files, the user has the ability to delete a file as well as preview it on their browser.
 *
 * All files inputted must conform to a naming schema defined near the top of the file, and must be unique in filename. If
 * two files of the same name are dropped together or consecutively, then the newer version of the two will be kept.
 *
 * The component has an internal state representation that keeps track of all "accepted" files in the dropbox, namely
 * all the files that met all restrictions imposed. This internal state can be accessed at any time by a parent component
 * using a function prop passed to this component, that allows for synchronous updates on its own state value.
 *
 * @summary   Allows for the uploading, deletion, preview, and access of files inside the DropBox.
 * @author    Amrit Kaur Singh
 */

import React from "react";
import Dropzone from "react-dropzone";
import { Snackbar } from "@material-ui/core";

import "../../css/DropBox.css";

const FILE_NAMING_REGEX = /^\d+\.\d{2}\.[a-zA-Z]+$/;

/**
 * @param {function([File Objects])} handleFiles - Function that takes in a list of file objects, used to track uploaded files
 */
export default function DropBox(props) {
    const [state, setState] = React.useState({
        files: {}, // tracks all "accepted" files uploaded so far, mapping filename (key) to file object (value)
        displayError: false,
    });

    /**
     * Closes snackbar after set seconds by updating its state value.
     *
     * @param {string} reason - Reason for function call
     */
    const handleSnackClose = (reason) => {
        if (reason === "clickaway") {
            return;
        }
        setState({ ...state, displayError: false });
    };

    /**
     * Code activated once all dropbox requirements have been checked on all newly dragged/uploaded
     * files on the dropbox. Checks for duplicates in accepted files, updating with most recent version
     * if it exists, and then updating state values for both this component and parent caller.
     *
     * @param {[File Objects]} acceptedFiles - List of files that passed all dropbox requirements
     * @param {[File Objects]} fileRejections - List of files that failed at least one dropbox requirement
     */
    const handleDrop = (acceptedFiles, fileRejections) => {
        let updatedFiles = state.files;

        // update state with accepted files, replacing duplicates with newer version
        for (var i = 0; i < acceptedFiles.length; i++) {
            let file = acceptedFiles[i];
            updatedFiles[file.name] = file;
        }
        // update parent caller with current list of accepted files in dropbox
        props.handleFiles(retrieveOrderedFiles());

        setState({ files: updatedFiles, displayError: fileRejections.length > 0 ? true : false });
    };

    /**
     * Custom filename validator for dropped files in dropbox, checks that filename matches
     * expected naming schema defined at top of file using regex matching.
     *
     * @param {File Object} file - File object whose filename will be validated
     * @returns {JSON} - Returns null if complete match, else JSON object with error message
     */
    function validNamingSchema(file) {
        // attempts to match filename with expected regex
        let match = file.name.match(FILE_NAMING_REGEX);

        try {
            // filename is complete match
            if (match[0] === file.name && match[0].length === file.name.length) {
                return null;
            }
            // filename contains partial match
            else {
                return {
                    code: "invalid-naming-schema",
                    message: `Invalid Filename`,
                };
            }
            // filename contains no match
        } catch (err) {
            return {
                code: "invalid-naming-schema",
                message: `Invalid Filename`,
            };
        }
    }

    /**
     * Utilizes all accepted files in hook's state, and yields an array of files in natural sort.
     *
     * @returns {[File Objects]} - File objects naturally sorted by filename
     */
    function retrieveOrderedFiles() {
        let files = state.files;

        // retrieve all file objects (values in dictionary)
        let currFiles = Object.keys(files).map(function (key) {
            return files[key];
        });

        // sort file objects using natural sort on filenames
        currFiles.sort(function compare(file1, file2) {
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

            return naturalCompare(file1.name, file2.name);
        });

        return currFiles;
    }

    /**
     * Deletes file object from state's dictionary. Makes a call
     * to parent caller to inform of changed state.
     *
     * @param {Object} e - Reference to calling object
     */
    function onDeleteFile(e) {
        delete state.files[e.target.parentElement.id];
        props.handleFiles(retrieveOrderedFiles());
    }

    /**
     * Given a numerical amount of bytes, represents it in terms of its
     * most appropriate unit conversion in memory.
     *
     * @param {Number} bytes - Numerical value denoting number of bytes
     * @returns {string} - Closest byte conversion with units
     */
    function convertFileSizeFormat(bytes) {
        // available unit values, ascending
        const units = ["B", "KB", "MB", "GB", "TB"];

        // determines best available unit and its conversion value
        for (var i = 0; i < units.length; i++) {
            if (bytes >= 1024) {
                bytes /= 1024;
            } else {
                break;
            }
        }
        // string representation
        return `${Number(bytes).toFixed(0)}${units[i]}`;
    }

    /**
     * Given a file object, create a URL representation of its location in memory
     * so it can be rendered on the user's local browser.
     *
     * @param {File Object} file - File object to preview
     * @returns {string} - Temporary URL link to local file object
     */
    function onPreviewImage(file) {
        var urlLink = URL.createObjectURL(file);
        return urlLink;
    }

    return (
        <Dropzone
            onDrop={handleDrop}
            accept="image/*"
            minSize={1024}
            maxSize={3072000}
            validator={validNamingSchema}
        >
            {({ getRootProps, getInputProps, isDragActive, fileRejections }) => (
                <div className={`dropzone ${isDragActive ? "active-dropzone" : null}`}>
                    {/* Drop Zone  */}
                    <section {...getRootProps({})}>
                        <span>{isDragActive ? "📂" : "📁"}</span>
                        <input {...getInputProps()} />
                        <p>Drag'n'drop images, or click here to select files</p>
                    </section>
                    {/* Accepted Files - Conditional Rendering */}
                    <section
                        style={{ display: Object.keys(state.files).length > 0 ? null : "none" }}
                    >
                        <strong> Uploaded Files ({Object.keys(state.files).length}):</strong>
                        <ul className="files-container">
                            {retrieveOrderedFiles().map((file) => (
                                <li id={`${file.name}`}>
                                    {/* Filename & Size */}
                                    <a
                                        href={onPreviewImage(file)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {`${file.name} (${convertFileSizeFormat(file.size)})`}
                                    </a>
                                    {/* Delete Button */}
                                    <span class="delete-button" onClick={onDeleteFile}>
                                        &times;
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                    {/* Error Message (if needed) */}
                    <Snackbar
                        open={state.displayError}
                        autoHideDuration={6000}
                        onClose={handleSnackClose}
                        message={`${fileRejections.length} file${
                            fileRejections.length > 1 ? "s" : ""
                        } could not be uploaded`}
                    />
                </div>
            )}
        </Dropzone>
    );
}
