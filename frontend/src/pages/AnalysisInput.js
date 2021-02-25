import React, { Component, useCallback} from 'react';
import { Button, Snackbar } from '@material-ui/core';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

import DropBox from '../components/DropBox';

const config = require('../config');
//const BACKEND_URL = config.backend.uri;

export default function AnalysisInput() {

    const [state, setState] = React.useState({  
          
        inputFiles: []
    });

    const setFiles = useCallback(
        (files) => {
          //console.log('Click happened');
          setState({inputFiles: files});
        },
        [], // Tells React to memoize regardless of arguments.
      );

    // function setFiles(files){
    //     setState({inputFiles: files});
    // }

    function getFiles(){

        let x = "";
        for(var i=0; i < state.inputFiles.length; i++){
            x += " " + state.inputFiles[i].name;
        }

        alert(x);
    }
        
      return (

          <div>
              <NavBar/>
              <div style={{marginTop: "30px"}}>
                  This is the Data Retrieval Page for Analysis.
              </div>
              <DropBox handleFiles={setFiles}/>
              <button onClick={getFiles}>Parent Files</button>
              <Footer/>
          </div>

      )
  }
  
//   export default AnalysisInput;