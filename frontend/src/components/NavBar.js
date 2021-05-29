/**
 * @description: Component contains all relevent code for rendering the site's Navigation Bar (NavBar), including 
 *               the component's responsivity to changes in browser width. The NavBar is responsible for providing easy
 *               linkage to all pages available on the domain. 
 */

// Library Imports
import React from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';

// CSS Imports
import '../css/NavBar.css';

// Media Imports
import CMRR from '../media/CMRR_Logo.png';
import Talke from '../media/Talke_Logo.png';

export default function NavBar() {

    /**
     * @description: Adds the active class to the current page (determined by url)
     * @return: Active Class, or Empty String
     **/
    function isPageActive(pageToCheck) {
      return (pageToCheck === window.location.pathname) ? "active" : "";
     }

     /**
      * Returns an id if the dropdown should be set as active, as one of its pages is currently active. Otherwise
      * no id is set to indicate no activity is occuring in dropdown. The dropdown highlight is trickier to do, so this
      * is a current workaround being used.
      * 
      * @returns Id tag 
      */
     function isDropdownPageActive(){
       return (isPageActive("/cnn") || isPageActive("/segmentation")) ? "dropdown":null; 
     }

      return (
        <div className="Container">
            <main className="Main">
              {/* NavBar Left: Images/Logos */}
              <section className="Images">
                <picture>
                  <img src={CMRR} alt="CMRR Logo"/>
                </picture>
                <picture>
                  <a href="https://www.talkelab.ucsd.edu" target="_blank" rel="noopener noreferrer">
                    <img id="Talke" src={Talke} alt="Talke Group Logo"/>
                  </a>
                </picture>
              </section>
              {/* NavBar Right: Tabs */}
              <Nav className="Pages">
                  <Nav.Link className={isPageActive("/researchers")} href="/researchers">Researchers</Nav.Link>
                  {/* Dropdown */}
                  <NavDropdown id={isDropdownPageActive()} title="Model Overview" >
                    <NavDropdown.Item className={`${isPageActive("/segmentation")} dropdown-page`} href="/segmentation">Segmentation</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item className={`${isPageActive("/cnn")} dropdown-page`} href="/cnn">CNN</NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link className={isPageActive("/")} href="/">Analysis Tool </Nav.Link>
                </Nav>
          </main>
          {/* Seperator Underneath NavBar */}
          <hr className="Diviser"/>
        </div>
      );
  }