import React from "react";
import Card from "react-bootstrap/Card";
import logo from "../assets/undraw_voting.svg";

function Home() {
  return (
    <>
      <main className="main-home">
        <h1>
          Bienvenido a <span className="brand">VOTUM</span>
        </h1>
        <section>
          <Card style={{ width: "25em" }}>
            <Card.Img variant="top" src={logo} bsPrefix="logo-tarjeta" />
            <Card.Title>&nbsp;&nbsp;&nbsp;Mi promesa Electoral</Card.Title>
            <Card.Body>
              Plataforma para la creación y Verificación de promesas
              Electorales.
            </Card.Body>
            <Card.Footer>Por Miguel Rodríguez González</Card.Footer>
          </Card>
        </section>
      </main>
    </>
  );
}

export default Home;
