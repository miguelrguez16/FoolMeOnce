import React from "react";
import logo from "../../assets/undraw_voting.svg";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import "./Navigation.css";

function Navigation({ web3Handler, userAccount, idUser, connected }) {
  return (
    <Navbar expand="lg" variant="beige">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} width="70" height="50" className="" alt="" />
          &nbsp;&nbsp;&nbsp; <span className="brand">VOTUM</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar navbar-white bg-primary" />
        <Navbar.Collapse id="navbar navbar-white bg-primary">
          <Nav className="me-auto">
            <Nav className="me-auto">
              {userAccount !== "" && connected ? (
                <Nav.Link className="connected">Connected</Nav.Link>
              ) : (
                <Button onClick={web3Handler} variant="outline-danger">
                  Connect
                </Button>
              )}
            </Nav>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {userAccount !== "" ? (
              <Nav.Link as={Link} to="/promise">
                Listar
              </Nav.Link>
            ) : (
              <></>
            )}
            {idUser !== 0 ? (
              <Nav.Link as={Link} to="/create">
                Crear
              </Nav.Link>
            ) : (
              <></>
            )}
          </Nav>
          <Nav>
            {idUser !== 0 ? (
              <></>
            ) : (
              <Nav.Link as={Link} to="/register">
                Registrarse
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
