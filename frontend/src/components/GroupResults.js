/**
 * Renders all group results asked for by the user on the results page.
 */
import React from "react";
import GraphComponent from "../components/GraphComponent";
import { ANALYSIS_OPTIONS } from "../constants/analysisOptions";
import { getMovingAverage } from "../util/Stats";
import { BsFillExclamationDiamondFill } from "react-icons/bs";

export default function GroupResults(props) {
    function getDataForOption(opt) {
        let graphOptions = {
            data: [],
            maxValue: null,
            yAxisLabel: null,
        };

        switch (opt) {
            case ANALYSIS_OPTIONS.GROUP_CNN:
                graphOptions["maxValue"] = 100;
                graphOptions["yAxisLabel"] = "% Reject Prediction";
                graphOptions["data"] = props.inputPageData.analysisData.cnn.map((pred) => {
                    const normalP = parseFloat(pred["1"]) * 100;
                    return normalP;
                });

                return graphOptions;

            // Cell Size
            case ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MEAN:
                graphOptions["maxValue"] = 3500;
                graphOptions["yAxisLabel"] = "Avg. Cell Size (pixels)";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.size.mean).toFixed(2));
                    }
                );

                return graphOptions;

            case ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MEDIAN:
                graphOptions["maxValue"] = 3500;
                graphOptions["yAxisLabel"] = "Avg. Cell Size (pixels)";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.size.median).toFixed(2));
                    }
                );

                return graphOptions;

            case ANALYSIS_OPTIONS.GROUP_SEG_SIZE_STD:
                graphOptions["maxValue"] = 1000;
                graphOptions["yAxisLabel"] = "Avg. Cell Size (pixels)";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.size.std).toFixed(2));
                    }
                );

                return graphOptions;

            case ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MIN:
                graphOptions["maxValue"] = 3500;
                graphOptions["yAxisLabel"] = "Avg. Cell Size (pixels)";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.size.min).toFixed(2));
                    }
                );

                return graphOptions;

            case ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MAX:
                graphOptions["maxValue"] = 3500;
                graphOptions["yAxisLabel"] = "Avg. Cell Size (pixels)";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.size.max).toFixed(2));
                    }
                );

                return graphOptions;

            // Cell Shape
            case ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MEAN:
                graphOptions["maxValue"] = 10;
                graphOptions["yAxisLabel"] = "Avg. Number of Sides Per Cell";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.shape.mean).toFixed(2));
                    }
                );

                return graphOptions;

            case ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MEDIAN:
                graphOptions["maxValue"] = 10;
                graphOptions["yAxisLabel"] = "Avg. Number of Sides Per Cell";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.shape.median).toFixed(2));
                    }
                );

                return graphOptions;

            case ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_STD:
                graphOptions["maxValue"] = 5;
                graphOptions["yAxisLabel"] = "Avg. Number of Sides Per Cell";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.shape.std).toFixed(2));
                    }
                );

                return graphOptions;

            case ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MIN:
                graphOptions["maxValue"] = 10;
                graphOptions["yAxisLabel"] = "Avg. Number of Sides Per Cell";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.shape.min).toFixed(2));
                    }
                );

                return graphOptions;

            case ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MAX:
                graphOptions["maxValue"] = 10;
                graphOptions["yAxisLabel"] = "Avg. Number of Sides Per Cell";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.shape.max).toFixed(2));
                    }
                );

                return graphOptions;

            // Cell Pointiness
            case ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MEAN:
                graphOptions["maxValue"] = 1;
                graphOptions["yAxisLabel"] = "Avg. Cell Pointiness Ratio";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.pointiness.mean).toFixed(2));
                    }
                );

                return graphOptions;

            case ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MEDIAN:
                graphOptions["maxValue"] = 1;
                graphOptions["yAxisLabel"] = "Avg. Cell Pointiness Ratio";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.pointiness.median).toFixed(2));
                    }
                );

                return graphOptions;

            case ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_STD:
                graphOptions["maxValue"] = 3;
                graphOptions["yAxisLabel"] = "Avg. Cell Pointiness Ratio";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.pointiness.std).toFixed(2));
                    }
                );

                return graphOptions;

            case ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MIN:
                graphOptions["maxValue"] = 1;
                graphOptions["yAxisLabel"] = "Avg. Cell Pointiness Ratio";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.pointiness.min).toFixed(2));
                    }
                );

                return graphOptions;

            case ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MAX:
                graphOptions["maxValue"] = 1;
                graphOptions["yAxisLabel"] = "Avg. Cell Pointiness Ratio";
                graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(
                    (entry) => {
                        return Number(parseFloat(entry.stats.pointiness.max).toFixed(2));
                    }
                );

                return graphOptions;

            default:
                return graphOptions;
        }
    }

    function getLabels() {
        return props.inputPageData.inputFileJSONs.map((file) => {
            return parseFloat(file.name.substr(0, file.name.lastIndexOf(".")));
        });
    }

    return (
        <>
            <p style={{ textAlign: "center", padding: "10px" }}>
                <BsFillExclamationDiamondFill style={{ fontSize: "16px", color: "#004970" }} />
                See <span style={{ color: "#004970" }}> Analysis Tips </span> section to get insight
                on how to better interpret these graphs.
                <BsFillExclamationDiamondFill style={{ fontSize: "16px", color: "#004970" }} />
            </p>
            {props.inputPageData.groupOptions.map((option, i) => {
                const graphOptions = getDataForOption(option);

                return (
                    <GraphComponent
                        title={option}
                        greyTitle={i % 2 === 0}
                        data={graphOptions.data}
                        movAvgData={getMovingAverage(graphOptions.data)}
                        labels={getLabels()}
                        options={graphOptions}
                        showCNNBaseline={option === ANALYSIS_OPTIONS.GROUP_CNN}
                    />
                );
            })}
        </>
    );
}
