import React, { Component} from 'react';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

class Custom404 extends Component {

    render (){

      return (

          <div>
              <NavBar/>
              <div style={{marginTop: "30px"}}>
                  Custom 404 page because CSE134B says its a thing :)
              </div>
              <Footer/>
          </div>

      )
    }
  }
  
  export default Custom404;