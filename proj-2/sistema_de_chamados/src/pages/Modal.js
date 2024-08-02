// src/pages/Modal.js
import React, { useState } from 'react';
import db from '../services/firebaseConnection'; // Certifique-se de que o caminho está correto

const Modal = ({ isOpen, close, onSave, content }) => {
  const [newCustomer, setNewCustomer] = useState('');

  const handleSave = async () => {
    try {
      await db.collection('customers').add({
        name: newCustomer,
        createdAt: new Date(),
      });
      onSave(); // Atualiza a lista de clientes
    } catch (error) {
      console.error("Error adding customer: ", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <h2>Add New Customer</h2>
      <input
        type="text"
        value={newCustomer}
        onChange={(e) => setNewCustomer(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={close}>Close</button>
    </div>
  );
};

export default Modal;
