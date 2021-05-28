import React, { Component} from 'react';
import InsanityMeme from '../media/404_Insanity_Meme.png';

import "../css/Custom404.css";

class Custom404 extends Component {

    render (){

      return (

          <div className="Custom-404">
              <div className="meme">
                 <img src={InsanityMeme} alt="Albert Einstein deems machine learning as insanity."></img>
              </div>
              <div className="message">
                <h1> 404 </h1>
                <p>
                    Uh oh, seems like this page doesn't exist. Try clicking on a page on the Navigation Bar; otherwise enjoy the meme. 
                </p>
              </div>
          </div>

      )
    }
  }
  
  export default Custom404;