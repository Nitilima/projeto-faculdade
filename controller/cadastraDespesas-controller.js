import { expenseService } from "../service/expense-service.js";

const notificarAtualizacaoDashboard = () => {
    const event = new CustomEvent('despesasAtualizadas');
    document.dispatchEvent(event);
};

const formulario = document.querySelector('[data-form]');

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    try {
        const descricao = evento.target.querySelector('[data-descricao]').value;
        const valor = evento.target.querySelector('[data-valor]').value;
        const data = evento.target.querySelector('[data-date]').value;

        await expenseService.criaDespesa(descricao, valor, data);

        notificarAtualizacaoDashboard();

        window.location.href = '../telas/cadastro_concluido.html';
    }
    catch (err) {
        console.error('Erro ao criar despesa:', err);
        window.location.href = '../telas/erro.html';
    }
});