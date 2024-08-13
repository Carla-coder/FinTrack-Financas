document.addEventListener('DOMContentLoaded', function () {
    // Carregar dados iniciais
    loadTransactionData();

    // Configurar evento para salvar transação
    document.getElementById('saveTransactionButton').addEventListener('click', async function () {
        const transactionData = {
            usuarioId: 1, // Ajuste conforme necessário
            data: document.getElementById('transactionDate').value,
            descricao: document.getElementById('transactionDescription').value,
            categoria: document.getElementById('transactionCategory').value.toUpperCase(),
            valor: parseFloat(document.getElementById('transactionAmount').value)
        };
        await saveTransaction(transactionData);
    });
});

// Função para carregar transações
async function loadTransactionData() {
    try {
        const response = await fetch('http://localhost:3000/api/transacao');
        if (!response.ok) {
            throw new Error('Erro ao carregar transações');
        }
        const transactions = await response.json();
        updateDashboard(transactions); // Atualize o dashboard com as transações carregadas
        displayTransactions(transactions); // Exiba as transações na tabela
    } catch (error) {
        console.error('Erro ao carregar transações:', error);
    }
}

// Função para salvar transação
async function saveTransaction(transactionData) {
    try {
        const response = await fetch('http://localhost:3000/api/transacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao salvar transação');
        }

        // Fechar modal e atualizar a lista de transações
        document.getElementById('addTransactionModal').querySelector('.btn-close').click();
        loadTransactionData(); // Atualize a lista de transações
    } catch (error) {
        console.error('Erro ao salvar transação:', error);
    }
}

// Função para atualizar o dashboard
function updateDashboard(transactions) {
    let balance = 0;
    let expenses = 0;

    transactions.forEach(transaction => {
        if (transaction.categoria === 'INCOME') {
            balance += transaction.valor;
        } else if (transaction.categoria === 'EXPENSE') {
            balance -= transaction.valor;
            expenses += Math.abs(transaction.valor); // Adiciona o valor absoluto dos gastos
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
