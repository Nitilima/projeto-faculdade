import { expenseService } from "../service/expense-service.js";

(async () => {
    const pegaUrl = new URL(window.location)

    const id = pegaUrl.searchParams.get('id')

    const inputDescricao = document.querySelector('[data-descricao]')
    const inputValor = document.querySelector('[data-valor]')

    try {
        const dados = await expenseService.detalhaDespesa(id)
        inputDescricao.value = dados.descricao
        inputValor.value = dados.value
    }
    catch (err) {
        console.log(err);
        window.location.href = '../telas/erro.html'
    }

    const formulario = document.querySelector('[data-form]')

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault()
        try {
            await expenseService.atualiaDespesa(id, inputDescricao.value, inputValor.value)
            window.location.href = '..telas/edicao_concluida.html'
        }
        catch (err) {
            console.log(err);
            window.location = '../telas/erro.html'
        }
    })
})()