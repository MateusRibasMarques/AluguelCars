
import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Table from '../../components/Table/Table.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import Field from '../../components/Field/Field.jsx'
import Button from '../../components/Button/Button.jsx'
import estilos from './Clientes.module.css'

const clienteVazio = {
  nome: '',
  rg: '',
  cpf: '',
  endereco: '',
  profissao: '',
  rendimentos: []
}

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [edicao, setEdicao] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarClientes()
  }, [])

  async function carregarClientes() {
    try {
      setCarregando(true)
      setErro('')

      const resposta = await api('/api/clientes')

      if (!resposta.ok) {
        throw new Error('Não foi possível carregar os clientes.')
      }

      const dados = await resposta.json()

      const clientesFormatados = dados.map(cliente => ({
        ...cliente,
        rendimentos: (cliente.empregos || []).map(emprego => ({
          empregador: emprego.empregador,
          valor: emprego.rendimento
        }))
      }))

      setClientes(clientesFormatados)
    } catch (erro) {
      setErro(erro.message)
    } finally {
      setCarregando(false)
    }
  }

  const mudar = campo => e => {
    setEdicao({ ...edicao, [campo]: e.target.value })
  }

  const mudarRendimento = (i, campo, valor) => {
    setEdicao({
      ...edicao,
      rendimentos: edicao.rendimentos.map((r, j) =>
        j === i ? { ...r, [campo]: valor } : r
      )
    })
  }

  const adicionarRendimento = () => {
    if (edicao.rendimentos.length >= 3) return

    setEdicao({
      ...edicao,
      rendimentos: [
        ...edicao.rendimentos,
        { empregador: '', valor: '' }
      ]
    })
  }

  const removerRendimento = i => {
    setEdicao({
      ...edicao,
      rendimentos: edicao.rendimentos.filter((_, j) => j !== i)
    })
  }

  async function enviar(e) {
    e.preventDefault()

    try {
      setErro('')

      const cliente = {
        nome: edicao.nome,
        rg: edicao.rg,
        cpf: edicao.cpf,
        endereco: edicao.endereco,
        profissao: edicao.profissao,
        empregos: edicao.rendimentos.map(r => ({
          empregador: r.empregador,
          rendimento: Number(r.valor)
        }))
      }

      const editando = Boolean(edicao.id)

      const resposta = await api(
        editando
          ? `/api/clientes/${edicao.id}`
          : '/api/clientes',
        {
          method: editando ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cliente)
        }
      )

      if (!resposta.ok) {
        const mensagem = await resposta.text()
        throw new Error(mensagem || 'Não foi possível salvar o cliente.')
      }

      setEdicao(null)
      await carregarClientes()
    } catch (erro) {
      setErro(erro.message)
    }
  }

  async function excluir(id) {
    if (!window.confirm('Deseja realmente excluir este cliente?')) {
      return
    }

    try {
      setErro('')

      const resposta = await api(`/api/clientes/${id}`, {
        method: 'DELETE'
      })

      if (!resposta.ok) {
        throw new Error('Não foi possível excluir o cliente.')
      }

      await carregarClientes()
    } catch (erro) {
      setErro(erro.message)
    }
  }

  function editar(cliente) {
    setErro('')

    setEdicao({
      ...cliente,
      rendimentos: cliente.rendimentos.map(r => ({ ...r }))
    })
  }

  const colunas = [
    { key: 'nome', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'profissao', label: 'Profissão' },
    {
      key: 'renda',
      label: 'Renda total',
      render: c =>
        Number(
          c.rendimentos.reduce(
            (soma, r) => soma + Number(r.valor || 0),
            0
          )
        ).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: c => (
        <div className={estilos.acoes}>
          <Button
            size="pequeno"
            variant="contorno"
            onClick={() => editar(c)}
          >
            Editar
          </Button>

          <Button
            size="pequeno"
            variant="perigo"
            onClick={() => excluir(c.id)}
          >
            Excluir
          </Button>
        </div>
      )
    }
  ]

  return (
    <div id="pagina-clientes">
      <PageHeader
        title="Clientes"
        subtitle="Dados de identificação, profissão e rendimentos (até 3)"
        action={
          <Button
            id="botao-novo-cliente"
            onClick={() => {
              setErro('')
              setEdicao({ ...clienteVazio, rendimentos: [] })
            }}
          >
            Novo cliente
          </Button>
        }
      />

      {erro && (
        <div role="alert" className={estilos.erro}>
          {erro}
        </div>
      )}

      {carregando ? (
        <p>Carregando clientes...</p>
      ) : (
        <Table columns={colunas} rows={clientes} />
      )}

      {edicao && (
        <Modal
          title={edicao.id ? 'Editar cliente' : 'Novo cliente'}
          onClose={() => setEdicao(null)}
        >
          <form
            id="formulario-cliente"
            className={estilos.formulario}
            onSubmit={enviar}
          >
            <Field
              id="nome"
              label="Nome"
              value={edicao.nome}
              onChange={mudar('nome')}
              required
            />

            <div className={estilos.duasColunas}>
              <Field
                id="rg"
                label="RG"
                value={edicao.rg}
                onChange={mudar('rg')}
                required
              />

              <Field
                id="cpf"
                label="CPF"
                value={edicao.cpf}
                onChange={mudar('cpf')}
                required
              />
            </div>

            <Field
              id="endereco"
              label="Endereço"
              value={edicao.endereco}
              onChange={mudar('endereco')}
              required
            />

            <Field
              id="profissao"
              label="Profissão"
              value={edicao.profissao}
              onChange={mudar('profissao')}
              required
            />

            <div id="lista-rendimentos">
              <strong>Rendimentos</strong>

              <span className={estilos.apagado}>
                ({edicao.rendimentos.length}/3)
              </span>

              {edicao.rendimentos.map((r, i) => (
                <div key={i} className={estilos.rendimento}>
                  <Field
                    label="Entidade empregadora"
                    value={r.empregador}
                    onChange={e =>
                      mudarRendimento(i, 'empregador', e.target.value)
                    }
                    required
                  />

                  <Field
                    label="Valor (R$)"
                    type="number"
                    min="0"
                    value={r.valor}
                    onChange={e =>
                      mudarRendimento(i, 'valor', e.target.value)
                    }
                    required
                  />

                  <Button
                    type="button"
                    size="pequeno"
                    variant="perigo"
                    onClick={() => removerRendimento(i)}
                  >
                    Remover
                  </Button>
                </div>
              ))}

              <Button
                id="botao-adicionar-rendimento"
                type="button"
                size="pequeno"
                variant="contorno"
                disabled={edicao.rendimentos.length >= 3}
                onClick={adicionarRendimento}
              >
                + Adicionar rendimento
              </Button>
            </div>

            <div className={estilos.rodape}>
              <Button
                type="button"
                variant="contorno"
                onClick={() => setEdicao(null)}
              >
                Cancelar
              </Button>

              <Button
                id="botao-salvar-cliente"
                type="submit"
              >
                Salvar cliente
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
