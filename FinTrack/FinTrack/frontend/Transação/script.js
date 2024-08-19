<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('authToken');

    if (!token) {
        // Redirecionar para a página de login se não estiver autenticado
        window.location.href = '/login.html';
    } else {
        // Carregar dados iniciais
        loadTransactionData();

        // Configurar eventos para salvar e editar transações
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

        document.getElementById('updateTransactionButton').addEventListener('click', async function () {
            const transactionData = {
                descricao: document.getElementById('editTransactionDescription').value,
                valor: parseFloat(document.getElementById('editTransactionAmount').value)
            };
            const transactionId = document.getElementById('editTransactionId').value;
            await updateTransaction(transactionId, transactionData);
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
        updateCharts(transactions);
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

// Função para atualizar transação
async function updateTransaction(transactionId, transactionData) {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`http://localhost:3000/api/transacao/${transactionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(transactionData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao atualizar transação');
        }

        document.getElementById('editTransactionModal').querySelector('.btn-close').click();
        loadTransactionData(); // Atualiza os dados e gráficos após atualização
    } catch (error) {
        console.error('Erro ao atualizar transação:', error);
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
            <td>
                <button class="btn btn-warning btn-sm" onclick="openEditModal('${transaction.id}', '${transaction.descricao}', ${transaction.valor})">Editar</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Função para abrir o modal de edição
function openEditModal(id, descricao, valor) {
    document.getElementById('editTransactionId').value = id;
    document.getElementById('editTransactionDescription').value = descricao;
    document.getElementById('editTransactionAmount').value = valor;
    const editModal = new bootstrap.Modal(document.getElementById('editTransactionModal'));
    editModal.show();
}

=======
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken'); // Supondo que o token de autenticação está no localStorage

    if (!token) {
        window.location.href = '../Login/login.html'; // Redirecionar se o usuário não estiver autenticado
        return;
    }

    // Função para carregar e exibir transações
    const loadTransactions = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/transacao', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Erro ao carregar transações.');

            const transactions = await response.json();
            const transactionTableBody = document.getElementById('transactionTableBody');
            transactionTableBody.innerHTML = ''; // Limpar tabela antes de adicionar novas linhas

            transactions.forEach(transaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(transaction.data).toLocaleDateString('pt-BR')}</td>
                    <td>${transaction.descricao}</td>
                    <td>${transaction.categoria}</td>
                    <td>R$ ${transaction.valor.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-warning btn-sm btn-edit" data-id="${transaction.id}">Editar</button>
                        <button class="btn btn-danger btn-sm btn-delete" data-id="${transaction.id}">Excluir</button>
                    </td>
                `;
                transactionTableBody.appendChild(row);
            });

            // Adicionar eventos para os botões de edição e exclusão
            document.querySelectorAll('.btn-edit').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    try {
                        const response = await fetch(`http://localhost:3000/api/transacao/${id}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (!response.ok) throw new Error('Erro ao carregar transação para edição.');

                        const transaction = await response.json();
                        document.getElementById('editTransactionId').value = transaction.id;
                        document.getElementById('editTransactionDate').value = new Date(transaction.data).toISOString().split('T')[0];
                        document.getElementById('editTransactionDescription').value = transaction.descricao;
                        document.getElementById('editTransactionCategory').value = transaction.categoria;
                        document.getElementById('editTransactionAmount').value = transaction.valor;

                        new bootstrap.Modal(document.getElementById('editTransactionModal')).show();
                    } catch (error) {
                        console.error('Erro ao carregar dados da transação:', error);
                        alert(`Erro ao carregar dados da transação: ${error.message}`);
                    }
                });
            });

            document.querySelectorAll('.btn-delete').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.dataset.id;
                    if (confirm('Tem certeza que deseja excluir esta transação?')) {
                        try {
                            const response = await fetch(`http://localhost:3000/api/transacao/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            if (!response.ok) throw new Error('Erro ao excluir transação.');

                            loadTransactions(); // Recarregar transações
                        } catch (error) {
                            console.error('Erro ao excluir transação:', error);
                            alert(`Erro ao excluir transação: ${error.message}`);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
            alert(`Erro ao carregar transações: ${error.message}`);
        }
    };

    // Adicionar nova transação
    document.getElementById('saveTransactionButton').addEventListener('click', async () => {
        const form = document.getElementById('transactionForm');
        const formData = new FormData(form);

        const transaction = {
            data: formData.get('transactionDate'),
            descricao: formData.get('transactionDescription'),
            categoria: formData.get('transactionCategory'),
            valor: parseFloat(formData.get('transactionAmount'))
        };

        if (!transaction.data || !transaction.descricao || !transaction.categoria || isNaN(transaction.valor)) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/transacao', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transaction)
            });

            if (!response.ok) throw new Error('Erro ao adicionar transação.');

            form.reset(); // Limpar formulário
            new bootstrap.Modal(document.getElementById('addTransactionModal')).hide();
            loadTransactions(); // Recarregar transações
        } catch (error) {
            console.error('Erro ao adicionar transação:', error);
            alert(`Erro ao adicionar transação: ${error.message}`);
        }
    });

    // Atualizar transação
    document.getElementById('updateTransactionButton').addEventListener('click', async () => {
        const id = document.getElementById('editTransactionId').value;
        const transaction = {
            data: document.getElementById('editTransactionDate').value,
            descricao: document.getElementById('editTransactionDescription').value,
            categoria: document.getElementById('editTransactionCategory').value,
            valor: parseFloat(document.getElementById('editTransactionAmount').value)
        };

        if (!transaction.data || !transaction.descricao || !transaction.categoria || isNaN(transaction.valor)) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/transacao/${id}`, {
                method: 'PATCH', // Usando PATCH para atualizações parciais
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transaction)
            });

            if (!response.ok) throw new Error('Erro ao atualizar transação.');

            new bootstrap.Modal(document.getElementById('editTransactionModal')).hide();
            loadTransactions(); // Recarregar transações
        } catch (error) {
            console.error('Erro ao atualizar transação:', error);
            alert(`Erro ao atualizar transação: ${error.message}`);
        }
    });

    loadTransactions(); // Carregar transações ao iniciar
});
>>>>>>> 6dba269aedc05506d818ab13d97dc5634de30b8c
