import { expenseService } from "../service/expense-service.js";

const criarNovalinha = (descricao, valor, id) => {
    const linhaNovaDespesa = document.createElement('tr')
    const conteudo = `
    <td class="td" data-td>${descricao}</td>
    <td>${valor}</td>
    <td>
        <ul class="tabela__botoes-controle">
            <li><a href="../telas/edita_despesa.html?id=${id}" class="botao-simples botao-simples--editar">Editar</a></li>
            <li><button class="botao-simples botao-simples--excluir" type="button">Excluir</button></li>
        </ul>
    </td>`

    linhaNovaDespesa.innerHTML = conteudo
    linhaNovaDespesa.dataset.id = id

    return linhaNovaDespesa
}

const tabela = document.querySelector('[data-tabela]')

tabela.addEventListener('click', async (evento) => {
    let ehBotaoDeletar = evento.target.className === 'botao-simples botao-simples--excluir'
    if (ehBotaoDeletar) {
        try {
            const linhaDespesa = evento.target.closest('[data-id]')
            let id = linhaDespesa.dataset.id
            await expenseService.removeDespesa(id)
            linhaDespesa.remove()
        }
        catch (err) {
            console.log(err);
            window.location.href = '../telas/erro.html'

        }
    }
})

const render = async () => {
    try {
        const listaDespesas = await expenseService.listaDespesas()

        listaDespesas.forEach(elemento => {
            tabela.appendChild(criarNovalinha(elemento.descricao, elemento.valor, elemento.id))
        })
    }
    catch (err) {
        console.log(err);
        window.location.href = '../telas/erro.html'
    }

}

render()