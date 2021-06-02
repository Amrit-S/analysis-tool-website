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

    // track which subsection to display, default Individual
    const [showSection, setShowSection] = React.useState(Sections.TIPS); // default is analysis tips
    const [inputPageData, setInputPageData] = React.useState({
        inputFileJSONs: [],
        analysisData: {
            cnn: [],
            segmentation: [],
        },
        individualOptions: [],
        groupOptions: [],
    });

    function handleInsufficientDataError() {
        history.push(SITE_PAGES.ANALYSIS_INPUT);
    }

    // rerender page to display newly chosen section
    function showDifferentSection(updatedSection) {
        setShowSection(updatedSection);
    }

    function determineDisplayedSection() {
        let displayedSections = [];

        try {
            const state = history.location.state;
            if (state.individualOptions.length > 0) displayedSections.push(Sections.INDIVUDAL);
            if (state.groupOptions.length > 0) displayedSections.push(Sections.GROUP);
        } catch (e) {
            handleInsufficientDataError();
        }
        return displayedSections;
    }

    useEffect(() => {
        // parse location object to see if data has been given
        try {
            const state = history.location.state;
            setInputPageData({
                inputFileJSONs: state.inputFileJsons,
                analysisData: {
                    cnn: state.cnnPredictions,
                    segmentation: state.segmentationPredictions,
                },
                individualOptions: state.individualOptions,
                groupOptions: state.groupOptions,
            });

            setShowSection(determineDisplayedSection()[0]);

            window.scrollTo(0, 0);
        } catch (err) {
            handleInsufficientDataError();
        }

        // clear loaded values so refreshes/redirects start anew
        // history.replace("/analysis-results", null);
    }, []);

    switch (showSection) {
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
