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
            filesA: []
    });
  
      //Error Message Display: Auto close itself by updating its states
      const handleSnackClose = (event, reason) => {
          if (reason === 'clickaway') {
          return;
          }
      };

    const handleDrop = (acceptedFiles, fileRejections) => {

        // let updatedFiles = state.files;

        // //Want files in ascending order by filename, no duplicates (if duplicate exists than newer one gets priority)
        // for(var i=0; i < acceptedFiles.length; i++){
        //   let file = acceptedFiles[i];
        //   updatedFiles[file.name] = file;
        // }

        // setState({files: updatedFiles});

        //Combines but keeps duplicates (bug)
        let uniqueFiles = Array.from(new Set([...acceptedFiles, ...state.filesA]));
        uniqueFiles.sort(function(file1, file2){
            return file1.name < file2.name ? -1:1;
        });
        setState({filesA: uniqueFiles})
        // if(fileRejections.length > 0){
        //   setState({showSnack: true});
        // }
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

    // let updatedFiles = state.files;
    // e.target.parentNode.style.display = 'none';
    // delete updatedFiles[e.target.parentNode.id];
    // setState({files: updatedFiles});

    

    e.target.parentNode.style.display = 'none';

    var i = 0;
    for(i = 0; i < state.filesA.length; i++){
        if(state.filesA[i].name === e.target.parentNode.id){
            break;
        }
    }
    state.filesA.splice(i, 1);

    // setState({filesA: state.filesA});
}

function getFiles(){
  let currFiles = Object.keys(state.files).map(function(key){
    return key;
  });

  currFiles.sort(function compare(file1, file2){
    return file1 < file2 ? -1:1;
  });
  alert(currFiles);

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
          <div>
              <div className={`dropzone ${isDragActive ? 'active': null}`} >
                  <section {...getRootProps({ })}>
                    <span>{isDragActive ? "📂" : "📁"}</span>
                    <input {...getInputProps()} />
                    <p>Drag'n'drop images, or click to select files</p>
                  </section>
                  <section className="Accepted" style={{display: state.filesA.length > 0 ? null: "none"}}>
                    <strong>Files:</strong>
                    <ul>
                      {state.filesA.map( (file, i) => (
                        <li id={`${file.name}`}>
                          <a href={onPreviewImage(file)} target="_blank" rel="noopener noreferrer">
                            {file.name}
                          </a>
                          <span class="close" onClick={onDeleteFile}>&times;</span>
                        </li>
                      ))}
                    </ul>
                </section>
                <button onClick={getFiles}>Click me</button>
              </div>
              
          </div>
        
        )}
      </Dropzone>
  );
}