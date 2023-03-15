import React from "react";
import { useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Register({ electoralManager, setUserIdentifier }) {
  const [nameUser, setNameUser] = useState("");
  const [namePoliticalParty, setNamePoliticalParty] = useState("");
  const [isPOliticalParty, setIsPoliticalParty] = useState(false);

  const registerNewUser = async (event) => {
    event.preventDefault();

    console.log(`
      Nombre: [${nameUser}]
      namePoliticalParty: [${namePoliticalParty}]
      IsPolitical: [${isPOliticalParty}]
    `);

    const ide = await electoralManager.registerUser(
      nameUser,
      namePoliticalParty,
      isPOliticalParty
    );
    setUserIdentifier(ide);
  };

  return (
    <div className="register">
      <h3>Registra tu nombre o Partido Político</h3>
      <Form>
        {/* Nombre Completo */}
        <Form.Group className="mb-3" controlId="formRegisterName">
          <Form.Label>Nombre Completo</Form.Label>
          <Form.Control
            type="text"
            aria-required
            placeholder="Introduce tu nombre completo"
            onChange={(e) => setNameUser(e.target.value)}
          />
          <Form.Text className="text-muted">
            Tú nombre se verá reflejado en las promesas electorales
          </Form.Text>
        </Form.Group>
        {/* Nombre del Partido Político */}
        <Form.Group className="mb-3" controlId="formRegisterNamePoliticalParty">
          <Form.Label>Nombre del Partido Político</Form.Label>
          <Form.Control
            type="text"
            aria-required
            placeholder="Introduce nombre partido"
            onChange={(e) => setNamePoliticalParty(e.target.value)}
          />
          <Form.Text className="text-muted">
            Tú nombre se verá reflejado en las promesas electorales
          </Form.Text>
        </Form.Group>
        {/* Eres un Partido Político */}
        <Form.Group className="mb-3" controlId="formRegisterCheckbox">
          <Form.Check
            type="checkbox"
            label="Eres un Partido Político"
            onChange={(e) => setIsPoliticalParty(e.target.checked)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={registerNewUser}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Register;
