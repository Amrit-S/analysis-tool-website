/**
 * @description: Component contains all relevent code for rendering the site's Navigation Bar (NavBar), including 
 *               the component's responsivity to changes in browser width. The NavBar is responsible for providing easy
 *               linkage to all pages available on the domain. 
 */

// Library Imports
import React from 'react';

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

      return (
        <div className="Container">
            <main className="Main">
              {/* NavBar Left: Images/Logos */}
              <section className="Images">
                <picture>
                  <img src={CMRR} alt="CMRR Logo"/>
                </picture>
                <picture>
                  <a href="https://www.talkelab.ucsd.edu">
                    <img id="Talke" src={Talke} alt="Talke Group Logo"/>
                  </a>
                </picture>
              </section>
              {/* NavBar Right: Linked Domain Pages */}
              <section className="Pages">
                <a className={isPageActive("/segmentation")} href="/segmentation">Segmentation Overview</a>
                <a className={isPageActive("/")} href="/">Analysis Tool</a>
              </section>
          </main>
          {/* Seperator Underneath NavBar */}
          <hr className="Diviser"/>
        </div>
      );
  }