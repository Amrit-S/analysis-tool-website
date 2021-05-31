/**
 * @description: Component contains all relevent code for rendering the site's Navigation Bar (NavBar), including
 *               the component's responsivity to changes in browser width. The NavBar is responsible for providing easy
 *               linkage to all pages available on the domain.
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
    /**
     * @description: Adds the active class to the current page (determined by url)
     * @return: Active Class, or Empty String
     **/
    function isPageActive(pageToCheck) {
        return pageToCheck === window.location.pathname ? "active" : "";
    }

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
                <Nav className="Pages">
                    <Nav.Link
                        className={isPageActive(SITE_PAGES.RESEARCHERS)}
                        href={SITE_PAGES.RESEARCHERS}
                    >
                        Researchers
                    </Nav.Link>
                    <NavDropdown
                        id={isDropdownActive()}
                        className={`dropdown-container`}
                        title="Model Overview"
                    >
                        <NavDropdown.Item
                            className={`${isPageActive(
                                SITE_PAGES.OVERVIEW_SEGMENTATION
                            )} dropdown-page`}
                            href={SITE_PAGES.OVERVIEW_SEGMENTATION}
                        >
                            Segmentation
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                            className={`${isPageActive(SITE_PAGES.OVERVIEW_CNN)} dropdown-page`}
                            href={SITE_PAGES.OVERVIEW_CNN}
                        >
                            CNN
                        </NavDropdown.Item>
                    </NavDropdown>
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
