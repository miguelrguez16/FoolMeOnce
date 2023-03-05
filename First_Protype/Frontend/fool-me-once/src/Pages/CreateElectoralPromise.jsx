import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function CreateElectoralPromise({ electoralManager }) {
  // TODO: cuando se pueda
  // function createElectoralPromise(
  //         string memory _tokenURI,
  //         bool _isObligatory,
  //         uint256[] memory _relationalPromises
  //     ) external returns (uint256) {
  // TITULO DE LA PROMESA ELECTORAL
  // DESCRIPCION
  // RELACION

  const [tituloPromesa, setTituloPromesa] = useState("");
  const [descripcionPromesa, setDescripcionPromesa] = useState("");
  const [isObligatory, setIsObligatory] = useState(false);
  const [listElectoralPromise, setListElectoraPromise] = useState([]);

  return (
    <div className="register">
      <h3> CreateElectoralPromise</h3>
      <Form>
        <Form.Group className="mb-3" controlId="formTituloPromesa">
          <Form.Label>Título de la promesa</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Introduce el título "
            onChange={(e) => setTituloPromesa(e.target.value)}
          />
          <Form.Text className="text-muted">
            Tú nombre se verá reflejado en las promesas electorales
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label>Descripción de la promesa</Form.Label>
          <Form.Control
            required
            type="textarea"
            as="textarea"
            rows={5}
            placeholder="Introduce la descripción de la promesa "
            onChange={(e) => setDescripcionPromesa(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPromesaObligatoria">
          <Form.Check
            required
            type="checkbox"
            label="Sera de debido Cumplimiento"
            defaultChecked={true}
            onChange={(e) => setIsObligatory(e.target.checked)}
          />
        </Form.Group>
        {/* <Button variant="primary" type="submit" onClick={registerNewUser}>
          Submit
        </Button> */}
      </Form>
    </div>
  );
}

export default CreateElectoralPromise;
