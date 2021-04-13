import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ResultsNavBar from '../components/ResultsNavBar';
import IndividualResults from '../components/IndividualResults';
import GroupResults from '../components/GroupResults';
const config = require('../config');

//const BACKEND_URL = config.backend.uri;

export default function AnalysisResults() {

  const history = useHistory();

      // track which subsection to display, default Individual 
      const[ showIndividual, setShowIndividual] = React.useState(true); // true = Individual, false = Group
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
      function showDifferentSection(showIndividualSection){
        setShowIndividual(showIndividualSection);
      }

        // on load of screen, default filter button highlighted
        useEffect(() => {
          // parse location object to see if cart must be toggled upon render
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
            // alert(inputPageData);
          } catch (err) {
              return;
          }

          // clear loaded values so refreshes/redirects start anew
         // history.replace("/analysis-results", null);

        }, []);

      return (

          <div>
              <NavBar/>
               <ResultsNavBar renderCallback={showDifferentSection}/>
               {
                 showIndividual ?
                 <IndividualResults inputPageData={inputPageData}/>
                 :
                 <GroupResults inputPageData={inputPageData}/>
               }
              <Footer/>
          </div>

      )
  }