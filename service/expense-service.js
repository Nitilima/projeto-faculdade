const listaDespesas = () => {
  return fetch(`http://localhost:3000/expense`)
    .then(resposta => {
      if (resposta.ok) {
        return resposta.json()
      }
      throw new Error('não foi possivel listar as despesas')
    })
}

const criaDespesa = (description, amount) => {
  return fetch(`http://localhost:3000/expense`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: description,
      amount: amount
    })
  })
    .then(resposta => {
      if (resposta.ok) {
        return resposta.body
      }
      throw new Error('Não foi possível criar uma nova despesa')
    })
}

const removeDespesa = (id) => {
  return fetch(`http://localhost:3000/expense/${id}`, {
    method: 'DELETE'
  }).then(resposta => {
    if (!resposta.ok) {
      throw new Error('Não foi possivel remover um cliente')
    }
  })
}

const detalhaDespesa = (id) => {
  return fetch(`http://localhost:3000/expense/${id}`)
    .then(resposta => {
      if (resposta.ok) {
        return resposta.json()
      }
      throw new Error('Não foi possivel detalhar a despesa')
    })
}

const atualiaDespesa = (id, description, amount) => {
  return fetch(`http://localhost:3000/expense/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      description: description,
      amount: amount
    })
  })
    .then(resposta => {
      if (resposta.ok) {
        return resposta.json()
      } throw new Error('Não foi possivel atualizar a despesa')

    })
}

export const expenseService = {
  listaDespesas,
  criaDespesa,
  removeDespesa,
  detalhaDespesa,
  atualiaDespesa
}