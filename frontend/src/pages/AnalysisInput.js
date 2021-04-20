import React, {useCallback} from 'react';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import InputInstructions from '../components/InputInstructions';
import DropBox from '../components/DropBox';
import CustomizeSettingsDropDown from "../components/CustomizeSettingsDropDown";
import LoadingScreen from '../components/LoadingScreen';
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { IoMdAnalytics } from 'react-icons/io';
import { useHistory } from "react-router-dom";

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
    const history = useHistory();

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
    const [progressBar, setProgressBar] = React.useState({
        show: false,
        progress: 0,
        title: 'Parsing Image Files'
    });

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

    const closeProgressBar = () => {
        setProgressBar(false);
    }

    function handleButtonClick() {
        // disable submit button 
        setFormDisabled(true);

        // parse inputs for any errors
        let errorMessage = '';

        // no image files uploaded
        if(files.length < 1){
            errorMessage += "At least one image file must be uploaded.\n";
        }
        // nothing selected for individual 
        if(!individualAnalysis.checkbox && individualAnalysis.options.length < 1){
            errorMessage += 'A valid option must be chosen for Individual Analysis.\n'
        }

        // nothing selected for group
        if(!groupAnalysis.checkbox && groupAnalysis.options.length < 1){
            errorMessage += 'A valid option must be chosen for Group Analysis.\n'
        }

        // neither analysis chosen (both have chekcboxes clicked)
        if(individualAnalysis.checkbox && groupAnalysis.checkbox){
            errorMessage += 'At least one type of analysis must be chosen.\n'
        }

        // early termination on error, with error message
        if(errorMessage !== ''){
            handleError(errorMessage);
            return; 
        }
        // no errors, show progress bar 
        setProgressBar({show: true, title: 'Parsing Data...'});

        // prepare input files for backend calls 
        prepareFiles()
        .then(async (fileJSONS) => {
            try{

                setProgressBar({show: true, title: 'Analyzing Data...'});
                const segResults = await handleSegmentationFetchCall(fileJSONS);
                setProgressBar({show: false});
                setFormDisabled(false);
                // const cnnPredictions = await handleCNNPredictionsFetchCall(fileJSONS);  
                // redirectToResultsPage(fileJSONS, cnnPredictions, null);

            } catch(err){
                handleError(err);
            }
        }
        ).catch(err => {
            handleError(err);
        });
    }

    function redirectToResultsPage(inputFileJSONs, cnnPredictions, segmentationPredictions){
        history.push({
            pathname: "/analysis-results",
            state: { inputFileJsons: inputFileJSONs, cnnPredictions: cnnPredictions || [], segmentationPredictions: segmentationPredictions || [], individualOptions: individualAnalysis.options, groupOptions: groupAnalysis.options }
        });
    }

    function handleError(errorMsg){
        setError({display: true, message: errorMsg});
        setProgressBar({show: false});
        setFormDisabled(false);
    }


    async function handleCNNPredictionsFetchCall(inputFileJSONs){

         return await fetch(`/cnn/predict`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(inputFileJSONs)
        }).then(async (res) => {
            const json = await res.json();
            // successful response, return predictions
            if(res.status === 200){
                return json;
            // error occurred 
            } else {
                throw Error(`Error: ${json} appears to be a bad file.`);
            }
        })
    }

    async function handleSegmentationFetchCall(inputFileJSONs){

        return await fetch(`/segmentation/predict`, {
           method: 'POST',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify(inputFileJSONs)
       }).then(async (res) => {
           const json = await res.json();
           // successful response, return predictions
           if(res.status === 200){
               return json;
           // error occurred 
           } else {
               throw Error(`Error: ${json} appears to be a bad file.`);
           }
       })
   }

    /**
     * Reads files in inputFiles and get a prediction from the backend for each one.
     */
    function prepareFiles() {

        return new Promise((resolve, reject) => {
            let fileJSONs = [];
            files.forEach( (file, i) => {
                const reader = new FileReader();
                reader.onabort = () => {
                    console.log('file reading was aborted');
                    reject('file reading was aborted');
                }
                reader.onerror = () => {
                    console.log('file reading has failed');
                    reject('file reading has failed');
                };
                reader.onload =  async () => {

                    function ab2str(buf) {
                        return String.fromCharCode.apply(null, new Uint8Array(buf));
                    }

                    // store file info into files array
                    const buffer = reader.result;
                    fileJSONs[i] = {'type': file.type, 'name': file.name, 'buffer': ab2str(buffer)};
    
                    //get prediction once all files are loaded
                    if (i === files.length - 1) {
                        resolve(fileJSONs);
                    }
                }
                reader.readAsArrayBuffer(file);
            });
        })
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
                  <CustomizeSettingsDropDown title="Individual Image Analysis" info={"Analysis will be conducted on each individual image seperately."}
                  options={[ 
                  'CNN Predictions']}
                  callback={setIndividualAnalysisCallback}
                  />
                <div class="vl"></div>
                <CustomizeSettingsDropDown title="Group Image Analysis" info={"Analysis will be conducted on all images holistically via time series. Recommended for 2+ images."}
                options={[ 
                "CNN Prediction Time Series",
                ]}
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
              <LoadingScreen open={progressBar.show} handleClose={closeProgressBar} title={progressBar.title}/>
              <Footer/>
          </div>

      )
  }