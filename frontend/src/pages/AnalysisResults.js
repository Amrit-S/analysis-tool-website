import React from 'react';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ResultsNavBar from '../components/ResultsNavBar';
import IndividualResults from '../components/IndividualResults';
import GroupResults from '../components/GroupResults';
const config = require('../config');

//const BACKEND_URL = config.backend.uri;

export default function AnalysisResults() {

      // track which subsection to display, default Individual 
      const[ showIndividual, setShowIndividual] = React.useState(true); // true = Individual, false = Group

      // rerender page to display newly chosen section
      function showDifferentSection(showIndividualSection){
        setShowIndividual(showIndividualSection);
      }

      return (

          <div>
              <NavBar/>
               <ResultsNavBar renderCallback={showDifferentSection}/>
               {
                 showIndividual ?
                 <IndividualResults/>
                 :
                 <GroupResults/>
               }
              <Footer/>
          </div>

      )
  }