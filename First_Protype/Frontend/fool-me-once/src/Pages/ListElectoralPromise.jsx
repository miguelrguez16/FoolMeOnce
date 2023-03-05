import React from "react";
import { useState, useEffect } from "react";

function ListElectoralPromise({ electoralManager, userAccount }) {
  const [listedElectoralPromise, setListedElectoralPromise] = useState([]);

  const loadListedItems = async () => {
    const totalElectoralPromise =
      await electoralManager.counterElectoralPromises();
  };

  useEffect(() => {
    loadListedItems();
  }, []);

  return (
    <>
      <h1> ListElectoralPromise</h1>
      <p> Total {listedElectoralPromise.length}</p>
    </>
  );
}

export default ListElectoralPromise;
