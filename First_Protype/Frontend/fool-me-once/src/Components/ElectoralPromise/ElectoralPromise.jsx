import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";

import "./ElectoralPromise.css";
function ElectoralPromise({ electoralpromise, className, key }) {
  return (
    <div key={key} className={className}>
      <div className="tarjeta-representacion">
        <>
          <Link to={`/promise/${electoralpromise.id}`} className="idpromise">
            #{electoralpromise.id}
          </Link>
        </>
        <>
          {electoralpromise.nameAuthor} {electoralpromise.namePoliticalParty}
        </>
      </div>
      <>
        <b>{electoralpromise.tituloPromesa}</b>
      </>
      {electoralpromise.imageElectoralPromise.length > 1 ? (
        <div className="tarjeta-imagen">
          <img
            loading="lazy"
            src={electoralpromise.imageElectoralPromise}
            alt=""
          />
        </div>
      ) : (
        <></>
      )}
      <div>
        <>
          {electoralpromise.relationalPromises.toString().length > 1 ? (
            <b>
              Promesas Relacionadas:
              {electoralpromise.relationalPromises.toString()}
            </b>
          ) : (
            <></>
          )}
        </>
      </div>
      <div>
        <>
          {electoralpromise.listaTemas.toString().length > 1 ? (
            <>
              {electoralpromise.listaTemas.split(" ").map((element) => (
                <> #{element.toLocaleLowerCase()}</>
              ))}
            </>
          ) : (
            <></>
          )}
        </>
      </div>

      <div className="tarjeta-descripcion">
        {electoralpromise.descriptionPromesa.length > 1 ? (
          <>{electoralpromise.descriptionPromesa.toString()}</>
        ) : (
          <></>
        )}
      </div>
      <div>
        {electoralpromise.isObligatory === true ? <>Es Mandatorio </> : <></>}
        <Moment unix format="DD-MM-YYYY">
          {electoralpromise.created}
        </Moment>
      </div>
      <div>
        {electoralpromise.dateApproved === 0 ? (
          <>No aprobado</>
        ) : (
          <>
            Aprobado a fecha:
            <Moment unix format="DD-MM-YYYY">
              {electoralpromise.dateApproved}
            </Moment>
          </>
        )}
      </div>
    </div>
  );
}

export default ElectoralPromise;
