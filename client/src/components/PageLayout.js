/**
 * Component responsible for giving general structure to all pages on the site. Specifically, defines all static
 * parts of each page to prevent unnecessary imports.
 *
 * @summary Provides page layout structure for all site pages.
 * @author Amrit Kaur Singh
 */

import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function PageLayout(props) {
    return (
        <div className="page-layout">
            <div style={{ minHeight: "calc(100vh - 80px)" }}>
                <NavBar />
                {props.children}
            </div>
            {/* Footer guranteed to be on the bottom of the screen */}
            <Footer />
        </div>
    );
}
