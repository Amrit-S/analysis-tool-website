/**
 * Renders one row of the individual results page. Conditionally displays cell images,
 * CNN prediciton, and various segmentation statistics.
 *
 * @summary     Renders a single row on the individual results page.
 */

import React from "react";

import { str2ab, arrayBufferToBase64 } from "../../../util/Img_Conversion";
import { AiOutlineDownload } from "react-icons/ai/";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import { saveAs } from "file-saver";
import config from "../config";
import "../css/IndividualResultRow.css";

const BACKEND_URI = config.backend.uri;

export default function IndividualResultRow(props) {
    const useStyles = makeStyles((theme) => ({
        button: {
            "& .MuiButton-root": {
                margin: theme.spacing(3),
                color: "white",
                background: "#004970",
                padding: "10px 5px",
                fontSize: "20px",
                border: "1px solid black",
            },
        },
    }));

    const classes = useStyles();

    // use to set number formatting in segmentation data table
    function cleanNum(val) {
        return val.toFixed(2);
    }

    let numCells = props.stats
        ? (props.stats.size || props.stats.shape || props.stats.pointiness).totalCells
        : null;

    // handle CNN-only raw image
    let normal_img = props.stats ? props.img_norm : arrayBufferToBase64(str2ab(props.img_norm));

    async function download() {
        const res = {
            data: {
                stats: {
                    size: props.stats.size.data,
                    shape: props.stats.shape.data,
                    pointiness: props.stats.pointiness.data,
                },
                totalCells: numCells,
            },
        };

        return await fetch(`${BACKEND_URI}/segmentation/download`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            responseType: "text/csv",
            body: JSON.stringify(res),
        }).then(async (res) => {
            // successful response
            if (res.status === 200) {
                // get csv file, and make it browser readable
                var data = new Blob([await res.blob()], { type: "text/csv" });
                var csvURL = window.URL.createObjectURL(data);
                // auto-download it on browser
                startDownload(csvURL, props.title + ".csv");

                // short wait and then download image too
                await new Promise((r) => setTimeout(r, 100));
                saveAs("data:image/jpeg;base64," + props.img_seg, `segmented_${props.title}`);
            }
        });
    }

    function startDownload(blob, filename) {
        var a = document.createElement("a");
        a.download = filename;
        a.href = blob;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    return (
        <>
            {/* Title */}
            <div className={!props.greyTitle ? "Title-AlignRight" : null}>
                <p className={`Filename ${props.greyTitle ? "Grey-Title" : "Blue-Title"}`}>
                    {" "}
                    {props.title}{" "}
                </p>
            </div>

            {/* Content */}
            <section className="Content">
                {/* Left - Images  */}
                <section className="Cell-Images">
                    <section class="Image-Pair">
                        <img
                            class="Cell-Image"
                            src={"data:image/jpeg;base64," + normal_img}
                            alt="Cells"
                        ></img>
                        <p class="Cell-Image-Text">Original</p>
                    </section>
                    {props.stats ? (
                        <section class="Image-Pair">
                            <img
                                class="Cell-Image"
                                src={"data:image/jpeg;base64," + props.img_seg}
                                alt="Segmented Cells"
                            ></img>
                            <p class="Cell-Image-Text">Cell Segmentation</p>
                            <p class="Cell-Image-Text">({numCells} cells detected)</p>
                        </section>
                    ) : null}
                </section>

                {/* Right - Analysis Information  */}
                <section className="Info">
                    {/* CNN Prediction */}
                    {props.options.pred ? (
                        <section className="Pred">
                            <p className="Info-Label"> CNN Prediction </p>
                            <p className="CNN-Pred-Val">
                                {" "}
                                {(props.pred[1] * 100).toFixed(1)}% Reject{" "}
                            </p>
                        </section>
                    ) : null}

                    {/* Segmentation Stats */}
                    {props.stats ? <p className="Info-Label"> Segmentation </p> : null}

                    {/* Table */}
                    {props.stats ? (
                        <table className="Table">
                            <tr>
                                <th></th>
                                <th>Min</th>
                                <th>Max</th>
                                <th>Med.</th>
                                <th>Mean</th>
                                <th>STD</th>
                            </tr>
                            {props.options.size ? (
                                <tr>
                                    <th>Cell Size</th>
                                    <td>{cleanNum(props.stats.size.min)}</td>
                                    <td>{cleanNum(props.stats.size.max)}</td>
                                    <td>{cleanNum(props.stats.size.median)}</td>
                                    <td>{cleanNum(props.stats.size.mean)}</td>
                                    <td>{cleanNum(props.stats.size.std)}</td>
                                </tr>
                            ) : null}
                            {props.options.shape ? (
                                <tr>
                                    <th>Cell Sides</th>
                                    <td>{cleanNum(props.stats.shape.min)}</td>
                                    <td>{cleanNum(props.stats.shape.max)}</td>
                                    <td>{cleanNum(props.stats.shape.median)}</td>
                                    <td>{cleanNum(props.stats.shape.mean)}</td>
                                    <td>{cleanNum(props.stats.shape.std)}</td>
                                </tr>
                            ) : null}
                            {props.options.pointiness ? (
                                <tr>
                                    <th>Cell Pointiness</th>
                                    <td>{cleanNum(props.stats.pointiness.min)}</td>
                                    <td>{cleanNum(props.stats.pointiness.max)}</td>
                                    <td>{cleanNum(props.stats.pointiness.median)}</td>
                                    <td>{cleanNum(props.stats.pointiness.mean)}</td>
                                    <td>{cleanNum(props.stats.pointiness.std)}</td>
                                </tr>
                            ) : null}
                        </table>
                    ) : null}

                    {props.stats ? (
                        <div className={`${classes.button}`}>
                            <Tooltip title="Download Segmentation Data" arrow>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    onClick={download}
                                >
                                    <AiOutlineDownload />
                                </Button>
                            </Tooltip>
                        </div>
                    ) : null}
                </section>
            </section>
        </>
    );
}
