import React from "react";
import ReactDOM from "react-dom";
import MDEditor from "@uiw/react-md-editor";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";

import down from "../../assets/down-outline.gif";

import "./single-grid.css";

function Single({ electoralpromise, url }) {
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
        <h3 className="text-bold">{electoralpromise.tituloPromesa}</h3>
        {electoralpromise.nameAuthor} - {electoralpromise.namePoliticalParty}
        <div className="tarjeta-descripcion" data-color-mode="light">
          <MDEditor.Markdown source={electoralpromise.descriptionPromesa} />
        </div>
        <>
          <div>
            {electoralpromise.listaTemas.toString().length > 1 ? (
              <>
                Temas: <b>{electoralpromise.listaTemas.toString()}</b>
              </>
            ) : (
              <></>
            )}
          </div>
          <div>
            Creado a fecha:{" "}
            <b>
              <Moment unix format="DD-MM-YYYY HH:MM">
                {electoralpromise.created}
              </Moment>
            </b>
          </div>
          <div>
            {electoralpromise.isObligatory === true ? (
              <b>- Se debe cumplir</b>
            ) : (
              <></>
            )}
          </div>
        </>
        <div>
          {electoralpromise.relationalPromises.length > 0 ? (
            <>
              Promesas relacionadas:
              {electoralpromise.relationalPromises.map((elem, i) => (
                <Link to={`/listado/${elem}`} className="idpromise">
                  {i !== 0 ? <>, id:{elem}</> : <> id:{elem}</>}
                </Link>
              ))}
            </>
          ) : (
            <></>
          )}
        </div>
        <div>
          {electoralpromise.dateApproved === 0 ? (
            <>
              <img src={down} alt="down finger" style={{ height: "40px" }} />
              No Aprobado
            </>
          ) : (
            <>
              Aprobado a fecha:
              <Moment unix format="DD-MM-YYYY HH:MM">
                {electoralpromise.dateApproved}
              </Moment>
              <img
                src={down}
                alt="down finger"
                style={{ height: "40px" }}
                className="rotate-180"
              />
            </>
          )}
        </div>
        <div className="container-qr">
          <QRCode
            size={128}
            style={{ height: "auto" }}
            value={url}
            viewBox={`0 0 256 256`}
            className="qrstyle"
          />
        </div>
      </div>
    </div>
  );
}

export default Single;
