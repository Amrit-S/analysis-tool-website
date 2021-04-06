import React from 'react';

import {Line} from 'react-chartjs-2';

import {getMean, getMin, getMax, getMedian, getSTD, getMovingAverage} from '../util/Stats';

import '../css/GraphComponent.css';

export default function GraphComponent(props) {

    const graphData = {
        labels: props.labels,
        datasets: [
          {
            label: 'Time Series',
            //backgroundColor: 'rgba(255,255,255,0)',
            fill: false, 
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
            data: props.data
          },
          {
            label: 'Moving Average',
            // backgroundColor: 'rgba(75,192,192,1)',
            fill: false, 
            borderColor: '#DABA11',
            borderWidth: 2,
            data: getMovingAverage(props.data)
          }
        ]
      }

      const options = {
        legend:{
            display:true,
            position:'top'
        },
        scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: '% Normal Prediction'
              },
              ticks: {
                beginAtZero:true,
                min: 0,
                max: 100    
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
            <div className={!props.greyTitle ? "Title-AlignRight":null}>
                <p className={`Title ${props.greyTitle ? "Grey-Title": "Blue-Title"}`}> {props.title} </p>
            </div>
            <section className="Main">
                <section className="Graph">
                <Line
                    data={graphData}
                    options={options}
                    />
                </section>
                <section className="Info">
                    <p className="Analysis-Tips"> Analysis Tips </p>
                    <p className="Analysis-Tips-Text"> 
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
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
                </section>
            </section>
        </>

      )
  }