/**
 * Renders all group results asked for by the user on the results page. 
 */
 import React from 'react';
 import GraphComponent from "../components/GraphComponent";
 import {ANALYSIS_OPTIONS} from "../constants/analysisOptions";
 
 export default function GroupResults(props) {
 
       const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
 
       function getDataForOption(opt){
 
         let graphOptions = {
           "data": [],
           "maxValue": null,
           "yAxisLabel" : null
         }
 
         switch(opt){
 
           case ANALYSIS_OPTIONS.GROUP_CNN:
             graphOptions["maxValue"] = 100;
             graphOptions["yAxisLabel"] = "% Reject Prediction";
             graphOptions["data"] = props.inputPageData.analysisData.cnn.map(pred => {
               const normalP = parseFloat(pred["1"]) * 100;
               return normalP;
             });
 
             return graphOptions;
 
           case ANALYSIS_OPTIONS.GROUP_SEG_SIZE:
             graphOptions["maxValue"] = 3500;
             graphOptions["yAxisLabel"] = "Avg. Cell Size (pixels)";
             graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(entry => {
               return Number(parseFloat(entry.stats.size.mean).toFixed(2));
             });
 
             return graphOptions;
 
           case ANALYSIS_OPTIONS.GROUP_SEG_SHAPE:
             graphOptions["maxValue"] = 10;
             graphOptions["yAxisLabel"] = "Avg. Number of Sides Per Cell";
             graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(entry => {
               return Number(parseFloat(entry.stats.shape.mean).toFixed(2));
             });
 
             return graphOptions;
 
           case ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS:
             graphOptions["maxValue"] = 1;
             graphOptions["yAxisLabel"] = "Avg. Cell Pointiness Ratio";
             graphOptions["data"] = props.inputPageData.analysisData.segmentation.map(entry => {
               return Number(parseFloat(entry.stats.pointiness.mean).toFixed(2));
             });
 
             return graphOptions;
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
 
               const graphOptions = getDataForOption(option);
 
               return <GraphComponent 
               title={option} 
               analysis={text}
               greyTitle={i % 2 === 0} 
               data={graphOptions.data}
               labels={getLabels()}
               options={graphOptions}
               />
             })
           }
           </>
 
       )
   }