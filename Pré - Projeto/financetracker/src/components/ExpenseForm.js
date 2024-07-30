import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

export const ExpenseForm = ({ onAddExpense, onClose }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddExpense = () => {
    if (!name || !category || !amount) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const expense = {
      name,
      category,
      amount: parseFloat(amount),
    };

    onAddExpense(expense);
    setName('');
    setCategory('');
    setAmount('');
    onClose(); // Fechar o modal após adicionar a despesa
  };

  return (
    <FormContainer>
      <h2>Registrar Gasto</h2>
      <Input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="" disabled>Selecione a Categoria</option>
        <option value="Alimentação">Alimentação</option>
        <option value="Lazer">Lazer</option>
        <option value="Estudo">Estudo</option>
        <option value="Domiciliar">Domiciliar</option>
        <option value="Transporte">Transporte</option>
      </Select>
      <Input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button onClick={handleAddExpense}>Adicionar</Button>
    </FormContainer>
  );
};

export const ExpenseModal = ({ onClose, onAddExpense }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ExpenseForm onAddExpense={onAddExpense} onClose={onClose} />
      </ModalContent>
    </ModalOverlay>
  );
};