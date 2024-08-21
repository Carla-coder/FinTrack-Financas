document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login.html';
    } else {
      loadTransactionData();
    }

    document.getElementById('budgetForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const category = document.getElementById('budgetCategory').value.trim().toUpperCase();
      const amount = parseFloat(document.getElementById('budgetAmount').value);

      if (category && !isNaN(amount)) {
        const response = await fetch('http://localhost:3000/api/orcamento', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            usuarioId: 1, // Ajuste conforme necessário
            categoria: category,
            valor: amount
          })
        });

        if (response.ok) {
          loadTransactionData();
          // Fechar o modal após adicionar o orçamento
          const addBudgetModal = bootstrap.Modal.getInstance(document.getElementById('addBudgetModal'));
          addBudgetModal.hide();
        } else {
          alert('Erro ao adicionar orçamento');
        }
      } else {
        alert('Por favor, preencha todos os campos corretamente.');
      }
    });
  });

  async function loadTransactionData() {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('http://localhost:3000/api/transacao', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Erro ao carregar transações');
      }
      const transactions = await response.json();
      renderTransactions(transactions);
      updateCharts(transactions);
      loadBudgetOverview();
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  }

  async function loadBudgetOverview() {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('http://localhost:3000/api/orcamento', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Erro ao carregar orçamentos');
      }
      const budgets = await response.json();
      const budgetOverview = document.getElementById('budgetOverview');
      budgetOverview.innerHTML = '';

      const budgetMap = {};

      budgets.forEach(budget => {
        const categoria = budget.categoria || 'N/A';
        const valor = typeof budget.valor === 'number' ? budget.valor : 0;
        budgetMap[categoria] = valor;

        const budgetElement = document.createElement('div');
        budgetElement.className = 'alert alert-info';
        budgetElement.textContent = `${categoria}: R$ ${valor.toFixed(2)}`;
        budgetOverview.appendChild(budgetElement);
      });

      // Atualiza o gráfico após carregar os orçamentos
      updateCharts(transactions);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
    }
  }

  function renderTransactions(transactions) {
    const historicoTable = document.getElementById('historicoTable');
    historicoTable.innerHTML = ''; // Limpa a tabela existente

    const budgetMap = {};
    const expenseMap = {};

    transactions.forEach(transaction => {
      if (transaction.categoria === 'RENDA') {
        return;
      }

      const categoria = transaction.categoria || 'N/A';
      const valor = typeof transaction.valor === 'number' ? transaction.valor : 0;

      if (!expenseMap[categoria]) {
        expenseMap[categoria] = { spent: 0 };
      }
      expenseMap[categoria].spent += valor;
    });

    updateTableWithBudgetData(budgetMap, expenseMap);
  }

  async function updateTableWithBudgetData(budgetMap, expenseMap) {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('http://localhost:3000/api/orcamento', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Erro ao carregar orçamentos');
      }
      const budgets = await response.json();

      const historicoTable = document.getElementById('historicoTable');
      budgets.forEach(budget => {
        const categoria = budget.categoria || 'N/A';
        const valorOrcado = typeof budget.valor === 'number' ? budget.valor : 0;

        const gastos = expenseMap[categoria] ? expenseMap[categoria].spent : 0;
        const status = gastos <= valorOrcado ? 'Dentro do Orçamento' : 'Acima do Orçamento';

        // Adiciona classes de cor
        const statusClass = gastos <= valorOrcado ? 'text-success' : 'text-danger';

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}</td>
          <td>${categoria}</td>
          <td>R$ ${valorOrcado.toFixed(2)}</td>
          <td>R$ ${gastos.toFixed(2)}</td>
          <td class="${statusClass}">${status}</td>
        `;
        historicoTable.appendChild(row);
      });
    } catch (error) {
      console.error('Erro ao atualizar tabela com dados de orçamento:', error);
    }
  }

  function updateCharts(transactions) {
    const ctx = document.getElementById('budgetDetailsChart').getContext('2d');

    const categories = {};
    transactions.forEach(transaction => {
      if (transaction.categoria === 'RENDA') return;

      const categoria = transaction.categoria || 'N/A';
      const valor = typeof transaction.valor === 'number' ? transaction.valor : 0;

      if (!categories[categoria]) {
        categories[categoria] = 0;
      }
      categories[categoria] += valor;
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    if (window.chart) {
      window.chart.destroy();
    }

    window.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Gastos por Categoria',
          data: data,
          backgroundColor: [
            'rgba(0, 123, 255, 0.7)',   // Azul vibrante
            'rgba(255, 193, 7, 0.7)',   // Amarelo vibrante
            'rgba(220, 53, 69, 0.7)',   // Vermelho vibrante
            'rgba(40, 167, 69, 0.7)'    // Verde vibrante
          ],
          borderColor: [
            'rgba(0, 123, 255, 1)',     // Azul
            'rgba(255, 193, 7, 1)',     // Amarelo
            'rgba(220, 53, 69, 1)',     // Vermelho
            'rgba(40, 167, 69, 1)'      // Verde
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        }
      }
    });
  }