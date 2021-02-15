import React, { Component} from 'react';

import '../css/NavBar.css';

class NavBar extends Component {

    render (){

      return (

        <div class="topnav">
            <a href="/overview">Model Overview</a>
            <a href="/usage">How to Use</a>
            <a href="/">Analysis Tool</a>
        </div>

      )
    }
  }
  
  export default NavBar;