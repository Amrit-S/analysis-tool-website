/**
 * Renders the mini navbar pressent on the /analysis-results page, allowing switch between
 * individual and group results. Mantains own state, but also yields callback to parent
 * component once a page switch has been requested (i.e., Individual to Group).
 *
 * @summary     Mini navbar on result page.
 */
import React from "react";
import "../css/InputInstructions.css";

import example1 from "../media/example1.jpeg";
import example2 from "../media/example2.jpeg";

export default function InputInstructions(props) {
    // tracks which section to show, default shows Individual
    const [showInstructions, setshowInstructions] = React.useState(true); // true = Individual, false = Group

    // dtermines which page to show underline effect to indicate selected page
    function isActive(instructionsSection) {
        return instructionsSection === showInstructions ? "Selected-Section" : "";
    }

    // switch section to show
    function updateResult() {
        // update externally to main page to rerender content
        setshowInstructions(!showInstructions);
    }

    return (
        <div className="Root-Container">
            <section className="Mini-NavBar">
                <div className={`Section ${isActive(true)}`} onClick={updateResult}>
                    {" "}
                    <p> Instructions </p>{" "}
                </div>
                <div
                    style={{ marginLeft: "35px" }}
                    className={`Section ${isActive(false)}`}
                    onClick={updateResult}
                >
                    {" "}
                    <p> Example </p>{" "}
                </div>
            </section>
            {showInstructions ? (
                <section className="Instructions-Container">
                    <p style={{ whiteSpace: "pre-wrap" }}>
                        {" "}
                        Drag and drop endothelial images into the upload box.
                        {"\n"}
                        <span style={{ color: "red" }}> Note: </span> Any images uploaded will not
                        be collected by the site.
                    </p>
                    <p style={{ textDecoration: "underline" }}> Upload Requirements: </p>
                    <ul>
                        <li>
                            {" "}
                            <p>
                                {" "}
                                Must have an image based extension (.jpeg, .png, .jpg, etc.){" "}
                            </p>{" "}
                        </li>
                        <li>
                            {" "}
                            <p>
                                {" "}
                                All filenames must be in format <i> MM.DD.extension </i> where MM
                                indicates # months elapse from surgery date{" "}
                            </p>{" "}
                        </li>
                        <li>
                            {" "}
                            <p>
                                {" "}
                                All images must be solely focused on the cellular region, avoiding
                                any blurs or extra dark space{" "}
                            </p>{" "}
                        </li>
                    </ul>
                </section>
            ) : (
                <section className="Example-Container">
                    <figure>
                        <img src={example1} alt="Example #1" />
                        <figcaption>
                            <p> 6.00.png </p>
                            <p>
                                {" "}
                                <i> Photo taken 6 months and 0 days after surgery</i>{" "}
                            </p>
                        </figcaption>
                    </figure>
                    <figure>
                        <img src={example2} alt="Example #2" />
                        <figcaption>
                            <p> 17.08.png </p>
                            <p>
                                {" "}
                                <i> Photo taken 17 months and 8 days after surgery</i>{" "}
                            </p>
                        </figcaption>
                    </figure>
                </section>
            )}
        </div>
    );
}
