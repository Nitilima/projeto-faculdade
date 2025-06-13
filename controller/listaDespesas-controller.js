import { expenseService } from "../service/expense-service.js";

const criarNovalinha = (description, amount, id) => {
    const linhaNovaDespesa = document.createElement('tr');
    const conteudo = `
        <td class="td" data-td>${description}</td>
        <td>${amount}</td>
        <td>
            <ul class="tabela__botoes-controle">
                <li><a href="../telas/edita_despesa.html?id=${id}" class="botao-simples botao-simples--editar">Editar</a></li>
                <li><button class="botao-simples botao-simples--excluir" type="button">Excluir</button></li>
            </ul>
        </td>`;

    linhaNovaDespesa.innerHTML = conteudo;
    linhaNovaDespesa.dataset.id = id;
    return linhaNovaDespesa;
};

const notificarAtualizacaoDashboard = () => {
    const event = new CustomEvent('despesasAtualizadas');
    document.dispatchEvent(event);
};

const tabela = document.querySelector('[data-tabela]');

tabela.addEventListener('click', async (evento) => {
    const ehBotaoDeletar = evento.target.className === 'botao-simples botao-simples--excluir';

    if (ehBotaoDeletar) {
        try {
            const linhaDespesa = evento.target.closest('[data-id]');
            const id = linhaDespesa.dataset.id;
            await expenseService.removeDespesa(id);
            linhaDespesa.remove();
            notificarAtualizacaoDashboard();
        } catch (err) {
            console.error(err);
            window.location.href = '../telas/erro.html';
        }
    }
});

const render = async () => {
    try {
        const listaDespesas = await expenseService.listaDespesas();
        tabela.innerHTML = '';

        listaDespesas.forEach(elemento => {
            tabela.appendChild(criarNovalinha(elemento.description, elemento.amount, elemento.id));
        });

        notificarAtualizacaoDashboard();
    } catch (err) {
        console.error(err);
        window.location.href = '../telas/erro.html';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    render();
});

export const despesaController = {
    criarNovalinha,
    render
};