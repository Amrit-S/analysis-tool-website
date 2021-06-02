/**
 * Renders the user input page (first page) for the Analysis Tool, allowing the user to upload pictures
 * through a Dropbox and then customize their analysis preferences. Once both have been selected, it makes
 * fetch requests to the server and awaits the results, displaying a loading screen to the user while
 * the server is fulfilling the request. Once results have been retrieved, it redirects to the 
 * AnalysisResults page (page 2) so the user can view their results. 
 * 
 * This page has multiple dependenices: DropBox, AnalysisInput, CustomizeSettings, and LoadingScreen.  
 *
 * @summary User input/preferences page for Analysis Tool.
 * @author Amrit Kaur Singh
 */

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

    // customize styles of material ui components
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

    // track all uploaded files
    const [files, setFiles] = React.useState([]);
    // track all options chosen for individual results
    const [individualAnalysis, setIndividualAnalysis] = React.useState({
        options: [],
        checkbox: false,
    });

    // track all options chosen for group results
    const [groupAnalysis, setGroupAnalysis] = React.useState({
        options: [],
        checkbox: false,
    });

    // error message for inconsistencies in form validation 
    const [error, setError] = React.useState({
        display: false,
        message: "",
    });

    // tracks whether form is disabled
    const [formDisabled, setFormDisabled] = React.useState(false);

    // controls loading screen modal 
    const [progressBar, setProgressBar] = React.useState({
        show: false,
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

    // redirects to results page with server results
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

    // handles any error that occur during fetch requests or form validation
    async function handleError(errorMsg) {
        setError({ display: true, message: errorMsg });
        setProgressBar({ show: false });
        setFormDisabled(false);
    }

    return (
        <div>
            <p style={{textAlign: "center"}}> <span style={{fontWeight: "bold"}}>Disclaimer: </span> The intention of the analysis tool is to provide further insight into the DMEK process. It is not meant to be used as a 100% accurate, definitive classification.  </p>
            <p className="Subsection-Step-Title"> Step #1: Upload Images </p>
            <section className="Step-1-Container">
                <InputInstructions />
                <DropBox handleFiles={setFilesCallback} />
            </section>
            <p className="Subsection-Step-Title"> Step #2: Customize Settings </p>
            <section className="Step-2-Container">
                <CustomizeSettingsDropDown
                    title="Individual Image Analysis"
                    info={"Analysis will be conducted on each individual image seperately, with greater informational breakdown given per image and access to more raw data."}
                    callback={setIndividualAnalysisCallback}
                    retrieveAllOptions={getAllIndividualOptions}
                >
                    {/* all options are listed, divided by a custom sub-header */}
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
                        "Analysis will be conducted on all images holistically via time series, with very little breakdown given per image but rather an empahsis on the imags as a collective whole. Recommended for 2+ images."
                    }
                    callback={setGroupAnalysisCallback}
                    retrieveAllOptions={getAllGroupOptions}
                >
                    {/* all options are listed, divided by custom sub-headers */}
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
            {/* Submit Button */}
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
            {/* Displays any form validation/page errors here, below the submit button */}
            <p className="errorText" style={{ display: error.display ? null : "none" }}>
                {" "}
                {error.message}
            </p>
            {/* Loading Screen Modal */}
            <LoadingScreen
                open={progressBar.show}
                handleClose={closeProgressBar}
                title={progressBar.title}
            />
        </div>
    );
}
