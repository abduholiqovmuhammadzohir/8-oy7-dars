import React, { useEffect, useState } from 'react';
import './App.css';
import tel from "./assets/tel.png";
import { SlBasket } from "react-icons/sl";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

function App() {
  const [data, setData] = useState<Product[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("https://auth-rg69.onrender.com/api/products/all")
      .then(res => res.json())
      .then((el) => {
        setData(el);
        console.log(el);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Haqiqatan ham bu malumotni o'chirmoqchimisiz?")) {
      fetch(`https://auth-rg69.onrender.com/api/products/${id}`, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then((result) => {
          console.log('Deleted:', result);
          fetchData();
        })
        .catch(err => {
          console.error('Delete error:', err);
        })
    }
  };


  const handleSave = () => {
    fetch('https://auth-rg69.onrender.com/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setShowAlert(true);
        fetchData();
        setFormData({ name: '', price: '', description: '' }); 
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  };

  return (
    <>
      <div className="cards">
        <button className='plus' data-bs-toggle="modal" data-bs-target="#exampleModal">Malumot qo'shish</button>
        <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Malumot qo'shish</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input type="text" placeholder='Enter name' value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /><br />
                <input type="number" placeholder='Enter price' value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /><br />
                <input type="text" placeholder='Enter description' value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>Save information</button>
              </div>
            </div>
          </div>
        </div>
        {loading && <div className="loader">Loading...</div>}
        <div className="container">
          {
            data.map((todo, index) => (
              <div className='card' key={index}>
                <img src={tel} alt="" />
                <h1>{todo.name}</h1>
                <div className="savat">
                  <h2>${todo.price}</h2>
                  <h4> <SlBasket /></h4>
                </div>
                <h3>{todo.description}</h3>
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
}

export default App;
