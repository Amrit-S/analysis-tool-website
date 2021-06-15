import React, { Component } from "react";
import ResearcherProfile from "../components/Researchers/ResearcherProfile";
import { FaLinkedin, FaExternalLinkAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import AmritHeadshot from "../media/Amrit.png";
import LeventeHeadshot from "../media/Levente.png";

import "../css/Researchers.css";

class Researchers extends Component {
    render() {
        return (
            <div className="Researchers-Container">
                <section className="Researchers">
                    <h2 className="header"> Main Researchers </h2>
                    <section className="Profiles">
                        <ResearcherProfile name="Amrit K. Singh" img={AmritHeadshot}>
                            B.S. Computer Science,
                            {"\n"}
                            UC San Diego
                            {"\n"}
                            {"\n"}
                            <FaLinkedin className="icon" />{" "}
                            <a
                                href="https://www.linkedin.com/in/amrit-kaur-singh"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                amrit-kaur-singh
                            </a>
                            {"\n"}
                            <MdEmail className="icon" />{" "}
                            <a href="mailto:aksingh@ucsd.edu">aksingh@ucsd.edu</a>
                        </ResearcherProfile>
                        <ResearcherProfile name="Levente Horvath" img={LeventeHeadshot}>
                            B.S. Computer Science,
                            {"\n"}
                            UC San Diego
                            {"\n"}
                            {"\n"}
                            <FaLinkedin className="icon" />{" "}
                            <a
                                href="https://www.linkedin.com/in/levente-horvath-06a2271b6/"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                levente-horvath
                            </a>
                            {"\n"}
                            <MdEmail className="icon" />{" "}
                            <a href="mailto:lhorvath@ucsd.edu">lhorvath@ucsd.edu</a>
                        </ResearcherProfile>
                    </section>
                </section>
                <section className="Advisors">
                    <h2 className="header"> Project Advisors </h2>
                    <section className="Profiles">
                        <ResearcherProfile
                            name="Dr. Gerrit Melles"
                            img={
                                "https://static.wixstatic.com/media/085c48_a8f9be4a2fca471b93bda8e6d3fdd982~mv2.jpg/v1/crop/x_57,y_17,w_201,h_200/fill/w_281,h_278,al_c,lg_1,q_80/DSC_0874-Gerrit-website-300-x-300-300x30.webp"
                            }
                        >
                            NIIOS Netherlands Institute for Innovative Ocular Surgery
                            {"\n\n"}
                            <FaExternalLinkAlt />{" "}
                            <a
                                href="https://www.niios.com/niios/team/"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                {" "}
                                NIIOS Website
                            </a>
                        </ResearcherProfile>
                        <ResearcherProfile
                            name="Alex Phan, PhD"
                            img={
                                "https://static.wixstatic.com/media/085c48_4b46d621c07b4b90b24a156cb880c62a~mv2.png/v1/fill/w_432,h_438,al_c,q_85,usm_0.66_1.00_0.01/screenshot.webp"
                            }
                        >
                            Project Scientist, MAE
                        </ResearcherProfile>
                        <ResearcherProfile
                            name="Frank E. Talke"
                            img={"https://cmrr.ucsd.edu/_images/profiles/talke.jpg"}
                        >
                            CMRR Endowed Chair Professor, Department of MAE
                            {"\n\n"}
                            <FaExternalLinkAlt />{" "}
                            <a
                                href="https://cmrr.ucsd.edu/research/faculty-profiles/talke.html"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                {" "}
                                CMRR Profile
                            </a>
                        </ResearcherProfile>
                    </section>
                </section>
            </div>
        );
    }
}

export default Researchers;
