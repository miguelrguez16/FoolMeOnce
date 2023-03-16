import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

import { useParams } from "react-router-dom";
import ElectoralPromise from "../Components/ElectoralPromise/ElectoralPromise";

import SpinnerCustom from "../Components/SpinnerCustom/SpinnerCustom";
import NoPage from "./NoPage";

function SingleElectoralPromise({ electoralManager, userAccount }) {
  const { tokenId } = useParams();
  const [loading, setLoading] = useState(true);
  const [promise, setPromise] = useState();
  const [value, setValue] = useState();
  const loadPromise = async () => {
    const itemTmp = await electoralManager.listElectoralPromises(tokenId);
    debugger;
    const response = await fetch(itemTmp.tokenUri);
    const metadata = await response.json();
    const relationalPromises = metadata.relationalPromises || "";
    let item = {
      id: itemTmp.id.toNumber(),
      nameAuthor: itemTmp.nameAuthor,
      created: itemTmp.created.toNumber(),
      approved: itemTmp.dateApproved.toNumber(),
      isApproved: itemTmp.isApproved,
      tituloPromesa: itemTmp.tituloPromesa,
      relationalPromises,
      imageElectoralPromise: metadata.imageElectoralPromise,
      listaTemas: metadata.listaTemas,
      descriptionPromesa: metadata.descriptionPromesa,
      listElectoralPromises: metadata.listElectoralPromises,
    };
    setValue(`http://localhost:3000/listado/{item.id}`);
    setPromise(item);
    setLoading(false);
  };
  useEffect(() => {
    loadPromise();
  }, []);

  if (loading) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <SpinnerCustom />
      </main>
    );
  }

  return (
    <div className="padding-basic">
      <ElectoralPromise
        id={promise.id}
        tituloPromesa={promise.tituloPromesa}
        fecha={promise.created}
        isApproved={promise.isApproved}
        descriptionPromesa={promise.descriptionPromesa}
        imagen={promise.imageElectoralPromise}
        autor={promise.nameAuthor}
        isObligatory={promise.isObligatory}
        relationalPromises={promise.relationalPromises}
        listaTemas={promise.listaTemas}
        className="only-tarjeta"
      />
      <QRCode
        size={256}
        style={{ height: "auto" }}
        value={value}
        viewBox={`0 0 256 256`}
      />
    </div>
  );
}

export default SingleElectoralPromise;
