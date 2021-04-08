/**
 * Renders all group results asked for by the user on the results page. 
 */
import React, { Component} from 'react';

import GraphComponent from "../components/GraphComponent";

class GroupResults extends Component {

    render (){

      const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

      return (

          <>
               <GraphComponent 
              title={"CNN Prediction Time Series"} 
              analysis={text}
              greyTitle={true} 
              data={[10, 20, 30, 40 , 50]}
              labels={[1,15,30,45,60]}
              />
                <GraphComponent 
                    title={"CNN Prediction Time Series"} 
                    analysis={text}
                    greyTitle={false} 
                    data={[10, 20, 30, 40 , 50]}
                    labels={[1,15,30,45,60]}
              />
          </>

      )
    }
  }
  
  export default GroupResults;