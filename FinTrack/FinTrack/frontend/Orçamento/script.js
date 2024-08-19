document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('authToken');

    if (!token) {
        // Redirecionar para a página de login se não estiver autenticado
        window.location.href = '/login.html';
    } else {
        // Carregar dados iniciais
        loadBudgetData();
        loadTransactionData();

        // Configurar evento para definir orçamento
        document.getElementById('setBudgetButton').addEventListener('click', async function () {
            const budgetData = {
                categoria: document.getElementById('category').value.toUpperCase(),
                valor: parseFloat(document.getElementById('budgetAmount').value)
            };
            await setBudget(budgetData);
        });
    }
});

// Função para carregar dados de orçamento
async function loadBudgetData() {
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
        const budgetData = await response.json();
        updateBudgetPieChart(budgetData);
        updateBudgetTable(budgetData);
    } catch (error) {
        console.error('Erro ao carregar orçamentos:', error);
        if (error.message === 'Unauthorized') {
            window.location.href = '/login.html';
        }
    }
}

// Função para carregar transações
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
        updateSpendingChart(transactions);
    } catch (error) {
        console.error('Erro ao carregar transações:', error);
        if (error.message === 'Unauthorized') {
            window.location.href = '/login.html';
        }
    }
}

// Função para definir orçamento
async function setBudget(budgetData) {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch('http://localhost:3000/api/orcamento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(budgetData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao definir orçamento');
        }

        loadBudgetData(); // Atualiza os dados após definir orçamento
    } catch (error) {
        console.error('Erro ao definir orçamento:', error);
    }
}

// Função para atualizar o gráfico de pizza do orçamento
function updateBudgetPieChart(budgetData) {
    const categories = {};
    budgetData.forEach(item => {
        categories[item.categoria] = item.valor;
    });

    const ctx = document.getElementById('budgetPieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Orçamento por Categoria',
                data: Object.values(categories),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const label = tooltipItem.label || '';
                            const value = tooltipItem.raw;
                            return `${label}: R$ ${value.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

// Função para atualizar o gráfico de gastos
function updateSpendingChart(transactions) {
    const categories = {};
    let totalSpending = 0;

    transactions.forEach(transaction => {
        if (!categories[transaction.categoria]) {
            categories[transaction.categoria] = 0;
        }
        categories[transaction.categoria] += transaction.valor;
        totalSpending += transaction.valor;
    });

    // Atualizar gráfico de gastos
    const ctx = document.getElementById('spendingChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Gastos por Categoria',
                data: Object.values(categories),
                backgroundColor: '#36A2EB',
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value;
                        }
                    }
                }
            }
        }
    });
}

// Função para atualizar a tabela de orçamento
function updateBudgetTable(budgetData) {
    const tbody = document.getElementById('budgetTableBody');
    tbody.innerHTML = '';
    budgetData.forEach(item => {
        const status = item.gasto > item.valor ? 'Acima do Orçamento' : 'Dentro do Orçamento';
        const row = `<tr>
            <td>${item.mes}</td>
            <td>${item.categoria}</td>
            <td>R$ ${item.valor.toFixed(2)}</td>
            <td>R$ ${item.estipulado.toFixed(2)}</td>
            <td>R$ ${item.gasto.toFixed(2)}</td>
            <td>${status}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}
