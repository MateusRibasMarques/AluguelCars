
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Field from '../../components/Field/Field.jsx'
import Button from '../../components/Button/Button.jsx'
import { api } from '../../services/api.js'
import estilos from './FormularioPedido.module.css'

export default function FormularioPedido() {
  const { id } = useParams()
  const navegar = useNavigate()

  const [dados, setDados] = useState({
    automovelId: '',
    inicio: '',
    fim: ''
  })

  const [automoveis, setAutomoveis] = useState([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    async function carregarAutomoveis() {
      try {
        const resposta = await api('/api/carros')

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar os automóveis.')
        }

        const resultado = await resposta.json()
        setAutomoveis(resultado)
      } catch (erro) {
        setErro(erro.message)
      }
    }

    carregarAutomoveis()
  }, [])

  const mudar = (campo) => (e) => {
    setDados({ ...dados, [campo]: e.target.value })
  }

  const enviar = async (e) => {
    e.preventDefault()
    setErro('')

    if (!dados.automovelId) {
      return setErro('Selecione um automóvel.')
    }

    if (dados.inicio < new Date().toISOString().split('T')[0]) {
      return setErro('A data de retirada não pode ser anterior a hoje.')
    }

    if (dados.fim < dados.inicio) {
      return setErro(
        'A data de devolução não pode ser anterior à retirada.'
      )
    }

    try {
      setCarregando(true)

      const resposta = await api('/api/solicitacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          carro: {
            id: Number(dados.automovelId)
          },
          inicio: dados.inicio,
          fim: dados.fim
        })
      })

      const resultado = await resposta.json()

      if (!resposta.ok) {
        throw new Error(
          typeof resultado === 'string'
            ? resultado
            : 'Não foi possível enviar a solicitação.'
        )
      }

      navegar('/pedidos')

    } catch (erro) {
      setErro(erro.message || 'Erro ao conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div id="pagina-formulario-pedido">
      <PageHeader
        title={id ? `Modificar pedido #${id}` : 'Novo pedido de aluguel'}
        subtitle="Depois de enviado, o pedido segue para análise financeira dos agentes."
      />

      <form
        id="formulario-pedido"
        className={estilos.formulario}
        onSubmit={enviar}
      >
        {erro && (
          <div
            id="mensagem-erro"
            className={estilos.aviso}
            role="alert"
          >
            {erro}
          </div>
        )}

        <Field
          id="automovel"
          as="select"
          label="Automóvel"
          value={dados.automovelId}
          onChange={mudar('automovelId')}
          required
        >
          <option value="">Selecione um automóvel</option>

          {automoveis.map((carro) => (
            <option key={carro.id} value={carro.id}>
              {carro.marca} {carro.modelo} - {carro.ano} ({carro.placa})
            </option>
          ))}
        </Field>

        {automoveis.length === 0 && (
          <p>Nenhum automóvel cadastrado no momento.</p>
        )}

        <div className={estilos.duasColunas}>
          <Field
            id="retirada"
            label="Retirada"
            type="date"
            value={dados.inicio}
            onChange={mudar('inicio')}
            required
          />

          <Field
            id="devolucao"
            label="Devolução"
            type="date"
            value={dados.fim}
            onChange={mudar('fim')}
            required
          />
        </div>

        <div className={estilos.rodape}>
          <Button
            type="button"
            variant="contorno"
            onClick={() => navegar('/pedidos')}
          >
            Cancelar
          </Button>

          <Button
            id="botao-enviar-pedido"
            type="submit"
            disabled={carregando || automoveis.length === 0}
          >
            {carregando ? 'Enviando...' : 'Enviar pedido'}
          </Button>
        </div>
      </form>
    </div>
  )
}
