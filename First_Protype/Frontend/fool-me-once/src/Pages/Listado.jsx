import React, { useState, useEffect } from "react";

// Components
import SpinnerCustom from "../Components/SpinnerCustom/SpinnerCustom";
import ElectoralPromise from "../Components/ElectoralPromise/ElectoralPromise";

// utils
import { EMPTY, EMPTY_ARRAY, SUSPENSION_POINTS, STRING_PAD } from "../utils.js";

function Listado({ electoralManager, userAccount }) {
  const [promises, setPromises] = useState(EMPTY_ARRAY);
  const [loading, setLoading] = useState(true);

  const handleDataUri = async (tokenUri) => {
    const response = await fetch(tokenUri);
    return await response.json();
  };

  const loadListedItems = async () => {
    const electoralPromises = await electoralManager.getAllPromises();

    let listedElectoralPromise = [];
    for (const element of electoralPromises) {
      const metadata = await handleDataUri(element.tokenUri);
      const relationalPromises = metadata.relationalPromises || EMPTY;
      let description = metadata.descriptionPromesa;
      if (description.length > 50) {
        description = description.slice(0, 50).concat(SUSPENSION_POINTS);
      }
      if (description.startsWith(STRING_PAD)) {
        description = description.slice(1, description.length);
      }
      let item = {
        id: element.id.toNumber(),
        idAuthor: element.idAuthor.toNumber(),
        nameAuthor: element.nameAuthor,
        namePoliticalParty: element.namePoliticalParty,
        isObligatory: element.isObligatory,
        isApproved: element.isApproved,
        relationalPromises,
        created: element.created.toNumber(),
        dateApproved: element.dateApproved.toNumber(),
        tituloPromesa: metadata.tituloPromesa,
        description,
        imageElectoralPromise: metadata.imageElectoralPromise,
        listaTemas: metadata.listaTemas,
      };
      listedElectoralPromise.push(item);
    }

    setPromises(listedElectoralPromise);
    setLoading(false);
  };

  useEffect(() => {
    loadListedItems();
  }, []);

  if (loading || !userAccount) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <SpinnerCustom />
      </main>
    );
  }

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Listado de Promesas electorales</h3>
      <div className="simple-container">
        {promises.length > 0 ? (
          <div className="visual-list">
            {promises.map((item, i) => (
              <ElectoralPromise
                className="container-tarjeta"
                electoralpromise={item}
                key={i}
              />
            ))}
          </div>
        ) : (
          <div className="empty-listed">
            Lo sentimos, no hemos encontrado ninguna promesa
          </div>
        )}
      </div>
    </div>
  );
}

export default Listado;
