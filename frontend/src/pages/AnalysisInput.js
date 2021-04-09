import React, { Component, useCallback} from 'react';
import { Button, Snackbar } from '@material-ui/core';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

import DropBox from '../components/DropBox';

const config = require('../config');
//const BACKEND_URL = config.backend.uri;

export default function AnalysisInput() {

    const [state, setState] = React.useState({  

        inputFiles: []  // all file objects in dropbox can be accessed here, organized in natural sort
    });

    /**
     * Allows the state atribute inputFiles to be updated to reflect changes made in the DropBox component. 
     */
    const setFiles = useCallback(
        (files) => {
          setState({inputFiles: files});
        },
        [], // Tells React to memoize regardless of arguments.
      );
    
    /**
     * Very simple dummy function to verify state has most updated files from DropBox. 
     */
    function getFiles(){

        let x = "";
        for(var i=0; i < state.inputFiles.length; i++){
            x += " " + state.inputFiles[i].name;
        }

        alert(x);
    }

    /**
     * Dummy array and function to verify that prediction values are returned
     * from backend. (via "See Result" button)
     */
    let predictions = [];
    function getResult(){

        let x = "";
        for(var i=0; i < predictions.length; i++){
            x += " " + predictions[i][0] + "\n";
        }
    
        alert(x);
    }

    /**
     * Reads files in inputFiles and get a prediction from the backend for each one.
     */
    async function readImg() {
        state.inputFiles.forEach((file, i) => {
            const reader = new FileReader()
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = async () => {
                // predict on loaded file
                const buffer = reader.result;
                const response = await getPrediction(buffer, file.type, file.name)

                // save to dummy array
                predictions[i] = response.prediction;
            }

            reader.readAsArrayBuffer(file)
        });
    }

    /**
     * Gets prediction for image via HTTP request to backend.
     * 
     * @param {*} data - Image buffer from readImg()
     * @param {*} type - Image type
     * @param {*} name - Image filename
     * @returns 
     */
    async function getPrediction(data, type, name) {
        const response = await fetch(`/predict`, {
            method: 'POST',
            headers: {'Content-Type': type, 'filename': name},
            body: data
        })
        return await response.json();
    }
        
      return (

          <div>
              <NavBar/>
              <DropBox handleFiles={setFiles}/>
              <button onClick={getFiles}>Parent Files</button>

              {/* Placeholder buttons to test prediction and verify that results are returned */}
              <button type="button" onClick= {(e) => readImg()} className="btn btn-danger">Predict</button>
              <button onClick={getResult}>See Result</button>
              <Footer/>
          </div>

      )
  }
  
//   export default AnalysisInput;