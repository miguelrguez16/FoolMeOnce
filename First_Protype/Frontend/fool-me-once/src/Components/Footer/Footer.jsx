import React from "react";
import logo from "../../assets/undraw_voting.svg";
import "./Footer.css";

function Footer() {
  return (
    <>
      <footer className="footer">
        <img src={logo} />
        &nbsp;&nbsp;&nbsp;©&nbsp;<span className="brand">VOTUM</span>
        &nbsp;-&nbsp;{new Date().getFullYear()}
        &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;
        <a href="https://github.com/miguelrguez16">Miguel Rodríguez González</a>
      </footer>
    </>
  );
}

export default Footer;
