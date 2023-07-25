import React, { useState, useEffect } from "react";

// Components
import SpinnerCustom from "../Components/SpinnerCustom/SpinnerCustom";
import ElectoralPromise from "../Components/ElectoralPromise/ElectoralPromise";

// utils
import { EMPTY_ARRAY } from "../utils";

function Listado({ electoralManager, userAccount }) {
  const [promises, setPromises] = useState(EMPTY_ARRAY);
  const [loading, setLoading] = useState(true);

  const handleDataUri = async (tokenUri) => {
    const response = await fetch(tokenUri);
    return await response.json();
  };

  const loadListedItems = async () => {
    const all = await electoralManager.getAllPromises();

    let listedElectoralPromise = [];
    for (let i = 0; i < all.length; i++) {
      let element = all[i];
      const metadata = await handleDataUri(element.tokenUri);
      const relationalPromises = metadata.relationalPromises || "";
      let descriptionPromesa = metadata.descriptionPromesa;
      if (descriptionPromesa.length > 50) {
        descriptionPromesa = descriptionPromesa.slice(0, 50).concat("...");
      }
      if (descriptionPromesa.startsWith("#")) {
        descriptionPromesa = descriptionPromesa.slice(
          1,
          descriptionPromesa.length
        );
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
        descriptionPromesa,
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
