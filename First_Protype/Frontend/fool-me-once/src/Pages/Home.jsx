import React from "react";
import Card from "react-bootstrap/Card";
import logo from "../assets/undraw_voting.svg";
import candidateLogo from "../assets/undraw_candidate.svg";
import userLogo from "../assets/undraw_browsing.svg";

function Home() {
  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        <span className="brand">votum</span>
      </h1>
      <h5 style={{ textAlign: "center" }}>
        Plataforma para la creación y verificación de Promesas Electorales.
      </h5>
      <main id="main-home">
        <section>
          <Card className="cards-presentation">
            <Card.Img variant="top" src={userLogo} bsPrefix="logo-tarjeta" />
            <Card.Title style={{ textAlign: "center" }}>
              ¿Nuevo Usuario?
            </Card.Title>
            <Card.Body style={{ textAlign: "justify" }}>
              Solo conecta tu Wallet y podrás ver cualquier promesa electoral de
              los partidos, sin <b>pagar nada</b>.
            </Card.Body>
          </Card>
        </section>
        <section>
          <Card className="cards-presentation">
            <Card.Img variant="top" src={candidateLogo} />
            <Card.Title style={{ textAlign: "center" }}>
              ¿Nuevo Político?
            </Card.Title>
            <Card.Body style={{ textAlign: "justify" }}>
              Conecta to Wallet, regístrate y comienza a grabar en la blockchain
              tus promesas electorales.
            </Card.Body>
          </Card>
        </section>
      </main>
    </>
  );
}

export default Home;
