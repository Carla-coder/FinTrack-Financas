document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('authToken');

    if (!token) {
        // Redirecionar para a página de login se não estiver autenticado
        window.location.href = '/login.html';
    } else {
        // Carregar dados iniciais
        loadTransactionData();

        // Configurar evento para salvar transação
        document.getElementById('saveTransactionButton').addEventListener('click', async function () {
            const transactionData = {
                usuarioId: 1, // Ajuste conforme necessário, idealmente obtido do token
                data: document.getElementById('transactionDate').value,
                descricao: document.getElementById('transactionDescription').value,
                categoria: document.getElementById('transactionCategory').value.toUpperCase(),
                valor: parseFloat(document.getElementById('transactionAmount').value)
            };
            await saveTransaction(transactionData);
        });
    }
});

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
        updateDashboard(transactions);
        displayTransactions(transactions);
        updateCharts(transactions); // Atualiza todos os gráficos
    } catch (error) {
        console.error('Erro ao carregar transações:', error);
        if (error.message === 'Unauthorized') {
            // Redirecionar para login se a autenticação falhar
            window.location.href = '/login.html';
        }
    }
}

// Função para salvar transação
async function saveTransaction(transactionData) {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch('http://localhost:3000/api/transacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(transactionData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao salvar transação');
        }

        document.getElementById('addTransactionModal').querySelector('.btn-close').click();
        loadTransactionData(); // Atualiza os dados e gráficos após salvar
    } catch (error) {
        console.error('Erro ao salvar transação:', error);
    }
}

// Função para atualizar o dashboard
function updateDashboard(transactions) {
    let balance = 0;
    let expenses = 0;

    transactions.forEach(transaction => {
        if (transaction.categoria === 'RENDA') {
            balance += transaction.valor;
        } else if (['ALIMENTACAO', 'TRANSPORTE', 'UTILIDADES', 'ENTRETENIMENTO'].includes(transaction.categoria)) {
            balance -= transaction.valor;
            expenses += transaction.valor;
        }
    });

    document.getElementById('currentBalance').textContent = `R$ ${balance.toFixed(2)}`;
    document.getElementById('monthlyExpenses').textContent = `R$ ${expenses.toFixed(2)}`;
}

// Função para exibir transações
function displayTransactions(transactions) {
    const tbody = document.getElementById('transactionTableBody');
    tbody.innerHTML = '';
    transactions.forEach(transaction => {
        const row = `<tr>
            <td>${new Date(transaction.data).toLocaleDateString()}</td>
            <td>${transaction.descricao}</td>
            <td>${transaction.categoria}</td>
            <td>R$ ${transaction.valor.toFixed(2)}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Função para atualizar os gráficos
function updateCharts(transactions, updateCategories = true) {
    const categories = {};
    let income = 0;
    let totalExpenses = 0;

    transactions.forEach(transaction => {
        if (transaction.categoria === 'RENDA') {
            income += transaction.valor;
        } else {
            if (!categories[transaction.categoria]) {
                categories[transaction.categoria] = 0;
            }
            categories[transaction.categoria] += transaction.valor;
            totalExpenses += transaction.valor;
        }
    });

    // Atualizar gráfico de fluxo de caixa
    const cashFlowChartContext = document.getElementById('cashFlowChart').getContext('2d');
    new Chart(cashFlowChartContext, {
        type: 'line',
        data: {
            labels: ['Renda', 'Gastos'],
            datasets: [{
                label: 'Fluxo de Caixa',
                data: [income, -totalExpenses],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
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

    // Atualizar gráfico de categorias se necessário
    if (updateCategories) {
        const expensePieChartContext = document.getElementById('expensePieChart').getContext('2d');
        new Chart(expensePieChartContext, {
            type: 'pie',
            data: {
                labels: ['Alimentação', 'Transporte', 'Utilidades', 'Entretenimento'],
                datasets: [{
                    label: 'Despesas por Categoria',
                    data: [
                        categories['ALIMENTACAO'] || 0,
                        categories['TRANSPORTE'] || 0,
                        categories['UTILIDADES'] || 0,
                        categories['ENTRETENIMENTO'] || 0
                    ],
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
}
