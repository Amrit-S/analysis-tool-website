import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";

import ResultsNavBar from '../components/ResultsNavBar';
import IndividualResults from '../components/IndividualResults';
import GroupResults from '../components/GroupResults';
import AnalysisTips from '../components/AnalysisTips';

import {Sections} from "../constants/resultsSections";

export default function AnalysisResults() {

  const history = useHistory();

      // track which subsection to display, default Individual 
      const[ showSection, setShowSection] = React.useState(Sections.INDIVUDAL); // true = Individual, false = Group
      const [inputPageData, setInputPageData] = React.useState({
        inputFileJSONs: [],
        analysisData: {
          cnn: [],
          segmentation: []
        },
        individualOptions: [],
        groupOptions: []
      })

      // rerender page to display newly chosen section
      function showDifferentSection(updatedSection){
        setShowSection(updatedSection);
      }

  
        useEffect(() => {
          // parse location object to see if data has been given 
          try {
            const state = history.location.state;
            setInputPageData({
              inputFileJSONs: state.inputFileJsons,
              analysisData: {
                cnn: state.cnnPredictions,
                segmentation: state.segmentationPredictions
              },
              individualOptions: state.individualOptions,
              groupOptions: state.groupOptions
            });
          
          } catch (err) {
              return;
          }

          // clear loaded values so refreshes/redirects start anew
         // history.replace("/analysis-results", null);

        }, []);

      switch(showSection){
        case Sections.INDIVUDAL:
          return(
            <div>
                  <ResultsNavBar renderCallback={showDifferentSection}/>
                  <IndividualResults inputPageData={inputPageData}/>
            </div>
          );
        case Sections.GROUP:
          return(
            <div>
                  <ResultsNavBar renderCallback={showDifferentSection}/>
                  <GroupResults inputPageData={inputPageData}/>
            </div>
          )
        case Sections.TIPS:
          return(
            <div>
                  <ResultsNavBar renderCallback={showDifferentSection}/>
                  <AnalysisTips/>
            </div>
          )
      }
  }