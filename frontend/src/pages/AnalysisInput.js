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
    let predictions = "";
    function getResult(){
        alert(predictions);
    }

    /**
     * Reads files in inputFiles and get a prediction from the backend for each one.
     */
    let files = [];
    async function readImg() {
        state.inputFiles.forEach((file, i) => {
            const reader = new FileReader();
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');
            reader.onload = async () => {
                // store file info into files array
                const buffer = reader.result;
                files[i] = {'type': file.type, 'name': file.name, 'buffer': ab2str(buffer)};

                // get prediction once all files are loaded
                if (i === state.inputFiles.length - 1) {
                    predictions = await getPrediction(files);
                }
            }

            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Converts array buffer to string so it can be included in JSON
     * 
     * @param {Array} buf - An array buffer (output of FileReader)
     * @returns {string} - Stringified array buffer
     */
    function ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    /**
     * Gets prediction for image via HTTP request to backend.
     * 
     * @param {*} fileList - Array of JSON with file type, name, buffer
     * @returns - Response from backend
     */
    async function getPrediction(fileList) {
        const response = await fetch(`/predict`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(fileList)
        });
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