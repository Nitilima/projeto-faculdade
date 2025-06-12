import { expenseService } from "../service/expense-service.js";

const formulario = document.querySelector('[data-form]')

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault()
    try {
        const descricao = evento.target.querySelector('[data-descricao]').value
        const valor = evento.target.querySelector('[data-valor]').value

        await expenseService.criaDespesa(descricao, valor)
        window.location.href = '../telas/cadastro_concluido.html'
    }
    catch (err) {
        console.log(err);
        window.location.href = '../telas/erro.html'
    }
})