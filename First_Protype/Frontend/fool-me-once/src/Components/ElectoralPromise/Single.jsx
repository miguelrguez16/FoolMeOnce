import React from "react";
import Form from "react-bootstrap/Form";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./single-grid.css";

function Single({ electoralpromise }) {
  const navigate = useNavigate();

  return (
    <div className="layout-promesa">
      <div className="part1">
        {electoralpromise.imageElectoralPromise.length > 1 ? (
          <div className="only-tarjeta">
            <img
              loading="lazy"
              src={electoralpromise.imageElectoralPromise}
              alt="Imagen promesa"
            />
          </div>
        ) : (
          <>No hay Imagen</>
        )}
      </div>
      <div className="part2">
        <h3>{electoralpromise.tituloPromesa}</h3>
        {electoralpromise.nameAuthor} - {electoralpromise.namePoliticalParty}
        <div className="tarjeta-descripcion">
          <Form.Control
            readOnly
            type="textarea"
            as="textarea"
            rows={6}
            value={electoralpromise.descriptionPromesa}
          />
        </div>
        <>
          {" "}
          <div>
            Creado a fecha:
            <Moment unix format="DD-MM-YYYY HH:MM">
              {electoralpromise.created}
            </Moment>
          </div>
        </>
        <div>
          {electoralpromise.relationalPromises.length > 0 ? (
            <>
              {electoralpromise.relationalPromises.map((elem) => (
                <Link to={`/listado/${elem}`} className="idpromise">
                  #{elem}
                </Link>
              ))}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Single;
