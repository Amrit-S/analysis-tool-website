import React, {useCallback} from 'react';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import InputInstructions from '../components/InputInstructions';
import DropBox from '../components/DropBox';
import CustomizeSettingsDropDown from "../components/CustomizeSettingsDropDown";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { IoMdAnalytics } from 'react-icons/io';

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
          },
        },
      }));

      const classes = useStyles();

    const [files, setFiles] = React.useState([]);
    const [individualAnalysis, setIndividualAnalysis] = React.useState({
        options: [],
        checkbox: false,
    });

    const [groupAnalysis, setGroupAnalysis] = React.useState({
        options: [],
        checkbox: false,
    });

    const [error, setError] = React.useState({
        display: false, 
        message: ''
    });

    const [formDisabled, setFormDisabled] = React.useState(false);

    /**
     * Allows the state atribute inputFiles to be updated to reflect changes made in the DropBox component. 
     */
    const setFilesCallback = useCallback(
        (files) => {
            setFiles(files);
        },
        [], // Tells React to memoize regardless of arguments.
      );

    const setIndividualAnalysisCallback = useCallback(
        (options, checkbox) => {
            setIndividualAnalysis({ options: options, checkbox: checkbox});
        },
        [], // Tells React to memoize regardless of arguments.
    );

    const setGroupAnalysisCallback = useCallback(
        (options, checkbox) => {
            setGroupAnalysis({options: options, checkbox: checkbox});
        },
        [], // Tells React to memoize regardless of arguments.
    );

    async function handleButtonClick() {
        setFormDisabled(true);

        let errorMessage = '';

        if(files.length < 1){
            errorMessage += "At least one image file must be uploaded.\n";
        }
        if(!individualAnalysis.checkbox && individualAnalysis.options.length < 1){
            errorMessage += 'A valid option must be chosen for Individual Analysis.\n'
        }
        if(!groupAnalysis.checkbox && groupAnalysis.options.length < 1){
            errorMessage += 'A valid option must be chosen for Group Analysis.\n'
        }

        if(errorMessage !== ''){
            setError({display: true, message: errorMessage});
            setFormDisabled(false);
            return; 
        }
        prepareFiles(handleBackendCalls);
        setError({display: false});
        setFormDisabled(false);
    }


    async function handleBackendCalls(inputFileJSONs){
         const predictions = await getPrediction(inputFileJSONs);
         alert(predictions);
    }
    /**
     * Reads files in inputFiles and get a prediction from the backend for each one.
     */
    function prepareFiles(callback) {
        let fileJSONs = [];
        files.forEach( (file, i) => {
            const reader = new FileReader();
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');
            reader.onload =  () => {
                // store file info into files array
                const buffer = reader.result;
                fileJSONs[i] = {'type': file.type, 'name': file.name, 'buffer': ab2str(buffer)};

                console.log(i);

                //get prediction once all files are loaded
                if (i === files.length - 1) {
                    callback(fileJSONs);
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
        const response = await fetch(`/cnn/predict`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(fileList)
        });
        return await response.json();
    }
        
      return (

          <div>
              <NavBar/>
              <p className="Subsection-Step-Title"> Step #1: Upload Images </p>
              <section className="Step-1-Container">
                  <InputInstructions/>
                  <DropBox handleFiles={setFilesCallback}/>
              </section>
              <p className="Subsection-Step-Title"> Step #2: Customize Settings </p>
              <section className="Step-2-Container">
                  <CustomizeSettingsDropDown title="Individual Image Analysis" info={"Analysis will be conducted on all images seperately."}
                  options={[ 
                  'Van Henry',
                  'April Tucker',
                  'Ralph Hubbard',
                  'Omar Alexander',
                  'Carlos Abbott',
                  'Miriam Wagner',
                  'Bradley Wilkerson',
                  'Virginia Andrews',
                  'Kelly Snyder']}
                  callback={setIndividualAnalysisCallback}
                  />
                <div class="vl"></div>
                <CustomizeSettingsDropDown title="Group Image Analysis" info={"Analysis will be conducted on all images holistically."}
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
                callback={setGroupAnalysisCallback}
                />
              </section>
              {/* <button onClick={getFiles}>Parent Files</button> */}
              <div className={`${classes.button} Submit-Button`} >
                <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={handleButtonClick}
                        disabled={formDisabled}
                        startIcon={<IoMdAnalytics/>}
                    >
                        Begin Analysis
                </Button>
              </div>
              <p className="errorText" style={{display: error.display ? null:'none'}}> {error.message}</p>
              {/* <button onClick={getFiles}> Files </button> */}
              <Footer/>
          </div>

      )
  }
  
//   export default AnalysisInput;