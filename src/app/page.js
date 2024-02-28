"use client";
import React, { useState } from "react";
import Constants from "./utilities/Constants";
import ItemCreateForm from "./components/ItemCreateForm";
import ItemUpdateForm from "./components/ItemUpdateForm";


export default function Home() {
  const [items, setItems] = useState([]);
  const [showingCreateNewItemForm, setShowingCreateNewItemForm] = useState(false);
  const [itemCurrentlyBeingUpdated, setItemCurrentlyBeingUpdated] = useState(null);

  function getItems() {
    const url = Constants.API_URL_GET_ALL_ITEMS;
    
    fetch(url, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(itemsFromServer => {
      setItems(itemsFromServer);
    })
    .catch((error)=> {
      console.log(error);
      alert(error);
    })
  }

  function deleteItem(id) {
    const url = Constants.API_URL_DELETE_ITEM_BY_ID + `/${id}`;
    
    fetch(url, {
      method: 'DELETE'
    })
    .then(response => response.status === 204 ? null : response.json())
    .then(responseFromServer => {
      console.log(responseFromServer);
      onItemDeleted(id);
    })
    .catch((error)=> {
      console.log(error);
      alert(error);
    })
  }

  return (
      <div className="container">
        <div className="row min-vh-100">
          <div className="col d-flex flex-column justify-content-center align-items-center">
            {(showingCreateNewItemForm === false && itemCurrentlyBeingUpdated === null) && (
            <div>
            <h1>Grocery list</h1>
            <div className="mt-5">
              <button onClick={getItems} className="btn btn-dark btn-lg w-100">Get items from server</button>
              <button onClick={() => setShowingCreateNewItemForm(true)} className="btn btn-secundary btn-lg w-100 mt-4">Create a new item</button>
            </div>
              </div>
            )}

          {(items.length > 0 && showingCreateNewItemForm === false && itemCurrentlyBeingUpdated === null) && renderItemsTable()}

          {showingCreateNewItemForm && <ItemCreateForm onItemCreated={onItemCreated} />}

          {itemCurrentlyBeingUpdated !== null && <ItemUpdateForm item={itemCurrentlyBeingUpdated} onItemUpdated={onItemUpdated} />}
        </div>
      </div>
      </div>
  );


  function renderItemsTable() {
    return(
      <div className="table-responsive mt-5">
        <table className="table table-bordered border-dark">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Amount</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
              <td scope="row">{item.id}</td>
              <td scope="row">{item.name}</td>
              <td scope="row">{item.amount}</td>
              <td>
                <button onClick={() => setItemCurrentlyBeingUpdated(item)} className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                <button onClick={() => { if(window.confirm(`Are you sure you want to delete item named "${item.name}"?`)) deleteItem(item.id) }} className="btn btn-secundary btn-lg">Delete</button>
              </td>
            </tr>
            ))}
          </tbody>
        </table>

        <button onClick={() => setItems([])} className="btn btn-dark btn-lg w-100">Empty React items array</button>
      </div>
    );
  }

  function onItemCreated(createdItem) {
    setShowingCreateNewItemForm(false);

    if (createdItem === null) {
      return;
    }

    alert(`Item successfully created. After clicking OK, your new item named "${createdItem.name}" will show up in the table below.`)

    getItems();
  }

  function onItemUpdated(updatedItem) {
    setItemCurrentlyBeingUpdated(null);

    if (updatedItem === null) {
      return;
    }

    let itemsCopy = [...items];

    const index = itemsCopy.findIndex((itemsCopyItem, currentIndex) => {
      if (itemsCopyItem.id === updatedItem.id) {
        return true;
      }
    });

    if (index !== -1) {
      itemsCopy[index] = updatedItem;
    }

    setItems(itemsCopy);

    alert(`Item successfully updated. After clicking OK, look for the item with the name "${updatedItem.name}".`)
  }
  
  function onItemDeleted(deletedItemItemId) {
    let itemsCopy = [...items];

    const index = itemsCopy.findIndex((itemsCopyItem, currentIndex) => {
      if (itemsCopyItem.id === deletedItemItemId) {
        return true;
      }
    });

    if (index !== -1) {
      itemsCopy.splice(index, 1);
    }

    setItems(itemsCopy);

    alert('Post successfully deleted. After clicking OK, look at the table below to see your item disappear.')
  }
}
