import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  margin: 50px auto;
  width: 100%;
  max-width: 800px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #28a745;
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const ExpensesList = ({ expenses }) => {
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Nome</TableHeaderCell>
            <TableHeaderCell>Categoria</TableHeaderCell>
            <TableHeaderCell>Valor</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {Array.isArray(expenses) && expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <TableRow key={index}>
                <TableCell>{expense.name}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>R$ {expense.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="3">Sem despesas para mostrar.</TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default ExpensesList;
