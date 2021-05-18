import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function PageLayout(props) {
    return (
        <div>
            <div style={{minHeight: "calc(100vh - 80px)"}}>
                <NavBar />
                {props.children}
            </div>
            <Footer />
        </div>
    );
}