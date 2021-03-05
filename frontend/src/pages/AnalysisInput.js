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
        
      return (

          <div>
              <NavBar/>
              <DropBox handleFiles={setFiles}/>
              <button onClick={getFiles}>Parent Files</button>
              <Footer/>
          </div>

      )
  }
  
//   export default AnalysisInput;