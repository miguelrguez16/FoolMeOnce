import React from "react";
import Moment from "react-moment";

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
}) {
  const maxSize = 300;
  if (descriptionPromesa.length > maxSize) {
    descriptionPromesa = descriptionPromesa.slice(0, maxSize);
    descriptionPromesa = descriptionPromesa.concat("...");
  }
  return (
    <div className="container-tarjeta">
      <div className="tarjeta-representacion">
        <div>#{id}</div>
      </div>
      <div className="tarjeta-imagen">
        <img src={imagen} alt="" />
      </div>
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
