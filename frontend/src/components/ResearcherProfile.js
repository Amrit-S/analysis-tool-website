import React from 'react';
import "../css/ResearcherProfile.css";

export default function ResearcherProfile(props) {

      return (

        <div className="Researcher-Profile">
            <img className="images" src={props.img} alt="head-shot"></img>
            <p className="name"> {props.name}</p>
            <p className="info"> 
                {props.children}
            </p>
         </div>

      )
  };