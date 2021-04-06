import React, { Component} from 'react';

import GraphComponent from "../components/GraphComponent";

//const BACKEND_URL = config.backend.uri;

class IndividualResults extends Component {

    render (){

      return (

          <>
               <GraphComponent 
              title={"CNN Prediction Time Series"} 
              greyTitle={false} 
              data={[10, 20, 30, 40 , 50]}
              labels={[1,15,30,45,60]}
              />
          </>

      )
    }
  }
  
  export default IndividualResults;