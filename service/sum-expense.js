import { expenseService } from "../service/expense-service.js";

const formatCurrency = (value) => {
    return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;
};

// Função para agrupar despesas por mês
const groupByMonth = (expenses) => {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const valores = new Array(12).fill(0);

    expenses.forEach(expense => {
        const month = new Date(expense.date).getMonth();
        valores[month] += parseFloat(expense.amount);
    });

    return { meses, valores };
};

const updateSummaryCards = (total, max, media) => {
    document.getElementById('total-anual').textContent = formatCurrency(total);
    document.getElementById('maior-gasto').textContent = `${max.mes}: ${formatCurrency(max.valor)}`;
    document.getElementById('media-mensal').textContent = formatCurrency(media);
};

let chartInstance = null;
const renderOrUpdateChart = (meses, valores) => {
    const ctx = document.getElementById('gastosChart').getContext('2d');

    if (chartInstance) {
        chartInstance.data.labels = meses;
        chartInstance.data.datasets[0].data = valores;
        chartInstance.update();
    } else {

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Gastos Mensais (R$)',
                    data: valores,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Valor (R$)' }
                    },
                    x: {
                        title: { display: true, text: 'Mês' }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => formatCurrency(context.raw)
                        }
                    }
                }
            }
        });
    }
};

const loadAndProcessData = async () => {
    try {
        const expenses = await expenseService.listaDespesas();

        if (expenses.length === 0) {
            console.log("Nenhuma despesa encontrada");
            return;
        }

        // Agrupa despesas por mês
        const { meses, valores } = groupByMonth(expenses);

        const totalAnual = valores.reduce((a, b) => a + b, 0);
        const mediaMensal = totalAnual / 12;
        const maxValor = Math.max(...valores);
        const maxMes = meses[valores.indexOf(maxValor)];

        updateSummaryCards(totalAnual, { mes: maxMes, valor: maxValor }, mediaMensal);
        renderOrUpdateChart(meses, valores);

    } catch (error) {
        console.error("Erro ao carregar despesas:", error);
    }
};

const setupMutationObserver = () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                loadAndProcessData();
            }
        });
    });

    observer.observe(document.querySelector('[data-tabela]'), {
        childList: true,
        subtree: true
    });
};

document.addEventListener('DOMContentLoaded', () => {
    loadAndProcessData();
    setupMutationObserver();
});

export const dashboardUtils = {
    formatCurrency,
    groupByMonth,
    updateSummaryCards,
    loadAndProcessData
};