/**
 * Renders the mini navbar pressent on the /analysis-results page, allowing switch between 
 * individual and group results. Mantains own state, but also yields callback to parent
 * component once a page switch has been requested (i.e., Individual to Group).
 * 
 * @summary     Mini navbar on result page. 
 */
import React from 'react';
import "../css/ResultsNavBar.css";
import {Sections} from "../constants/Sections";

export default function ResultsNavBar({renderCallback}) {

        // tracks which section to show, default shows Individual 
        const[ showSection, setShowSection] = React.useState(Sections.INDIVUDAL); // true = Individual, false = Group

        // determines which page to show underline effect to indicate selected page
        function isActive(section){
            return section === showSection ? 'Selected-Section': '';
        }

        // switch section to show
        function updateResult(updatedSection){
            // update internally 
            renderCallback(updatedSection);
            // update externally to main page to rerender content
            setShowSection(updatedSection);
        }

      return (

          <>
            <section className="Wrap-Container Margin">
                <div className="Results-Title-Container">  <p> Results: </p> </div>
                <div className={`Section ${isActive(Sections.INDIVUDAL)}`} onClick={() => updateResult(Sections.INDIVUDAL)}> <p> Individual </p> </div>
                <div className={`Section ${isActive(Sections.GROUP)}`} onClick={() => updateResult(Sections.GROUP)}> <p> Group </p> </div>
                <div className={`Section ${isActive(Sections.TIPS)}`} onClick={() => updateResult(Sections.TIPS)}> <p> Analysis Tips </p> </div>
            </section>
            <hr className="Diviser-Mod Margin"/>
          </>

      )
  };