import {ANALYSIS_OPTIONS} from "../constants/analysisOptions";

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

async function handleSegmentationFetchCall(inputFileJSONs, options){

   return await fetch(`/segmentation/predict`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          "files" : inputFileJSONs,
          "size": options["size"],
          "shape": options["shape"],
          "pointiness": options["pointiness"],
          "overlay": options["overlay"]
      })
  }).then(async (res) => {
      const json = await res.json();
      // successful response, return predictions
      if(res.status === 200){
          return json;
      // error occurred 
      } else {
          throw Error(`Error: ${json}`);
      }
  })
}

/**
 * Reads files in inputFiles and get a prediction from the backend for each one.
 */
    function prepareFiles(files) {

    return new Promise((resolve, reject) => {
        let fileJSONs = [];
        files.forEach( (file, i) => {
            const reader = new FileReader();
            reader.onabort = () => {
                console.log('file reading was aborted');
                reject(`Error: ${file.name} could not be properly read.`);
            }
            reader.onerror = () => {
                console.log('file reading has failed');
                reject(`Error: ${file.name} could not be properly read.`);
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

const determineCustomizations = (individualAnalysis, groupAnalysis) => {
    // default, assume no option is chosen 
    let overlay = false; 
    let size = false; 
    let shape = false; 
    let pointiness = false;
    let cnn = false;
    
    // update options based on individual picks 
    for(let i = 0; i < individualAnalysis.length; i++){

        switch(individualAnalysis[i]){
            case ANALYSIS_OPTIONS.INDIVIDUAL_CNN:
                cnn = true;
                break;
            case ANALYSIS_OPTIONS.INDIVIDUAL_SEG_SIZE:
                size = true;
                overlay = true;
                break;
            case ANALYSIS_OPTIONS.INDIVIDUAL_SEG_SHAPE:
                shape = true; 
                overlay = true;
                break;
            case ANALYSIS_OPTIONS.INDIVIDUAL_SEG_POINTINESS:
                pointiness = true; 
                overlay = true; 
                break;
            default:
                break; 
        }
    }

    // update options based on group picks 
    for(let i = 0; i < groupAnalysis.length; i++){
        switch(groupAnalysis[i]){
            case ANALYSIS_OPTIONS.GROUP_CNN:
                cnn = true;
                break;
            case ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MEAN:
                pointiness = true; 
                break; 
            case ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MEDIAN:
                pointiness = true; 
                break; 
            case ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_STD:
                pointiness = true; 
                break; 
            case ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MIN:
                pointiness = true; 
                break; 
            case ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MAX:
                pointiness = true; 
                break; 
            case ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MEAN:
                size = true;
                break;
            case ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MEDIAN:
                size = true;
                break;
            case ANALYSIS_OPTIONS.GROUP_SEG_SIZE_STD:
                size = true;
                break;
            case ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MIN:
                size = true;
                break;
            case ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MAX:
                size = true;
                break;
            case ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MEAN:
                shape = true; 
                break;
            case ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MEDIAN:
                shape = true; 
                break;
            case ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_STD:
                shape = true; 
                break;
            case ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MIN:
                shape = true; 
                break;
            case ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MAX:
                shape = true; 
                break;
            default:
                break;
        }
    }

    return {
        "overlay": overlay, 
        "size": size,
        "shape": shape, 
        "pointiness": pointiness,
        "cnn": cnn,
        "segmentation": size || shape || pointiness
    };
}

const getAllIndividualOptions = () =>{
    return [
        ANALYSIS_OPTIONS.INDIVIDUAL_CNN, 
        ANALYSIS_OPTIONS.INDIVIDUAL_SEG_SIZE,
        ANALYSIS_OPTIONS.INDIVIDUAL_SEG_SHAPE , 
        ANALYSIS_OPTIONS.INDIVIDUAL_SEG_POINTINESS,
    ]
};

const getAllGroupOptions = () =>{
    return [
        ANALYSIS_OPTIONS.GROUP_CNN , 

        ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MEAN,
        ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MEDIAN,
        ANALYSIS_OPTIONS.GROUP_SEG_SIZE_STD,
        ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MIN,
        ANALYSIS_OPTIONS.GROUP_SEG_SIZE_MAX,

        ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MEAN,
        ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MEDIAN,
        ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_STD,
        ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MIN,
        ANALYSIS_OPTIONS.GROUP_SEG_SHAPE_MAX,
    
        ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MEAN,
        ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MEDIAN,
        ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_STD,
        ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MIN,
        ANALYSIS_OPTIONS.GROUP_SEG_POINTINESS_MAX
    ]
};

export {
    getAllIndividualOptions,
    getAllGroupOptions,
    handleCNNPredictionsFetchCall,
    handleSegmentationFetchCall,
    determineCustomizations,
    prepareFiles
  };