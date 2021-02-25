import React, { useState, useRef } from 'react'
import _ from "lodash";
import Dropzone from "react-dropzone";
import { Link, Snackbar } from '@material-ui/core';

import "../css/DropBox.css";

const FILE_NAMING_REGEX = /^\d+\.\d{2}\.[a-zA-Z]+$/;

export default function DropBox(props) {

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
        props.handleFiles(retrieveOrderedFiles());
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
      let files = state.files;
      let currFiles = Object.keys(files).map(function(key){
        return files[key];
      });

      currFiles.sort(function compare(file1, file2){

        function naturalCompare(a, b) {
          var ax = [], bx = [];
      
          a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
          b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
          
          while(ax.length && bx.length) {
              var an = ax.shift();
              var bn = bx.shift();
              var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
              if(nn) return nn;
          }
      
          return ax.length - bx.length;
      }

        return naturalCompare(file1.name, file2.name);
      });

      return currFiles;
    }

function onDeleteFile(e){

    delete state.files[e.target.parentElement.id];
    props.handleFiles(retrieveOrderedFiles());
}

function convertFileSizeFormat(bytes){
    const units = ["B", "KB", "MB", "GB", "TB"];
    for(var i = 0; i < units.length; i++){
      if(bytes >= 1024){
          bytes /= 1024;
      } else{
        break;
      }
      
    }
    return `${Number(bytes).toFixed(0)}${units[i]}`;
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
                  <section style={{display: Object.keys(state.files).length > 0 ? null: "none"}}>
                    <strong> Uploaded Files ({Object.keys(state.files).length}):</strong>
                    <ul className="Accepted">
                      {retrieveOrderedFiles().map( (file, i) => (
                        <li id={`${file.name}`}>
                          <a href={onPreviewImage(file)} target="_blank" rel="noopener noreferrer">
                          {`${file.name} (${convertFileSizeFormat(file.size)})`}
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