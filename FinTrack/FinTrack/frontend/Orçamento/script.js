document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('openModalBtn');
    const filterModal = document.getElementById('filterModal');
    const closeModal = document.querySelector('.modal .close');
    const filterForm = document.getElementById('filterForm');
    const dataTable = document.getElementById('dataTable');
    
    let categoryChart, budgetChart;

    // Show modal
    openModalBtn.onclick = () => filterModal.style.display = 'block';
    
    // Close modal
    closeModal.onclick = () => filterModal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target === filterModal) {
            filterModal.style.display = 'none';
        }
    };

    // Fetch data and create charts
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/transacao', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    const updateCharts = (transactions) => {
        const categories = [...new Set(transactions.map(t => t.categoria))];
        const categoryAmounts = categories.map(c => transactions.filter(t => t.categoria === c).reduce((sum, t) => sum + t.valor, 0));

        const ctxCategory = document.getElementById('categoryChart').getContext('2d');
        if (categoryChart) categoryChart.destroy();
        categoryChart = new Chart(ctxCategory, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Gastos por Categoria',
                    data: categoryAmounts,
                    backgroundColor: categories.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`),
                }]
            },
            options: {
                responsive: true
            }
        });

        const ctxBudget = document.getElementById('budgetChart').getContext('2d');
        if (budgetChart) budgetChart.destroy();
        budgetChart = new Chart(ctxBudget, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Valores Estipulados',
                    data: categories.map(() => 0), // Placeholder data
                    backgroundColor: '#ff5722',
                }]
            },
            options: {
                responsive: true
            }
        });
    };

    // Handle form submission
    filterForm.onsubmit = async (e) => {
        e.preventDefault();
        const category = document.getElementById('category').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const amount = parseFloat(document.getElementById('amount').value);

        const transactions = await fetchData();
        const filtered = transactions.filter(t =>
            (!category || t.categoria === category) &&
            (!startDate || new Date(t.data) >= new Date(startDate)) &&
            (!endDate || new Date(t.data) <= new Date(endDate))
        );

        updateCharts(filtered);

        const tableRows = filtered.map(t => {
            const status = t.valor > amount ? 'Acima do Orçamento' : 'Dentro do Orçamento';
            return `
                <tr>
                    <td>${new Date(t.data).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}</td>
                    <td>${t.categoria}</td>
                    <td>${amount.toFixed(2)}</td>
                    <td>${t.valor.toFixed(2)}</td>
                    <td>${status}</td>
                </tr>
            `;
        }).join('');

        dataTable.innerHTML = tableRows;
        filterModal.style.display = 'none';
    };

    // Initial data fetch and chart setup
    fetchData().then(transactions => {
        updateCharts(transactions);
    });
});
