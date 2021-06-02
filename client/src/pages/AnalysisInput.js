import React, { useCallback } from "react";

import InputInstructions from "../components/AnalysisInput/InputInstructions";
import DropBox from "../components/AnalysisInput/DropBox";
import CustomizeSettingsDropDown from "../components/AnalysisInput/CustomizeSettingsDropDown";
import LoadingScreen from "../components/AnalysisInput/LoadingScreen";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { IoMdAnalytics } from "react-icons/io";
import { useHistory } from "react-router-dom";
import { ANALYSIS_OPTIONS } from "../constants/analysisOptions";
import ListSubheader from "@material-ui/core/ListSubheader";
import MenuItem from "@material-ui/core/MenuItem";
import {
    getAllGroupOptions,
    getAllIndividualOptions,
    handleCNNPredictionsFetchCall,
    handleSegmentationFetchCall,
    determineCustomizations,
    prepareFiles,
} from "../util/AnalysisInputFunctions";

import "../css/AnalysisInput.css";

export default function AnalysisInput() {
    const useStyles = makeStyles((theme) => ({
        button: {
            "& .MuiButton-root": {
                margin: theme.spacing(3),
                color: "black",
                background: "#DABA11",
                padding: "10px 40px",
                fontSize: "16px",
                border: "1px solid black",
            },
        },
    }));

    const classes = useStyles();
    const history = useHistory();

    const [files, setFiles] = React.useState([]);
    const [individualAnalysis, setIndividualAnalysis] = React.useState({
        options: [],
        checkbox: false,
    });

    const [groupAnalysis, setGroupAnalysis] = React.useState({
        options: [],
        checkbox: false,
    });

    const [error, setError] = React.useState({
        display: false,
        message: "",
    });

    const [formDisabled, setFormDisabled] = React.useState(false);
    const [progressBar, setProgressBar] = React.useState({
        show: false,
        progress: 0,
        title: "Parsing Image Files",
    });

    /**
     * Allows the state atribute inputFiles to be updated to reflect changes made in the DropBox component.
     */
    const setFilesCallback = useCallback(
        (files) => {
            setFiles(files);
        },
        [] // Tells React to memoize regardless of arguments.
    );

    const setIndividualAnalysisCallback = useCallback(
        (options, checkbox) => {
            setIndividualAnalysis({ options: options, checkbox: checkbox });
        },
        [] // Tells React to memoize regardless of arguments.
    );

    const setGroupAnalysisCallback = useCallback(
        (options, checkbox) => {
            setGroupAnalysis({ options: options, checkbox: checkbox });
        },
        [] // Tells React to memoize regardless of arguments.
    );

    const closeProgressBar = () => {
        setProgressBar(false);
    };

    function handleButtonClick() {
        // disable submit button
        setFormDisabled(true);

        // parse inputs for any errors
        let errorMessage = "";

        // no image files uploaded
        if (files.length < 1) {
            errorMessage += "At least one image file must be uploaded.\n";
        }
        // nothing selected for individual
        if (!individualAnalysis.checkbox && individualAnalysis.options.length < 1) {
            errorMessage += "A valid option must be chosen for Individual Analysis.\n";
        }

        // nothing selected for group
        if (!groupAnalysis.checkbox && groupAnalysis.options.length < 1) {
            errorMessage += "A valid option must be chosen for Group Analysis.\n";
        }

        // neither analysis chosen (both have chekcboxes clicked)
        if (individualAnalysis.checkbox && groupAnalysis.checkbox) {
            errorMessage += "At least one type of analysis must be chosen.\n";
        }

        // early termination on error, with error message
        if (errorMessage !== "") {
            handleError(errorMessage);
            return;
        }

        // no errors, show progress bar
        setError({ display: false });
        setProgressBar({ show: true, title: "Parsing Data..." });

        // prepare input files for backend calls
        prepareFiles(files)
            .then(async (fileJSONS) => {
                try {
                    // update progress bar, and filter through chosen options
                    setProgressBar({ show: true, title: "Analyzing Data..." });
                    const options = determineCustomizations(
                        individualAnalysis.options,
                        groupAnalysis.options
                    );

                    // make appropriate server calls
                    let backendCalls = [null, null];
                    if (options.cnn) {
                        backendCalls[0] = handleCNNPredictionsFetchCall(fileJSONS);
                    }
                    if (options.segmentation) {
                        backendCalls[1] = handleSegmentationFetchCall(fileJSONS, options);
                    }
                    const res = await Promise.all(backendCalls);

                    // server calls have finished, dismiss progress bar
                    setProgressBar({ show: false });
                    setFormDisabled(false);

                    // redirect with results
                    redirectToResultsPage(fileJSONS, res[0], res[1]);
                } catch (err) {
                    handleError(err.message);
                }
            })
            .catch((err) => {
                handleError(err);
            });
    }

    function redirectToResultsPage(inputFileJSONs, cnnPredictions, segmentationPredictions) {
        history.push({
            pathname: "/analysis-results",
            state: {
                inputFileJsons: inputFileJSONs,
                cnnPredictions: cnnPredictions || [],
                segmentationPredictions: segmentationPredictions || [],
                individualOptions: individualAnalysis.options,
                groupOptions: groupAnalysis.options,
            },
        });
    }

    async function handleError(errorMsg) {
        setError({ display: true, message: errorMsg });
        setProgressBar({ show: false });
        setFormDisabled(false);
    }

    return (
        <div>
            <p className="Subsection-Step-Title"> Step #1: Upload Images </p>
            <section className="Step-1-Container">
                <InputInstructions />
                <DropBox handleFiles={setFilesCallback} />
            </section>
            <p className="Subsection-Step-Title"> Step #2: Customize Settings </p>
            <section className="Step-2-Container">
                <CustomizeSettingsDropDown
                    title="Individual Image Analysis"
                    info={"Analysis will be conducted on each individual image seperately."}
                    callback={setIndividualAnalysisCallback}
                    retrieveAllOptions={getAllIndividualOptions}
                >
                    <ListSubheader disableSticky={true}>CNN Model</ListSubheader>
                    <MenuItem value={ANALYSIS_OPTIONS.INDIVIDUAL_CNN}>
                        {ANALYSIS_OPTIONS.INDIVIDUAL_CNN}
                    </MenuItem>
                    <ListSubheader disableSticky={true}>
                        Segmentation - Feature Analysis{" "}
                    </ListSubheader>
                    <MenuItem value={ANALYSIS_OPTIONS.INDIVIDUAL_SEG_SIZE}>
                        {ANALYSIS_OPTIONS.INDIVIDUAL_SEG_SIZE}
                    </MenuItem>
                    <MenuItem value={ANALYSIS_OPTIONS.INDIVIDUAL_SEG_SHAPE}>
                        {ANALYSIS_OPTIONS.INDIVIDUAL_SEG_SHAPE}
                    </MenuItem>
                    <MenuItem value={ANALYSIS_OPTIONS.INDIVIDUAL_SEG_POINTINESS}>
                        {ANALYSIS_OPTIONS.INDIVIDUAL_SEG_POINTINESS}
                    </MenuItem>
                </CustomizeSettingsDropDown>
                <div class="vl"></div>
                <CustomizeSettingsDropDown
                    title="Group Image Analysis"
                    info={
                        "Analysis will be conducted on all images holistically via time series. Recommended for 2+ images."
                    }
                    callback={setGroupAnalysisCallback}
                    retrieveAllOptions={getAllGroupOptions}
                >
                    <ListSubheader disableSticky={true}>CNN Model</ListSubheader>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_CNN}>
                        {ANALYSIS_OPTIONS.GROUP_CNN}
                    </MenuItem>
                    <ListSubheader disableSticky={true}>Segmentation - Cell Size </ListSubheader>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MEAN}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MEAN}
                    </MenuItem>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MEDIAN}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MEDIAN}
                    </MenuItem>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_SIZE_STD}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_SIZE_STD}
                    </MenuItem>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MIN}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MIN}
                    </MenuItem>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MAX}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MAX}
                    </MenuItem>
                    <ListSubheader disableSticky={true}>Segmentation - Cell Shape </ListSubheader>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MEAN}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MEAN}
                    </MenuItem>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MEDIAN}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MEDIAN}
                    </MenuItem>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_STD}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_STD}
                    </MenuItem>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MIN}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MIN}
                    </MenuItem>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MAX}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MAX}
                    </MenuItem>
                    <ListSubheader disableSticky={true}>
                        Segmentation - Cell Pointiness{" "}
                    </ListSubheader>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MEAN}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MEAN}
                    </MenuItem>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MEDIAN}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MEDIAN}
                    </MenuItem>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_STD}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_STD}
                    </MenuItem>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MIN}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MIN}
                    </MenuItem>
                    <MenuItem value={ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MAX}>
                        {ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MAX}
                    </MenuItem>
                </CustomizeSettingsDropDown>
            </section>
            {/* <button onClick={getFiles}>Parent Files</button> */}
            <div className={`${classes.button} Submit-Button`}>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={handleButtonClick}
                    disabled={formDisabled}
                    startIcon={<IoMdAnalytics />}
                >
                    Begin Analysis
                </Button>
            </div>
            <p className="errorText" style={{ display: error.display ? null : "none" }}>
                {" "}
                {error.message}
            </p>
            <LoadingScreen
                open={progressBar.show}
                handleClose={closeProgressBar}
                title={progressBar.title}
            />
        </div>
    );
}
