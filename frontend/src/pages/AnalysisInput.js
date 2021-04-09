import React, {useCallback} from 'react';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import InputInstructions from '../components/InputInstructions';
import DropBox from '../components/DropBox';
import CustomizeSettingsDropDown from "../components/CustomizeSettingsDropDown";
import { Button, Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import "../css/AnalysisInput.css";

const config = require('../config');
//const BACKEND_URL = config.backend.uri;

export default function AnalysisInput() {

    const useStyles = makeStyles((theme) => ({
        button: {
          "& .MuiButton-root": {
            margin: theme.spacing(3),
            color: "black",
            background: "#DABA11",
            padding: "10px 40px",
            fontSize: "16px",
            border: "1px solid black",
            // width: "30%"
          },
        },
      }));

      const classes = useStyles();

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
              <p className="Subsection-Step-Title"> Step #1: Upload Images </p>
              <section className="Step-1-Container">
                  <InputInstructions/>
                  <DropBox handleFiles={setFiles}/>
              </section>
              <p className="Subsection-Step-Title"> Step #2: Customize Settings </p>
              <section className="Step-2-Container">
                  <CustomizeSettingsDropDown title="Individual Image Analysis" info="Analysis will be conducted on each individual image seperately."
                  options={[ 'Oliver Hansen',
                  'Van Henry',
                  'April Tucker',
                  'Ralph Hubbard',
                  'Omar Alexander',
                  'Carlos Abbott',
                  'Miriam Wagner',
                  'Bradley Wilkerson',
                  'Virginia Andrews',
                  'Kelly Snyder']}
                  />
                  <div class="vl"></div>
                  <CustomizeSettingsDropDown title="Group Image Analysis" info="Analysis will be conducted on all images holistically."
                  options={[ 'Oliver Hansen',
                  'Van Henry',
                  'April Tucker',
                  'Ralph Hubbard',
                  'Omar Alexander',
                  'Carlos Abbott',
                  'Miriam Wagner',
                  'Bradley Wilkerson',
                  'Virginia Andrews',
                  'Kelly Snyder']}
                  />
              </section>
              {/* <button onClick={getFiles}>Parent Files</button> */}
              <div className={`${classes.button} Submit-Button`} >
                <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        // disabled={state.form_disabled}
                    >
                        Begin Analysis
                </Button>
              </div>
              <Footer/>
          </div>

      )
  }
  
//   export default AnalysisInput;