import { expenseService } from "../service/expense-service.js";

const notificarAtualizacaoDashboard = () => {
    const event = new CustomEvent('despesasAtualizadas');
    document.dispatchEvent(event);
};

(async () => {
    const pegaUrl = new URL(window.location);
    const id = pegaUrl.searchParams.get('id');

    const inputDescricao = document.querySelector('[data-descricao]');
    const inputValor = document.querySelector('[data-valor]');
    const inputData = document.querySelector('[data-date]');

    try {
        const dados = await expenseService.detalhaDespesa(id);
        inputDescricao.value = dados.description;
        inputValor.value = dados.amount;

        if (inputData && dados.date) {
            inputData.value = dados.date;
        }
    }
    catch (err) {
        console.error(err);
        window.location.href = '../telas/erro.html';
    }

    const formulario = document.querySelector('[data-form]');

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        try {
            await expenseService.atualiaDespesa(
                id,
                inputDescricao.value,
                inputValor.value,
                inputData ? inputData.value : null
            );

            notificarAtualizacaoDashboard();

            window.location.href = '../telas/edicao_concluida.html';
        }
        catch (err) {
            console.error(err);
            window.location.href = '../telas/erro.html';
        }
    });
})();