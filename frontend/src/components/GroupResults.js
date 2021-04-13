/**
 * Renders all group results asked for by the user on the results page. 
 */
import React from 'react';

import GraphComponent from "../components/GraphComponent";

export default function GroupResults(props) {

      const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

      function getDataForOption(opt){
        if(opt === 'CNN Prediction Time Series'){
          return props.inputPageData.analysisData.cnn.map(pred => {
            const normalP = parseFloat(pred["0"]) * 100;
            return normalP;
          });
        }
      }

      function getLabels(){
        return props.inputPageData.inputFileJSONs.map(file => {
         return parseFloat(file.name.substr(0, file.name.lastIndexOf('.')));
        });
      }

      return (

          <>
          {
            props.inputPageData.groupOptions.map( (option, i) => {
              return <GraphComponent 
              title={option} 
              analysis={text}
              greyTitle={i % 2 === 0} 
              data={getDataForOption(option)}
              labels={getLabels()}
              />
            })
          }
          </>

      )
  }