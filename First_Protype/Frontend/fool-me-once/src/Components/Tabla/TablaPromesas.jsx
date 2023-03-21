import React, { useState, useEffect } from "react";
import "./TablaPromesas.css";

function TablePromises({ electoralManager, addRelationalPromises }) {
  const [listaElementos, setListaElementos] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const loadListedItems = async () => {
    const all = await electoralManager.getAllPromises();
    let listaElementos = [];
    // need id, titulo, author, description
    for (let i = 0; i < all.length; i++) {
      const id = all[i].id.toNumber();
      const nameAuthor = all[i].nameAuthor;
      const response = await fetch(all[i].tokenUri);
      const metadata = await response.json();
      let item = {
        id,
        nameAuthor,
        tituloPromesa: metadata.tituloPromesa,
        descriptionPromesa: metadata.descriptionPromesa
          .slice(0, 50)
          .concat("..."),
      };
      listaElementos.push(item);
    }
    setListaElementos(listaElementos);
  };

  const addRemoveElectoralPromise = (event) => {
    if (event.target.checked) {
      selectedItems.push(event.target.value);
    } else {
      selectedItems.pop(event.target.value);
    }
    addRelationalPromises(selectedItems);
  };

  useEffect(() => {
    loadListedItems();
  }, []);

  return (
    <table style={{ background: "white" }}>
      <thead>
        <tr>
          <th>Seleccionar</th>
          <th>ID</th>
          <th>Título</th>
          <th>Autor</th>
          <th>Descripción</th>
        </tr>
      </thead>
      {listaElementos.length > 0 ? (
        <tbody>
          {listaElementos.map((item, indice) => (
            <tr key={indice}>
              <td key={indice}>
                <input
                  type="checkbox"
                  name={indice}
                  value={item.id}
                  onChange={(event) => addRemoveElectoralPromise(event)}
                />
              </td>
              <td>#{item.id}</td>
              <td>{item.tituloPromesa}</td>
              <td>{item.nameAuthor}</td>
              <td>{item.descriptionPromesa}</td>
            </tr>
          ))}
        </tbody>
      ) : (
        <tbody>
          <tr>
            <td> No Elements to show </td>
          </tr>
        </tbody>
      )}
    </table>
  );
}

export default TablePromises;
