import React from "react";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import Promise from "bluebird";
import JsZip from "jszip";
import FileSaver from "file-saver";

import IndividualResultRow from "./IndividualResultRow";
import IndividualResultRowCNN from "./IndividualResultRowCNN";
import { ANALYSIS_OPTIONS } from "../../../constants/analysisOptions";
import { AiOutlineDownload } from "react-icons/ai/";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import config from "../config";
import "../css/IndividualResults.css";

const BACKEND_URI = config.backend.uri;

export default function IndividualResults(props) {
    const useStyles = makeStyles((theme) => ({
        button: {
            "& .MuiButton-root": {
                marginRight: "30px",
                color: "white",
                background: "#004970",
                padding: "10px 40px",
                border: "1px solid black",
            },
        },
    }));

    const classes = useStyles();

    // shorthand for seg & cnn data
    let seg = props.inputPageData.analysisData.segmentation;
    let cnn = props.inputPageData.analysisData.cnn;
    seg = Object.entries(seg).length === 0 ? null : seg;

    function getOptions() {
        let opt = props.inputPageData.individualOptions;

        let options = {
            pred: opt.includes(ANALYSIS_OPTIONS.INDIVIDUAL_CNN),
            size: opt.includes(ANALYSIS_OPTIONS.INDIVIDUAL_SEG_SIZE),
            shape: opt.includes(ANALYSIS_OPTIONS.INDIVIDUAL_SEG_SHAPE),
            pointiness: opt.includes(ANALYSIS_OPTIONS.INDIVIDUAL_SEG_POINTINESS),
        };
        return options;
    }

    let downloadExt = ".csv";
    let downloadFileName = "Segmentation_Data.zip";

    async function downloadAll() {
        // collect csv backend calls for all images
        let downloadCalls = [];
        let images = [];
        for (const element in seg) {
            if (Object.hasOwnProperty.call(seg, element)) {
                const image = seg[element];
                images.push("data:image/jpeg;base64," + image.segmented_img);
                const res = {
                    data: {
                        stats: {
                            size: image.stats.size.data,
                            shape: image.stats.shape.data,
                            pointiness: image.stats.pointiness.data,
                        },
                        totalCells: image.stats.size.totalCells,
                    },
                };

                downloadCalls.push(
                    fetch(`${BACKEND_URI}/segmentation/download`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        responseType: "text/csv",
                        body: JSON.stringify(res),
                    })
                );
            }
        }

        // create downloadable URL for each returned csv
        const results = await Promise.all(downloadCalls);
        let urls = [];
        for (const element in results) {
            if (Object.hasOwnProperty.call(results, element)) {
                const res = results[element];
                // successful response
                if (res.status === 200) {
                    // get csv file, and make it browser readable
                    var data = new Blob([await res.blob()], { type: "text/csv" });
                    var csvURL = window.URL.createObjectURL(data);
                    urls.push(csvURL);
                }
            }
        }

        downloadAndZip(urls, urls.length);

        // short wait and then download images too
        await new Promise((r) => setTimeout(r, 100));
        downloadExt = "";
        downloadFileName = "Segmentation_Images.zip";
        downloadAndZip(images, images.length);
    }

    // the following functions enable zipping multiple files and downloading the zip
    // (source: https://huynvk.dev/blog/download-files-and-zip-them-in-your-browsers-using-javascript)

    const download = (url) => {
        return fetch(url).then((resp) => resp.blob());
    };

    const downloadByGroup = (urls, files_per_group = 5) => {
        return Promise.map(
            urls,
            async (url) => {
                return await download(url);
            },
            { concurrency: files_per_group }
        );
    };

    const exportZip = (blobs) => {
        const zip = JsZip();
        blobs.forEach((blob, i) => {
            zip.file(props.inputPageData.inputFileJSONs[i].name + downloadExt, blob);
        });
        zip.generateAsync({ type: "blob" }).then((zipFile) => {
            return FileSaver.saveAs(zipFile, downloadFileName);
        });
    };

    const downloadAndZip = (urls, num) => {
        return downloadByGroup(urls, num).then(exportZip);
    };

    return (
        <>
            <p style={{ textAlign: "center", padding: "10px" }}>
                <BsFillExclamationDiamondFill style={{ fontSize: "16px", color: "#004970" }} />
                See <span style={{ color: "#004970" }}> Analysis Tips </span> section to get insight
                on how to better interpret these results.
                <BsFillExclamationDiamondFill style={{ fontSize: "16px", color: "#004970" }} />
                {seg ? (
                    <div className={`${classes.button} download-all-button`}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<AiOutlineDownload />}
                            onClick={downloadAll}
                        >
                            Download All
                        </Button>
                    </div>
                ) : null}
            </p>
            {seg ? (
                props.inputPageData.inputFileJSONs.map((data, i) => {
                    return (
                        <IndividualResultRow
                            title={data.name}
                            greyTitle={i % 2 === 0}
                            stats={seg ? seg[i].stats : null}
                            pred={cnn[i]}
                            img_norm={seg ? seg[i].raw_img : data.buffer}
                            img_seg={seg ? seg[i].segmented_img : null}
                            options={getOptions()}
                        />
                    );
                })
            ) : (
                <div className="CNN">
                    <h2> CNN Predictions </h2>
                    <div className="CNN-Grid">
                        {props.inputPageData.inputFileJSONs.map((data, i) => {
                            return (
                                <IndividualResultRowCNN
                                    title={data.name}
                                    pred={cnn[i]}
                                    img={data.buffer}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}
