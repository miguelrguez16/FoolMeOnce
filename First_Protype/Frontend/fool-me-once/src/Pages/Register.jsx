import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Components Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// utils
import { EMPTY, ROUTE_CREATE, EMPTY_ARRAY } from "../utils";

function Register({ electoralManager, setIdUser }) {
  const navigate = useNavigate();
  const [nameUser, setNameUser] = useState(EMPTY);
  const [namePoliticalParty, setNamePoliticalParty] = useState(EMPTY);
  const [isPoliticalParty, setIsPoliticalParty] = useState(false);
  const [dataToSelect, setDataToSelect] = useState(EMPTY_ARRAY);

  const loadPoliticalPartiesNames = async () => {
    const promises = await electoralManager.getAllPromises();
    const politicalParties = new Set();

    promises.forEach((promise) => {
      politicalParties.add(promise["namePoliticalParty"]);
    });
    setDataToSelect(Array.from(politicalParties));
  };

  const registerNewUser = async (event) => {
    event.preventDefault();

    if (
      nameUser.trim().length !== 0 &&
      namePoliticalParty.trim().length !== 0
    ) {
      const ide = await electoralManager.registerUser(
        nameUser,
        namePoliticalParty,
        isPoliticalParty
      );
      if (ide !== 0) {
        setIdUser(ide);
        navigate(ROUTE_CREATE);
      } else {
        alert("Ups: algo fue mal");
      }
    }
  };

  useEffect(() => {
    loadPoliticalPartiesNames();
  });

  const setSelectedToInput = (event) => {
    var input = document.getElementById("namePoliticalPartyInput");
    if (event.target.value !== "Selecciona uno existente:") {
      input.value = event.target.value;
    } else {
      input.value = "";
    }
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
        <Form.Group className="mb-3">
          <Form.Label>Nombre del Partido Político</Form.Label>
          <Form.Select onChange={(e) => setSelectedToInput(e)}>
            <option>Selecciona uno existente:</option>
            {dataToSelect.map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
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
