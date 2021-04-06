import React from 'react';
import "../css/ResultsNavBar.css";

export default function ResultsNavBar(props) {

        // tracks which section to show, default shows Individual 
        const[ showIndividual, setShowIndividual] = React.useState(true); // true = Individual, false = Group

        // dtermines which page to show underline effect to indicate selected page
        function isActive(individualSection){
            return individualSection === showIndividual ? 'Selected-Section': '';
        }

        // switch section to show
        function updateResult(){
            // update internally 
            props.renderCallback(!showIndividual);
            // update externally to main page to rerender content
            setShowIndividual(!showIndividual);
        }

      return (

          <>
            <section className="Wrap-Container Margin">
                <div className="Results-Title-Container">  <p> Results: </p> </div>
                <div className={`Section ${isActive(true)}`} onClick={updateResult}> <p> Individual </p> </div>
                <div className={`Section ${isActive(false)}`} onClick={updateResult}> <p> Group </p> </div>
            </section>
            <hr className="Diviser-Mod Margin"/>
          </>

      )
  };