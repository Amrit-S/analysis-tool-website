/**
 * Renders the graph component used on the group results page, rendering both the graph 
 * on the lefthand side as well as its analysis text and statistical breakdown on the right. 
 * Takes in a few props to enable customization, including title, text, data, and general 
 * placement. 
 * 
 * @summary     Renders a single group analysis row on the group results page. 
 */

 import React, {useEffect} from 'react';
 import {Line} from 'react-chartjs-2';
 
 import {getMean, getMin, getMax, getMedian, getSTD} from '../util/Stats';
 
 import '../css/GraphComponent.css';

 const CNN_REJECTION_BASELINE_VAL = 50;
 
 export default function GraphComponent(props) {

  const[ datasets, setDatasets] = React.useState([]); 
 
     const graphData = {
         labels: props.labels,
         datasets: datasets
      }

      // loads in data needed for graph curves 
       useEffect(() => {
        try {

          // load the graph data
          let graphData = [
                    {
              label: 'Time Series',
              fill: false, 
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 2,
              data: props.data
            },
            {
              label: 'Moving Average',
              fill: false, 
              borderColor: '#DABA11',
              borderWidth: 2,
              data: props.movAvgData
            }
          ]
          

          // show the CNN Rejection baseline 
          if(props.showCNNBaseline){
            graphData.push({
              label: 'Rejection Baseline',
              fill: 'end', 
              backgroundColor: 'rgba(255, 0, 0, 0.178)',
              borderColor: 'red',
              borderWidth: 2,
              data: props.labels.map((label) => {return CNN_REJECTION_BASELINE_VAL;})
            })
          }

          setDatasets(graphData);

        } catch (err) {
            return;
        }

    }, []);
 
       // customize graph 
       const options = {
         legend:{
             display:true,
             position:'top'
         },
         scales: {
             yAxes: [{
               scaleLabel: {
                 display: true,
                 labelString: props.options.yAxisLabel
               },
               ticks: {
                 beginAtZero:true,
                 min: 0,
                 max: props.options.maxValue    
             }
             }],
             xAxes: [{
               scaleLabel: {
                 display: true,
                 labelString: 'Time Lapse (Months)'
               }
             }],
         }
     };
 
       return (
 
         <>
             {/* Title */}
             <div className={!props.greyTitle ? "Title-AlignRight":null}>
                 <p className={`Title ${props.greyTitle ? "Grey-Title": "Blue-Title"}`}> {props.title} </p>
             </div>
             <section className="MainC">
                {/* Left - Graph  */}
                 <section className="Graph">
                 <Line
                     data={graphData}
                     options={options}
                     />
                 </section>
                  {/* Right - Analysis Information  */}
                 <section className="Info">
                     {/* Top - Tips on Analysis */}
                     <p className="Analysis-Tips"> Time Series Statistics </p>
                     {/* <p className="Analysis-Tips-Text"> 
                         {props.analysis}
                     </p> */}
                     {/* Bottom - Statisitical Breakdown */}
                     <table className="Stats-Table">
                         <tr>
                             <th>Min</th>
                             <th>Max</th>
                             <th>Med.</th>
                             <th>Mean</th>
                             <th>STD</th>
                         </tr>
                         <tr>
                             <td>{getMin(props.data)}</td>
                             <td>{getMax(props.data)}</td>
                             <td>{getMedian(props.data)}</td>
                             <td>{getMean(props.data)}</td>
                             <td>{getSTD(props.data)}</td>
                         </tr>
                     </table>
                     <p className="Analysis-Tips"> Moving Average Statistics </p>
                     <table className="Stats-Table">
                         <tr>
                             <th>Min</th>
                             <th>Max</th>
                             <th>Med.</th>
                             <th>Mean</th>
                             <th>STD</th>
                         </tr>
                         <tr>
                             <td>{getMin(props.movAvgData)}</td>
                             <td>{getMax(props.movAvgData)}</td>
                             <td>{getMedian(props.movAvgData)}</td>
                             <td>{getMean(props.movAvgData)}</td>
                             <td>{getSTD(props.movAvgData)}</td>
                         </tr>
                     </table>
                 </section>
             </section>
         </>
 
       )
   }