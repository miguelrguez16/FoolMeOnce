import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";

import "./ElectoralPromise.css";
function ElectoralPromise({
  id,
  tituloPromesa,
  fecha,
  isApproved,
  descriptionPromesa,
  relationalPromises,
  imagen,
  autor,
  isObligatory,
  listaTemas,
  className,
}) {
  return (
    <div className={className}>
      <div className="tarjeta-representacion">
        <div>
          <Link to={`/listado/${id}`}>#{id}</Link>
        </div>
      </div>
      <div className="tarjeta-imagen">
        <img src={imagen} alt="" />
      </div>
      <div>{tituloPromesa}</div>
      <div>{relationalPromises.toString()}</div>
      <div>{listaTemas}</div>

      <div className="tarjeta-descripcion">{descriptionPromesa}</div>
      <div className="tarjeta-autor">
        <span>
          Por <i>{autor}</i>
        </span>
        <Moment unix format="DD-MM-YYYY">
          {fecha}
        </Moment>
      </div>
    </div>
  );
}

export default ElectoralPromise;
