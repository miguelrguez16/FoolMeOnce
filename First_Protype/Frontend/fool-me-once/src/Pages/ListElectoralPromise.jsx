import React, { useState, useEffect } from "react";

import SpinnerCustom from "../Components/SpinnerCustom/SpinnerCustom";
import ElectoralPromise from "../Components/ElectoralPromise/ElectoralPromise";

function ListElectoralPromise({ electoralManager, userAccount }) {
  const [listedElectoralPromise, setListedElectoralPromise] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadListedItems = async () => {
    const all = await electoralManager.getAllPromises();
    let listedElectoralPromise = [];
    for (let indx = 0; indx < all.length; indx++) {
      const id = all[indx].id.toNumber();
      const nameAuthor = all[indx].nameAuthor;
      const isObligatory = all[indx].isObligatory;
      const isApproved = all[indx].isApproved;
      const relationalPromises = all[indx].relationalPromises;
      const created = all[indx].created.toNumber();
      const response = await fetch(all[indx].tokenUri);
      const metadata = await response.json();
      let item = {
        id,
        nameAuthor,
        isObligatory,
        isApproved,
        relationalPromises,
        created,
        tituloPromesa: metadata.tituloPromesa,
        descriptionPromesa: metadata.descriptionPromesa,
        imageElectoralPromise: metadata.imageElectoralPromise,
      };
      listedElectoralPromise.push(item);

      // item.descriptionPromesa =
      //   "Prometo mejorar la aplicación puliendo defectos y añadiéndole más funcionalidad Prometo mejorar la aplicación puliendo defectos y añadiéndole más funcionalidadPrometo mejorar la aplicación puliendo defectos y añadiéndole más funcionalidadPrometo mejorar la aplicación puliendo defectos y añadiéndole más funcionalidadPrometo mejorar la aplicación puliendo defectos y añadiéndole más funcionalidadPrometo mejorar la aplicación puliendo defectos y añadiéndole más funcionalidad. Saludos";
      // listedElectoralPromise.push(item);
    }
    setListedElectoralPromise(listedElectoralPromise);
    setLoading(false);
  };

  useEffect(() => {
    loadListedItems();
  }, []);

  if (loading) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <SpinnerCustom />
      </main>
    );
  }

  return (
    <div>
      {/* <h3>Listado de Promesas electorales</h3> */}
      <div className="simple-container">
        {listedElectoralPromise.length >= 0 ? (
          <div className="visual-list">
            {listedElectoralPromise.map((item, indice) => (
              <ElectoralPromise
                id={item.id}
                tituloPromesa={item.tituloPromesa}
                fecha={item.created}
                isApproved={item.isApproved}
                descriptionPromesa={item.descriptionPromesa}
                imagen={item.imageElectoralPromise}
                autor={item.nameAuthor}
                isObligatory={item.isObligatory}
                relationalPromises={item.relationalPromises}
              />
            ))}
          </div>
        ) : (
          <>Na</>
        )}
      </div>
    </div>
  );
}

export default ListElectoralPromise;
