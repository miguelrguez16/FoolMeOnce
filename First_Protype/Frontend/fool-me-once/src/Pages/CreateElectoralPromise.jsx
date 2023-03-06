import React, { useState } from "react";

// Componentes Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// IPFS
import { create } from "ipfs-http-client";

// conect to localhost
const clientIpfs = create({
  host: "localhost",
  port: "5001",
  protocol: "http",
});

function CreateElectoralPromise({ electoralManager }) {
  // TODO: cuando se pueda
  // RELACION

  const [tituloPromesa, setTituloPromesa] = useState("");
  const [descriptionPromesa, setDescriptionPromesa] = useState("");
  const [isObligatory, setIsObligatory] = useState(false);
  const [listElectoralPromise, setListElectoraPromise] = useState([]);
  const [imageElectoralPromise, setImageElectoralPromise] = useState("");

  // upload the image to
  const uploadImageToIpfs = async (event) => {
    event.preventDefault();
    const currentFile = event.target.files[0];
    if (typeof currentFile !== "undefined") {
      try {
        const cid = await clientIpfs.add(currentFile);
        setImageElectoralPromise(`http://127.0.0.1:8080/ipfs/${cid.path}`);
        debugger;
      } catch (error) {
        console.log("ipfs image uploadToIpfs error: ", error);
      }
    }
  };

  // Verificación datos
  const verifiedElectoralPromise = async () => {
    // Check info
    if (!tituloPromesa || !descriptionPromesa || !listElectoralPromise) {
      debugger;
      console.log();
      return;
    } else {
      const resultCreate = await clientIpfs.add(
        JSON.stringify({
          imageElectoralPromise,
          tituloPromesa,
          descriptionPromesa,
        })
      );
      createNewElectoralPromise(resultCreate);
    }
  };

  const createNewElectoralPromise = async (result) => {
    debugger;
    console.log(`
        URI: ${result}
        tituloPromesa: ${tituloPromesa}
        descriptionPromesa: ${descriptionPromesa}
        listElectoralPromise: ${listElectoralPromise}
      `);
    const uri = `http://127.0.0.1:8080/ipfs/${result.path}`;

    const newEPid = await electoralManager.createElectoralPromise(
      uri,
      isObligatory,
      listElectoralPromise
    );

    console.log(newEPid);
  };

  return (
    <div className="create-promise">
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
            onChange={(e) => setDescriptionPromesa(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPromesaImage">
          <Form.Label>¿Deseas añadir una imagen?</Form.Label>
          <Form.Control
            type="file"
            name="file"
            onChange={uploadImageToIpfs}
          ></Form.Control>
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
        <div className="g-grid px-0">
          <Button
            onClick={verifiedElectoralPromise}
            variant="primary"
            size="lg"
          >
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CreateElectoralPromise;
