// src/pages/Home.js
import React, { useState, useEffect } from 'react';

const Home = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        // Carregar os itens do localStorage ao iniciar
        const storedItems = JSON.parse(localStorage.getItem('shoppingList')) || [];
        setItems(storedItems);
    }, []);

    const addItem = () => {
        if (newItem.trim() && quantity > 0) {
            const newItems = [...items, { id: Date.now(), name: newItem, quantity, bought: false }];
            setItems(newItems);
            localStorage.setItem('shoppingList', JSON.stringify(newItems));
            setNewItem('');
            setQuantity('');
        }
    };

    const deleteItem = (id) => {
        const filteredItems = items.filter(item => item.id !== id);
        setItems(filteredItems);
        localStorage.setItem('shoppingList', JSON.stringify(filteredItems));
    };

    const editItem = (id) => {
        const editedName = prompt("Edit item name:", items.find(item => item.id === id).name);
        const editedQuantity = prompt("Edit item quantity:", items.find(item => item.id === id).quantity);
        if (editedName && editedQuantity) {
            const editedItems = items.map(item => (item.id === id ? { ...item, name: editedName, quantity: editedQuantity } : item));
            setItems(editedItems);
            localStorage.setItem('shoppingList', JSON.stringify(editedItems));
        }
    };

    const toggleBought = (id) => {
        const updatedItems = items.map(item => (item.id === id ? { ...item, bought: !item.bought } : item));
        setItems(updatedItems);
        localStorage.setItem('shoppingList', JSON.stringify(updatedItems));
    };

    return (
        <div className="container mt-4" style={{ backgroundColor: 'var(--light-gray)', padding: '20px', borderRadius: '5px' }}>
            <h2 style={{ color: 'var(--secondary-color)' }}>Lista de Compras</h2>
            <div className="input-group mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    value={newItem} 
                    onChange={(e) => setNewItem(e.target.value)} 
                    placeholder="Nome do item"
                    style={{ borderColor: 'var(--primary-color)' }}
                />
                <input 
                    type="number" 
                    className="form-control" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    placeholder="Quantidade"
                    style={{ borderColor: 'var(--primary-color)' }}
                />
                <button className="btn btn-primary" onClick={addItem}>Adicionar Item</button>
            </div>
            <ul className="list-group">
                {items.map(item => (
                    <li key={item.id} className={`list-group-item ${item.bought ? 'list-group-item-success' : ''}`}>
                        {item.name} - {item.quantity}
                        <div className="btn-group float-end">
                            <button className="btn btn-warning btn-sm" onClick={() => editItem(item.id)}>Editar</button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item.id)}>Excluir</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => toggleBought(item.id)}>
                                {item.bought ? 'Desmarcar' : 'Marcar como Comprado'}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;

