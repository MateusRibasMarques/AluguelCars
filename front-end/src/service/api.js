
const API_URL = 'http://localhost:8080'

export async function api(endpoint, opcoes = {}) {
  const token = localStorage.getItem('token')

  const resposta = await fetch(`${API_URL}${endpoint}`, {
    ...opcoes,
    headers: {
      ...opcoes.headers,
      ...(token && { Authorization: `Bearer ${token}` })
    }
  })

  if (resposta.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('tipoUsuario')
    localStorage.removeItem('nomeUsuario')
    window.location.href = '/login'
    throw new Error('Sessão inválida ou expirada.')
  }

  if (resposta.status === 403) {
    throw new Error('Você não tem permissão para realizar esta operação.')
  }

  return resposta
}
