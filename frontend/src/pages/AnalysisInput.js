import React, { Component} from 'react';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const config = require('../config');

//const BACKEND_URL = config.backend.uri;

class AnalysisInput extends Component {

    render (){

      return (

          <div>
              <NavBar/>
              <pre style={{marginTop: "30px"}}>
                  This is the Data Retrieval Page for Analysis.
                </pre>
              <Footer/>
          </div>

      )
    }
  }
  
  export default AnalysisInput;