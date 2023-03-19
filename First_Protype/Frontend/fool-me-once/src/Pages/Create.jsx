import React, { useState } from "react";

// Componentes Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Otros Componentes
import TablePromises from "../Components/Tabla/TablaPromesas";

// Router
import { useNavigate } from "react-router-dom";

// IPFS
import { create } from "ipfs-http-client";

// conect to localhost
const clientIpfs = create({
  host: "localhost",
  port: "5001",
  protocol: "http",
});

function Create({ electoralManager }) {
  const navigate = useNavigate();

  const [tituloPromesa, setTituloPromesa] = useState("");
  const [descriptionPromesa, setDescriptionPromesa] = useState("");
  const [isObligatory, setIsObligatory] = useState(true);
  const [relationalPromises, setRelationalPromises] = useState([]);
  const [imageElectoralPromise, setImageElectoralPromise] = useState("");
  const [listaTemas, setListaTemas] = useState([]);

  // upload the image to
  const uploadImageToIpfs = async (event) => {
    event.preventDefault();
    const currentFile = event.target.files[0];
    if (typeof currentFile !== "undefined") {
      try {
        const cid = await clientIpfs.add(currentFile);
        setImageElectoralPromise(`http://127.0.0.1:8080/ipfs/${cid.path}`);
      } catch (error) {
        console.log("ipfs image uploadToIpfs error: ", error);
      }
    }
  };

  // Verificación datos
  const verifiedElectoralPromise = async () => {
    if (
      !tituloPromesa ||
      !descriptionPromesa ||
      !relationalPromises ||
      !listaTemas
    ) {
      return;
    } else {
      const resultCreate = await clientIpfs.add(
        JSON.stringify({
          imageElectoralPromise,
          tituloPromesa,
          descriptionPromesa,
          relationalPromises,
          listaTemas,
        })
      );
      createNewElectoralPromise(resultCreate);
    }
  };

  const createNewElectoralPromise = async (result) => {
    console.log(`
        URI: [${result}]
        tituloPromesa: [${tituloPromesa}]
        descriptionPromesa: [${descriptionPromesa}]
        listElectoralPromise: [${relationalPromises}]
        listaTemas: [${listaTemas}]
      `);
    const uri = `http://127.0.0.1:8080/ipfs/${result.path}`;

    const newEPid = await electoralManager.createElectoralPromise(
      uri,
      isObligatory
    );
    let total = await electoralManager.counterElectoralPromises();
    navigate(`/listado/${total.toNumber()}`);
  };

  return (
    <div className="container-create">
      <h3>Crear una nueva promesa</h3>
      <Form className="create-promise">
        {/* className="create-promise" titulo de la promesa */}
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
        {/* Tipo de obligatoriedad */}
        <Form.Group className="mb-3" controlId="formPromesaObligatoria">
          <Form.Check
            required
            type="checkbox"
            label="Será de debido Cumplimiento"
            defaultChecked={true}
            onChange={(e) => setIsObligatory(e.target.checked)}
          />
        </Form.Group>
        {/* añadir una imagen */}
        <Form.Group className="mb-3" controlId="formPromesaImage">
          <Form.Label>¿Deseas añadir una imagen?</Form.Label>
          <Form.Control
            type="file"
            name="file"
            onChange={uploadImageToIpfs}
          ></Form.Control>
        </Form.Group>
        {/* Temas */}
        <Form.Group className="mb-3">
          <Form.Label>Temas que trata la promesa</Form.Label>
          <Form.Control
            type="text"
            placeholder="Escribe una palabra..."
            onChange={(e) => setListaTemas(e.target.value)}
          />
        </Form.Group>
        {/* Descripcion */}
        <Form.Group>
          <Form.Label>Descripción de la promesa</Form.Label>
          <Form.Control
            required
            type="textarea"
            as="textarea"
            rows={6}
            placeholder="Introduce la descripción de la promesa "
            onChange={(e) => setDescriptionPromesa(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPromesaObligatoria">
          <Form.Label>Promesas Relacionadas:</Form.Label>
          <TablePromises
            electoralManager={electoralManager}
            addRelationalPromises={setRelationalPromises}
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

export default Create;
