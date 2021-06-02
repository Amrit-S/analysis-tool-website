/**
 * Component contains all relevent code for rendering the site's Navigation Bar (NavBar), including
 * the component's responsivity to changes in browser width. The NavBar is responsible for providing easy
 * linkage to all pages available on the domain.
 * 
 * @summary Site's Navigation Bar.
 * @author Amrit Kaur Singh
 */

// Library Imports
import React from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { SITE_PAGES } from "../constants/links";

// CSS Imports
import "../css/NavBar.css";

// Media Imports
import CMRR from "../media/CMRR_Logo.png";
import Talke from "../media/Talke_Logo.png";

export default function NavBar() {
  
    // Adds the active class to the current page (determined by url), if the user is on that page 
    function isPageActive(pageToCheck) {
        return pageToCheck === window.location.pathname ? "active" : "";
    }

    // Returns the active dropdown class if a user is on a page in the dropwdown section, allowing for the wrapper 
    // title to be active as well 
    function isDropdownActive() {
        return isPageActive(SITE_PAGES.OVERVIEW_CNN) ||
            isPageActive(SITE_PAGES.OVERVIEW_SEGMENTATION)
            ? "dropdown"
            : null;
    }

    return (
        <div className="Container">
            <main className="Main">
                {/* NavBar Left: Images/Logos */}
                <section className="Images">
                    <picture>
                        <img src={CMRR} alt="CMRR Logo" />
                    </picture>
                    <picture>
                        <a
                            href="https://www.talkelab.ucsd.edu"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img id="Talke" src={Talke} alt="Talke Group Logo" />
                        </a>
                    </picture>
                </section>
                {/* NavBar Right - Pages */}
                <Nav className="Pages">
                    {/* Researchers */}
                    <Nav.Link
                        className={isPageActive(SITE_PAGES.RESEARCHERS)}
                        href={SITE_PAGES.RESEARCHERS}
                    >
                        Researchers
                    </Nav.Link>
                    {/* Dropdown */}
                    <NavDropdown
                        id={isDropdownActive()}
                        className={`dropdown-container`}
                        title="Model Overview"
                    >
                        {/* Segmentation */}
                        <NavDropdown.Item
                            className={`${isPageActive(
                                SITE_PAGES.OVERVIEW_SEGMENTATION
                            )} dropdown-page`}
                            href={SITE_PAGES.OVERVIEW_SEGMENTATION}
                        >
                            Segmentation
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        {/* CNN */}
                        <NavDropdown.Item
                            className={`${isPageActive(SITE_PAGES.OVERVIEW_CNN)} dropdown-page`}
                            href={SITE_PAGES.OVERVIEW_CNN}
                        >
                            CNN
                        </NavDropdown.Item>
                    </NavDropdown>
                    {/* Analysis Tool */}
                    <Nav.Link
                        className={isPageActive(SITE_PAGES.ANALYSIS_INPUT)}
                        href={SITE_PAGES.ANALYSIS_INPUT}
                    >
                        Analysis Tool{" "}
                    </Nav.Link>
                </Nav>
            </main>
            {/* Seperator Underneath NavBar */}
            <hr className="Diviser" />
        </div>
    );
}
