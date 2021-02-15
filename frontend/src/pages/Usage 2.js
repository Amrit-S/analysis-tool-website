import React, { Component} from 'react';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

class Usage extends Component {

    render (){

      return (

          <div>
              <NavBar/>
              <div style={{marginTop: "30px"}}>
                  This is the How To Use Page.
              </div>
              <Footer/>
          </div>

      )
    }
  }
  
  export default Usage;