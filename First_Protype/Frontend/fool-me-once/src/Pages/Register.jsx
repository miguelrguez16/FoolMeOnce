import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Register({ electoralManager, setIdUser }) {
  const navigate = useNavigate();
  const [nameUser, setNameUser] = useState("");
  const [namePoliticalParty, setNamePoliticalParty] = useState("");
  const [isPOliticalParty, setIsPoliticalParty] = useState(false);
  const [dataToSelect, setdataToSelet] = useState([]);

  const loadPoliticalpartiesNames = async () => {
    const bigData = await electoralManager.getAllPromises();
    const mySet1 = new Set();
    debugger;
    bigData.forEach((element) => {
      mySet1.add(element["namePoliticalParty"]);
    });
    console.log(mySet1);
    setdataToSelet(Array.from(mySet1));
  };

  const registerNewUser = async (event) => {
    event.preventDefault();

    console.log(`
      -> Nombre: [${nameUser}]
      -> namePoliticalParty: [${namePoliticalParty}]
      -> IsPolitical: [${isPOliticalParty}]
    `);

    if (
      nameUser.trim().length !== 0 &&
      namePoliticalParty.trim().length !== 0
    ) {
      const ide = await electoralManager.registerUser(
        nameUser,
        namePoliticalParty,
        isPOliticalParty
      );
      if (ide !== 0) {
        setIdUser(ide);
        navigate("/create");
      } else {
        alert("Ups: algo fue mal");
      }
    }
  };

  useEffect(() => {
    loadPoliticalpartiesNames();
  }, []);

  const setSelectedToInput = (event) => {
    debugger;
    var input = document.getElementById("namePoliticalPartyInput");
    if (event.target.value !== "Selecciona uno existente:") {
      input.value = event.target.value;
    } else {
      input.value = "";
    }
  };

  return (
    <div className="register">
      <button onClick={() => navigate("/listado")}></button>
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
        <Form.Group className="mb-3">
          <Form.Label>Nombre del Partido Político</Form.Label>
          <Form.Select onChange={(e) => setSelectedToInput(e)}>
            <option>Selecciona uno existente:</option>
            {dataToSelect.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </Form.Select>
          <Form.Control
            id="namePoliticalPartyInput"
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
