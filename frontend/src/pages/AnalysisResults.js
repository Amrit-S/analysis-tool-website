import React, { Component} from 'react';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const config = require('../config');

//const BACKEND_URL = config.backend.uri;

class AnalysisResults extends Component {

    render (){

      return (

          <div>
              <NavBar/>
              <div style={{marginTop: "30px"}}>
                  This is the Analysis Results Page.
              </div>
              <Footer/>
          </div>

      )
    }
  }
  
  export default AnalysisResults;