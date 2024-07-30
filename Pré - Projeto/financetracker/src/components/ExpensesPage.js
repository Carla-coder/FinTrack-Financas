import React, { useState } from 'react';
import ExpensesList from './ExpensesList';
import { ExpenseModal } from './ExpenseForm';
import styled from 'styled-components';

const AddButton = styled.button`
  position: fixed;
  bottom: 120px;
  right: 120px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #218838;
  }
`;

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([
    { name: 'Supermercado', category: 'Alimentação', amount: 200 },
    { name: 'Cinema', category: 'Lazer', amount: 50 },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <ExpensesList expenses={expenses} />
      {isModalOpen && (
        <ExpenseModal onClose={() => setIsModalOpen(false)} onAddExpense={handleAddExpense} />
      )}
      <AddButton onClick={() => setIsModalOpen(true)}>+</AddButton>
    </div>
  );
};

export default ExpensesPage;