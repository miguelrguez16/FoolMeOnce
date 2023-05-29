import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Single from "../Components/ElectoralPromise/Single";

import SpinnerCustom from "../Components/SpinnerCustom/SpinnerCustom";

function SingleElectoralPromise({ electoralManager, userAccount }) {
  const { tokenId } = useParams();
  const [loading, setLoading] = useState(true);
  const [promise, setPromise] = useState();
  const [value, setValue] = useState();
  const loadPromise = async () => {
    const element = await electoralManager.listElectoralPromises(tokenId);
    const response = await fetch(element.tokenUri);
    const metadata = await response.json();
    const relationalPromises = metadata.relationalPromises || "";
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
      descriptionPromesa: metadata.descriptionPromesa,
      imageElectoralPromise: metadata.imageElectoralPromise,
      listaTemas: metadata.listaTemas,
    };
    setValue(`http://localhost:3000/promise/${item.id}`);
    setPromise(item);
    setLoading(false);
  };
  useEffect(() => {
    loadPromise();
  }, [tokenId, userAccount]);

  if (loading) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <SpinnerCustom />
      </main>
    );
  }

  return (
    <div className="padding-basic">
      <Single electoralpromise={promise} url={value} />
    </div>
  );
}

export default SingleElectoralPromise;
