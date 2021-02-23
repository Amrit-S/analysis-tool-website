import React, { Component} from 'react';
import { Snackbar } from '@material-ui/core';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

import DropBox from '../components/DropBox';

const config = require('../config');
//const BACKEND_URL = config.backend.uri;

export default function AnalysisInput() {
        
      return (

          <div>
              <NavBar/>
              <div style={{marginTop: "30px"}}>
                  This is the Data Retrieval Page for Analysis.
              </div>
              <DropBox/>
              <Footer/>
          </div>

      )
  }
  
//   export default AnalysisInput;