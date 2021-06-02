/**
 * File renders the "Analysis Tips" section of the Results page, which contains any insight on how
 * the rest of the data in the other sections should be intrepretted. 
 * 
 * This page has no dependecies. 
 * 
 * @summary Displays "Analysis Tips" section. 
 * @author Amrit Kaur Singh
 */
import React from "react";
import "../../css/AnalysisTips.css";

import { SITE_PAGES } from "../../constants/links";

export default function AnalysisTips(props) {
    return (
        <div className="Results-Analysis-Tips">
            {/* CNN Tips */}
            <h2> CNN </h2>
            <p>
                The Convolutional Neural Network, or CNN, has been trained on a set of endothelial
                images from patients with and without transplant rejections. The model works by
                looking at one provided image at a time and determining whether it looks more like
                one of the reject images or more like one of the normal images it has seen before.
                The result is a percentage value. If this value is above 50%, the model thinks it is
                more like a reject. The higher this value is, the more confident it is in this
                assessment. Values below 50% are more like normal images, and the lower the value is
                the more confident it is in the assessment that it is normal. Factors such as image
                artifacts may influence the outcome, so we recommend providing as many images as
                possible per patient. The group analysis page features graphs with a moving average
                line to help even out any outliers and make it easier to see the general trend.
                {"\n\n"}
                If you would like further information on how the CNN works,{" "}
                <span>
                    <a href={SITE_PAGES.OVERVIEW_CNN} target="_blank" rel="noreferrer noopener">
                        click here
                    </a>{" "}
                </span>
                .
            </p>
            {/* Segmentation Tips */}
            <h2> Segmentation </h2>
            <p>
                The image segmentation data is generated based on the cells in each image that were
                able to be automatically identified by the algorithm. Therefore, be aware that any
                artifacts in the images can influence the cells that are detected and can
                potentially skew the statistics. The values provided include Cell Size (the area, in
                pixels, of the cells), Cell Sides (the number of sides per cell), and Cell
                Pointiness (the ratio between the largest and smallest angle in each cell). This
                data provides a quantitative way to assess changes over time, making it easier to
                determine whether a rejection is developing. Note that the individual results page
                displays a table summarizing the segmentation data. The full data for all cells is
                available for download.
                {"\n\n"}
                If you would like further information on how the segmentation works,{" "}
                <span>
                    <a
                        href={SITE_PAGES.OVERVIEW_SEGMENTATION}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        click here
                    </a>{" "}
                </span>
                .
            </p>
            {/* Moving Average Tips */}
            <h2> Moving Average (Group Analysis) </h2>
            <p>
                Every moving average data point is the average of all time series datapoints that
                occur at that instance as well as before it. To provide an example, let us say there
                is the following time-series: [10, 20, 30]. The corresponding moving average series
                would be [10, (10 + 20)/2, (10 + 20 + 30)/3] = [10, 15, 20].
            </p>
        </div>
    );
}
