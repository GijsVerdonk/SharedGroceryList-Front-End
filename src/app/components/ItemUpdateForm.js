import React, { useState } from 'react'
import Constants from '../utilities/Constants'

export default function ItemUpdateForm(props) {
  const initialFormData = Object.freeze({
    name: props.item.name,
    amount: props.item.amount
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

        const itemToUpdate = {
          id: props.item.id,
          name: formData.name,
          amount: formData.amount
        };

        const url = Constants.API_URL_UPDATE_ITEM + `/${props.item.id}`;

        fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(itemToUpdate)
        })
        .then(response => response.status === 204 ? null : response.json())
        .then(responseFromServer => {
          console.log(responseFromServer);
        })
        .catch((error)=> {
          console.log(error);
          alert(error);
        });

        props.onItemUpdated(itemToUpdate);
    };

  return (
    <form className="w-100 px-5">
    <h1 className="mt-5">Update item named "{props.item.name}".</h1>
    
    <div className="mt-5">
        <label className="h3 form-label">Name</label>
        <input value={formData.name} name="name" type="text" className="form-control" onChange={handleChange} />
    </div>

    <div className="mt-4">
        <label className="h3 form-label">Amount</label>
        <input value={formData.amount} name="amount" type="number" className="form-control" onChange={handleChange} />
    </div>

    <button onClick={handleSubmit} className='btn btn-dark btn-lg w-100 mt-5'>Submit</button>
    <button onClick={() => props.onItemUpdated(null)} className='btn btn-secundary btn-lg w-100 mt-3'>Cancel</button>
</form>
  );
}
