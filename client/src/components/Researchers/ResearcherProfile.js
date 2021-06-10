/**
 * Provides layout for one reseracher profile on the Researchers page. Constructs profile, filling in information using
 * props.
 *
 * Researchers.js utilizes this component heavily.
 *
 * @summary Layout for one researcher.
 * @author Amrit Kaur Singh
 */

import React from "react";
import "../../css/ResearcherProfile.css";

export default function ResearcherProfile(props) {
    return (
        <div className="Researcher-Profile">
            <img className="images" src={props.img} alt="head-shot"></img>
            <p className="name"> {props.name}</p>
            <p className="info">{props.children}</p>
        </div>
    );
}
