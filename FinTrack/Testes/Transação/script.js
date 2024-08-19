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

            if (!response.ok) throw new Error(`Erro ao carregar transações: ${response.statusText}`);

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

                        if (!response.ok) throw new Error(`Erro ao carregar transação para edição: ${response.statusText}`);

                        const transaction = await response.json();
                        document.getElementById('editTransactionId').value = transaction.id;
                        document.getElementById('editTransactionDate').value = new Date(transaction.data).toISOString().split('T')[0];
                        document.getElementById('editTransactionDescription').value = transaction.descricao;
                        document.getElementById('editTransactionCategory').value = transaction.categoria;
                        document.getElementById('editTransactionAmount').value = transaction.valor;

                        new bootstrap.Modal(document.getElementById('editTransactionModal')).show();
                    } catch (error) {
                        console.error(error);
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

                            if (!response.ok) throw new Error(`Erro ao excluir transação: ${response.statusText}`);

                            loadTransactions(); // Recarregar transações
                        } catch (error) {
                            console.error(error);
                            alert(`Erro ao excluir transação: ${error.message}`);
                        }
                    }
                });
            });
        } catch (error) {
            console.error(error);
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

        try {
            const response = await fetch('http://localhost:3000/api/transacao', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transaction)
            });

            if (!response.ok) throw new Error(`Erro ao adicionar transação: ${response.statusText}`);

            form.reset(); // Limpar formulário
            new bootstrap.Modal(document.getElementById('addTransactionModal')).hide();
            loadTransactions(); // Recarregar transações
        } catch (error) {
            console.error(error);
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

        try {
            const response = await fetch(`http://localhost:3000/api/transacao/${id}`, {
                method: 'PATCH', // Usando PATCH para atualizações parciais
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transaction)
            });

            if (!response.ok) throw new Error(`Erro ao atualizar transação: ${response.statusText}`);

            new bootstrap.Modal(document.getElementById('editTransactionModal')).hide();
            loadTransactions(); // Recarregar transações
        } catch (error) {
            console.error(error);
            alert(`Erro ao atualizar transação: ${error.message}`);
        }
    });

    loadTransactions(); // Carregar transações ao iniciar
});
