import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";

import "./ElectoralPromise.css";
function ElectoralPromise({ electoralpromise, className }) {
  console.log(electoralpromise);
  return (
    <div className={className}>
      <div className="tarjeta-representacion">
        <div>
          <Link to={`/listado/${electoralpromise.id}`}>
            #{electoralpromise.id}
          </Link>
        </div>
      </div>
      <div className="tarjeta-imagen">
        <img src={electoralpromise.imageElectoralPromise} alt="" />
      </div>
      <div>{electoralpromise.tituloPromesa}</div>
      <div>{electoralpromise.relationalPromises.toString()}</div>
      <div>{electoralpromise.listaTemas}</div>

      <div className="tarjeta-descripcion">
        {electoralpromise.descriptionPromesa}
      </div>
      <div className="tarjeta-autor">
        <span>
          Por <i>{electoralpromise.nameAuthor}</i>- Partido:{" "}
          {electoralpromise.namePoliticalParty}
          {electoralpromise.isObligatory === true ? <>Es Mandatorio</> : <></>}
        </span>
        <Moment unix format="DD-MM-YYYY HH:MM">
          {electoralpromise.created}
        </Moment>
      </div>
      <div>
        {electoralpromise.dateApproved === 0 ? (
          <>No aprobado</>
        ) : (
          <>
            Aprobado a fecha:
            <Moment unix format="DD-MM-YYYY HH:MM">
              {electoralpromise.dateApproved}
            </Moment>
          </>
        )}
      </div>
    </div>
  );
}

export default ElectoralPromise;
