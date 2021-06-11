/**
 * Used instead of IndividualResultRow when only CNN is selected. Displays
 * image name, image, and prediction percent.
 *
 * Called by IndividualResults.js
 *
 * @summary Renders cnn info on the individual results page.
 * @author Levente Horvath
 */

import React from "react";

import { str2ab, arrayBufferToBase64 } from "../../../util/Img_Conversion";
import "../../../css/IndividualResultRowCNN.css";

export default function IndividualResultRowCNN(props) {
    // handle CNN-only raw image
    let img = arrayBufferToBase64(str2ab(props.img));

    return (
        <>
            {/* Content */}
            <section className="CNN-Content">
                {/* Title */}
                <p className={`Filename ${"Blue-Title"}`}> {props.title} </p>

                {/* Image  */}
                <img class="CNN-Image" src={"data:image/jpeg;base64," + img} alt="Cells"></img>

                {/* Prediction  */}
                <p className="CNN-Pred"> {(props.pred[1] * 100).toFixed(1)}% Reject </p>
            </section>
        </>
    );
}
