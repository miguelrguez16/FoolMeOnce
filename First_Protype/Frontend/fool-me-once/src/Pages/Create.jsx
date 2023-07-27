import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

// Components Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Otros Componentes
import TablePromises from "../Components/Tabla/TablaPromesas";
import "../assets/create.css";

// Router
import { useNavigate } from "react-router-dom";

// IPFS
import { create } from "ipfs-http-client";

// utils
import {
  localClientIpfs,
  URL_LOCAL_IPFS,
  ROUTE_PROMISE_TOKEN,
  EMPTY,
  EMPTY_ARRAY,
} from "../utils";

// connect to localhost
const clientIpfs = create({
  host: localClientIpfs.host,
  port: localClientIpfs.port,
  protocol: localClientIpfs.protocol,
});

function Create({ electoralManager }) {
  const navigate = useNavigate();
  const [tituloPromesa, setTituloPromesa] = useState(EMPTY);
  const [descriptionPromesa, setDescriptionPromesa] = useState(EMPTY);
  const [isObligatory, setIsObligatory] = useState(true);
  const [relationalPromises, setRelationalPromises] = useState(EMPTY_ARRAY);
  const [imageElectoralPromise, setImageElectoralPromise] = useState(EMPTY);
  const [listaTemas, setListaTemas] = useState(EMPTY_ARRAY);

  // upload the image to
  const uploadImageToIpfs = async (event) => {
    event.preventDefault();
    const currentFile = event.target.files[0];
    if (typeof currentFile !== "undefined") {
      try {
        const cid = await clientIpfs.add(currentFile);
        setImageElectoralPromise(URL_LOCAL_IPFS.concat(cid.path));
      } catch (error) {
        console.log("ipfs image uploadToIpfs error: ", error);
      }
    }
  };

  // Verificación datos
  const verifiedElectoralPromise = async () => {
    if (!tituloPromesa || !descriptionPromesa || !listaTemas) {
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
    const uri = URL_LOCAL_IPFS.concat(result.path);

    const newEPid = await electoralManager.createElectoralPromise(
      uri,
      isObligatory
    );

    console.log(await newEPid.wait(1));
    let total =
      (await electoralManager.counterElectoralPromises()).toNumber() - 1;
    console.log("total: ", total);

    navigate(ROUTE_PROMISE_TOKEN.concat(total));
  };

  return (
    <div className="container-create">
      <h3>Crear una nueva promesa</h3>

      <Form className="display-layout">
        <div className="form1">
          <Form.Group controlId="formTituloPromesa">
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
          <Form.Group controlId="formPromesaObligatoria">
            <Form.Check
              required
              type="checkbox"
              label="Será de debido Cumplimiento"
              defaultChecked={true}
              onChange={(e) => setIsObligatory(e.target.checked)}
            />
          </Form.Group>
          <Form.Group controlId="formPromesaImage">
            <Form.Label>¿Deseas añadir una imagen?</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              name="file"
              onChange={uploadImageToIpfs}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Temas que trata la promesa</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe una palabra..."
              onChange={(e) => setListaTemas(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Descripción de la promesa</Form.Label>
            <>
              <div data-color-mode="light">
                <MDEditor
                  height={200}
                  value={descriptionPromesa}
                  preview="edit"
                  onChange={(e) => setDescriptionPromesa(e)}
                />
              </div>
            </>
          </Form.Group>
          <div className="set-button-position">
            <Button
              onClick={verifiedElectoralPromise}
              variant="primary"
              size="lg"
            >
              Create
            </Button>
          </div>
        </div>
        <div className="form2">
          <Form.Group controlId="formPromesaObligatoria">
            <Form.Label>Promesas Relacionadas:</Form.Label>
            <TablePromises
              electoralManager={electoralManager}
              addRelationalPromises={setRelationalPromises}
            />
          </Form.Group>
        </div>
      </Form>
    </div>
  );
}

export default Create;
