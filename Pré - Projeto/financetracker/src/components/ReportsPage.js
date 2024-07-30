import React from 'react';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Container = styled.div`
  padding: 20px;
`;

const ChartContainer = styled.div`
  margin: 20px 0;
`;

const ReportsPage = ({ expenses }) => {
  const getTotalByCategory = () => {
    const totals = {};

    expenses.forEach(expense => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0;
      }
      totals[expense.category] += expense.amount;
    });

    return totals;
  };

  const totalsByCategory = getTotalByCategory();
  const categories = Object.keys(totalsByCategory);
  const values = Object.values(totalsByCategory);

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Total de Gastos por Categoria',
        data: values,
        backgroundColor: 'rgba(40, 167, 69, 0.6)',
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 1,
      },
    ],
  };

  const getMaxExpense = () => {
    if (expenses.length === 0) return null;

    return expenses.reduce((max, expense) => (expense.amount > max.amount ? expense : max), expenses[0]);
  };

  const maxExpense = getMaxExpense();

  return (
    <Container>
      <h2>Relatórios de Despesas</h2>
      <ChartContainer>
        <Bar data={data} />
      </ChartContainer>
      {maxExpense && (
        <div>
          <h3>Maior Gasto</h3>
          <p>
            <strong>Nome:</strong> {maxExpense.name}
          </p>
          <p>
            <strong>Categoria:</strong> {maxExpense.category}
          </p>
          <p>
            <strong>Valor:</strong> R${maxExpense.amount.toFixed(2)}
          </p>
        </div>
      )}
      {/* Aqui você pode adicionar mais análises e relatórios conforme necessário */}
    </Container>
  );
};

export default ReportsPage;