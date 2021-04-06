import React, { Component} from 'react';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import GraphComponent from "../components/GraphComponent";

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
               <GraphComponent 
              title={"CNN Prediction Time Series"} 
              greyTitle={true} 
              data={[10, 20, 30, 40 , 50]}
              labels={[1,15,30,45,60]}
              />
                <GraphComponent 
                    title={"CNN Prediction Time Series"} 
                    greyTitle={false} 
                    data={[10, 20, 30, 40 , 50]}
                    labels={[1,15,30,45,60]}
              />
              <Footer/>
          </div>

      )
    }
  }
  
  export default AnalysisResults;