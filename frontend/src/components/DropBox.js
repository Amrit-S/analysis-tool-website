import React, { useState } from 'react'
import Dropzone from "react-dropzone";
import { Link, Snackbar } from '@material-ui/core';

import "../css/DropBox.css";

const FILE_NAMING_REGEX = /^\d+\.\d{2}\.[a-zA-Z]+$/;

export default function DropBox() {
    // const onDrop = useCallback((acceptedFiles) => {
    //     acceptedFiles.forEach((file) => {
    //       const reader = new FileReader()
    
    //       reader.onabort = () => console.log('file reading was aborted')
    //       reader.onerror = () => console.log('file reading has failed')
    //       reader.onload = () => {
    //       // Do whatever you want with the file contents
    //         const binaryStr = reader.result
    //         // console.log(binaryStr)
    //         // alert(binaryStr);
    //       }
    //       reader.readAsArrayBuffer(file)
    //     })
        
    //   }, [])
    // const [fileNames, setFileNames] = useState([]);
    // const [showSnack, setState] = React.useState(false);

    const [state, setState] = React.useState({  
          
            files: {},
            displayError: false
    });
  
      //Error Message Display: Auto close itself by updating its states
      const handleSnackClose = (event, reason) => {
          if (reason === 'clickaway') {
          return;
          }
          setState({...state, displayError: false});
      };

    const handleDrop = (acceptedFiles, fileRejections) => {

        let updatedFiles = state.files;

        //Want files in ascending order by filename, no duplicates (if duplicate exists than newer one gets priority)
        for(var i=0; i < acceptedFiles.length; i++){
          let file = acceptedFiles[i];
          updatedFiles[file.name] = file;
        }

        setState({files: updatedFiles, displayError: fileRejections.length > 0 ? true:false});
    }

    function validNamingSchema(file) {

        let match = file.name.match(FILE_NAMING_REGEX);
        try{
            if(match[0] === file.name && match[0].length === file.name.length){
                return null;
            } else {
                return {
                    code: "invalid-naming-schema",
                    message: `Invalid Filename`
                    };
            }
        } catch(err){
                  return {
                        code: "invalid-naming-schema",
                        message: `Invalid Filename`
                    };
        }
    }

    function retrieveOrderedFiles(){
      let currFiles = Object.keys(state.files).map(function(key){
        return state.files[key];
      });

      currFiles.sort(function compare(file1, file2){
        return file1.name < file2.name ? -1:1;
      });

      return currFiles;
    }

function onDeleteFile(e){
    e.target.parentNode.style.display = 'none';
    delete state.files[e.target.parentNode.id];
}

function onPreviewImage(file){
  var urlLink = URL.createObjectURL(file);
  return urlLink;
}

  return (
      <Dropzone
        onDrop={handleDrop}
        accept="image/*"
        minSize={1024}
        maxSize={3072000}
        validator= {validNamingSchema}
      >
        {({ getRootProps, getInputProps, isDragActive, fileRejections }) => (
              <div className={`dropzone ${isDragActive ? 'active': null}`} >
                  <section {...getRootProps({ })}>
                    <span>{isDragActive ? "📂" : "📁"}</span>
                    <input {...getInputProps()} />
                    <p>Drag'n'drop images, or click to select files</p>
                  </section>
                  <section className="Accepted" style={{display: Object.keys(state.files).length > 0 ? null: "none"}}>
                    <strong>Files:</strong>
                    <ul>
                      {retrieveOrderedFiles().map( (file, i) => (
                        <li id={`${file.name}`}>
                          <a href={onPreviewImage(file)} target="_blank" rel="noopener noreferrer">
                            {file.name}
                          </a>
                          <span class="close" onClick={onDeleteFile}>&times;</span>
                        </li>
                      ))}
                    </ul>
                </section>
                <Snackbar open={state.displayError} autoHideDuration={6000} onClose={handleSnackClose} message={`${fileRejections.length} file${fileRejections.length > 1 ? "s":""} could not be uploaded`}/>
              </div>
        
        )}
      </Dropzone>
  );
}