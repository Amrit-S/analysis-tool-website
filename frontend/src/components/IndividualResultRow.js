/**
 * Renders one row of the individual results page. Conditionally displays cell images,
 * CNN prediciton, and various segmentation statistics.
 * 
 * @summary     Renders a single row on the individual results page. 
 */

import React from 'react';
 
import '../css/IndividualResultRow.css';
 
export default function IndividualResultRow(props) {

    // use to set number formatting in segmentation data table
    function cleanNum(val) {
        return val.toFixed(2);
    }

    let numCells = props.stats
        ? (props.stats.size || props.stats.shape || props.stats.pointiness).totalCells
        : null;
 
    return (

        <>
            {/* Title */}
            <div className={!props.greyTitle ? "Title-AlignRight":null}>
                <p className={`Title ${props.greyTitle ? "Grey-Title": "Blue-Title"}`}> {props.title} </p>
            </div>

            {/* Content */}
            <section className="Content">

                {/* Left - Images  */}
                {props.stats ?
                    <section className="Cell-Images">
                        <section class="Image-Pair">
                            <img class="Cell-Image"
                                src={"data:image/jpeg;base64," + props.img_norm}
                                alt="Cells">
                            </img>
                            <p class="Cell-Image-Text">Original</p>
                        </section>
                        <section class="Image-Pair">
                            <img class="Cell-Image"
                                src={"data:image/jpeg;base64," + props.img_seg}
                                alt="Segmented Cells">
                            </img>
                            <p class="Cell-Image-Text">Cell Segmentation</p>
                            <p class="Cell-Image-Text">({numCells} cells detected)</p>
                        </section>
                    </section>
                :null}

                {/* Right - Analysis Information  */}
                <section className="Info">
                    {/* CNN Prediction */}
                    {props.options.pred ?
                        <section className="Pred">
                            <p className="Info-Label"> CNN Prediction </p>
                            <p className="CNN-Pred-Val"> {(props.pred[0]* 100).toFixed(1)}% Normal </p>
                        </section>
                    :null}

                    {/* Segmentation Stats */}
                    {props.stats ?
                        <p className="Info-Label"> Segmentation </p>
                    :null}

                    {/* Table */}
                    {props.stats ?
                        <table className="Stats-Table">
                            <tr>
                                <th></th>
                                <th>Min</th>
                                <th>Max</th>
                                <th>Med.</th>
                                <th>Mean</th>
                                <th>STD</th>
                            </tr>
                            {props.options.size ?
                                <tr>
                                    <th>Cell Size</th>
                                    <td>{cleanNum(props.stats.size.min)}</td>
                                    <td>{cleanNum(props.stats.size.max)}</td>
                                    <td>{cleanNum(props.stats.size.median)}</td>
                                    <td>{cleanNum(props.stats.size.mean)}</td>
                                    <td>{cleanNum(props.stats.size.std)}</td>
                                </tr>
                            :null}
                            {props.options.shape ?
                                <tr>
                                    <th>Cell Sides</th>
                                    <td>{cleanNum(props.stats.shape.min)}</td>
                                    <td>{cleanNum(props.stats.shape.max)}</td>
                                    <td>{cleanNum(props.stats.shape.median)}</td>
                                    <td>{cleanNum(props.stats.shape.mean)}</td>
                                    <td>{cleanNum(props.stats.shape.std)}</td>
                                </tr>
                            :null}
                            {props.options.pointiness ?
                                <tr>
                                    <th>Cell Pointiness</th>
                                    <td>{cleanNum(props.stats.pointiness.min)}</td>
                                    <td>{cleanNum(props.stats.pointiness.max)}</td>
                                    <td>{cleanNum(props.stats.pointiness.median)}</td>
                                    <td>{cleanNum(props.stats.pointiness.mean)}</td>
                                    <td>{cleanNum(props.stats.pointiness.std)}</td>
                                </tr>
                            :null}
                        </table>
                    :null}
                </section>
            </section>
        </>

    )
}