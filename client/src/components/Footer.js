/**
 * Component for the footer used across the site.
 *
 * @summary Site footer.
 * @author Levente Horvath
 */

// Library imports
import React, { Component } from "react";

// CSS imports
import "../css/Footer.css";

class Footer extends Component {
    render() {
        return (
            <footer class="footer">
                <p> © Copyright 2021 Talke Lab, CMRR, UC San Diego. All Rights Reserved. </p>
            </footer>
        );
    }
}

export default Footer;
