/**
 * Renders the results page (second page) for the Analysis Tool, allowing the user to view the server results
 * for all the options they chosen to analyze their uploaded images on. The page itself is divided into sections, depending
 * on which group of results they wish to view, and visually is partitioned into a mini navigation bar to allow 
 * for easy switching between results. The results themselves exist as sub-pages, with their own rendering components. 
 * 
 * This page has multiple dependenices: ResultsNavBar, IndiviudalResults, Group Results, and Analysis Tips.  
 *
 * @summary User input/preferences page for Analysis Tool.
 * @author Amrit Kaur Singh
 */

import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import ResultsNavBar from "../components/AnalysisResults/ResultsNavBar";
import IndividualResults from "../components/AnalysisResults/Individual/IndividualResults";
import GroupResults from "../components/AnalysisResults/Group/GroupResults";
import AnalysisTips from "../components/AnalysisResults/AnalysisTips";

import { Sections } from "../constants/resultsSections";
import { SITE_PAGES } from "../constants/links";

export default function AnalysisResults() {
    const history = useHistory();

    // track which subsection to display, default Analysis Tips
    const [showSection, setShowSection] = React.useState(Sections.TIPS); 
    // track all data received from server 
    const [inputPageData, setInputPageData] = React.useState({
        inputFileJSONs: [],
        analysisData: {
            cnn: [],
            segmentation: [],
        },
        individualOptions: [],
        groupOptions: [],
    });

    // any missing data causes a redirect to first page of analysis tool
    function handleInsufficientDataError() {
        history.push(SITE_PAGES.ANALYSIS_INPUT);
    }

    // rerender page to display newly chosen section
    function showDifferentSection(updatedSection) {
        setShowSection(updatedSection);
    }

    // determines which sections that mini-navbar must display, dependent on whether the user wanted individaul, group, or
    // results from both 
    function determineDisplayedSection() {
        let displayedSections = [];

        try {
            const state = history.location.state;
            // individual section exists if at least on option under individual was chosen
            if (state.individualOptions.length > 0) displayedSections.push(Sections.INDIVUDAL);
            // group section exists if at least on option under group was chosen
            if (state.groupOptions.length > 0) displayedSections.push(Sections.GROUP);
        } catch (e) {
            handleInsufficientDataError();
        }
        return displayedSections;
    }

    // occurs one time at the initial page rendering
    useEffect(() => {
        // parse location object to see if data has been given
        try {
            const state = history.location.state;

            // set data received as state variables
            setInputPageData({
                inputFileJSONs: state.inputFileJsons,
                analysisData: {
                    cnn: state.cnnPredictions,
                    segmentation: state.segmentationPredictions,
                },
                individualOptions: state.individualOptions,
                groupOptions: state.groupOptions,
            });

            // update sections displayed on mini-navbar based on received data
            setShowSection(determineDisplayedSection()[0]);

            window.scrollTo(0, 0);

        } catch (err) {
            handleInsufficientDataError();
        }

    }, []);

    // display the results of a particular section
    switch (showSection) {
        // Individual Results
        case Sections.INDIVUDAL:
            return (
                <div>
                    <ResultsNavBar
                        renderCallback={showDifferentSection}
                        sectionsToDisplay={determineDisplayedSection()}
                    />
                    <IndividualResults inputPageData={inputPageData} />
                </div>
            );
        // Group Results 
        case Sections.GROUP:
            return (
                <div>
                    <ResultsNavBar
                        renderCallback={showDifferentSection}
                        sectionsToDisplay={determineDisplayedSection()}
                    />
                    <GroupResults inputPageData={inputPageData} />
                </div>
            );
        // Analysis Tips
        case Sections.TIPS:
            return (
                <div>
                    <ResultsNavBar
                        renderCallback={showDifferentSection}
                        sectionsToDisplay={determineDisplayedSection()}
                    />
                    <AnalysisTips />
                </div>
            );
        default:
            return (
                <div>
                    <ResultsNavBar
                        renderCallback={showDifferentSection}
                        sectionsToDisplay={determineDisplayedSection()}
                    />
                </div>
            );
    }
}
