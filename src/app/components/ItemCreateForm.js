import React, { useState } from 'react'
import Constants from '../utilities/Constants'

export default function ItemCreateForm(props) {
  const initialFormData = Object.freeze({
    name: "Item X",
    amount: 1
  });

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const itemToCreate = {
          id: 0,
          name: formData.name,
          amount: formData.amount
        };

        const url = Constants.API_URL_CREATE_ITEM;

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(itemToCreate)
        })
        .then(response => response.json())
        .then(responseFromServer => {
          console.log(responseFromServer);
        })
        .catch((error)=> {
          console.log(error);
          alert(error);
        });

        props.onItemCreated(itemToCreate);
    };

  return (
    <form className="w-100 px-5">
    <h1 className="mt-5">Create new item</h1>
    
    <div className="mt-5">
        <label className="h3 form-label">Name</label>
        <input value={formData.name} name="name" type="text" className="form-control" onChange={handleChange} />
    </div>

    <div className="mt-4">
        <label className="h3 form-label">Amount</label>
        <input value={formData.amount} name="amount" type="number" className="form-control" onChange={handleChange} />
    </div>

    <button onClick={handleSubmit} className='btn btn-dark btn-lg w-100 mt-5'>Submit</button>
    <button onClick={() => props.onItemCreated(null)} className='btn btn-secundary btn-lg w-100 mt-3'>Cancel</button>
</form>
  );
}
