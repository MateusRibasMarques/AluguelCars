
import { useState } from 'react'
import { useData } from '../../context/DataContext.jsx'
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

const fmtMoeda = (v) =>
  Number(v).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

export default function Clientes() {
  const { clientes, salvarCliente, excluirCliente } = useData()
  const [edicao, setEdicao] = useState(null)

  const mudar = (campo) => (e) =>
    setEdicao({ ...edicao, [campo]: e.target.value })

  const mudarRendimento = (i, campo, valor) =>
    setEdicao({
      ...edicao,
      rendimentos: edicao.rendimentos.map((r, j) =>
        j === i ? { ...r, [campo]: valor } : r
      )
    })

  const adicionarRendimento = () =>
    setEdicao({
      ...edicao,
      rendimentos: [
        ...edicao.rendimentos,
        { empregador: '', valor: '' }
      ]
    })

  const removerRendimento = (i) =>
    setEdicao({
      ...edicao,
      rendimentos: edicao.rendimentos.filter((_, j) => j !== i)
    })

  const enviar = (e) => {
    e.preventDefault()

    salvarCliente({
      ...edicao,
      rendimentos: edicao.rendimentos.map((r) => ({
        ...r,
        valor: Number(r.valor)
      }))
    })

    setEdicao(null)
  }

  const colunas = [
    { key: 'nome', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'profissao', label: 'Profissão' },
    {
      key: 'renda',
      label: 'Renda total',
      render: (c) =>
        fmtMoeda(
          c.rendimentos.reduce(
            (soma, r) => soma + Number(r.valor), 0
          )
        )
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: (c) => (
        <div className={estilos.acoes}>
          <Button
            size="pequeno"
            variant="contorno"
            onClick={() => setEdicao(c)}
          >
            Editar
          </Button>

          <Button
            size="pequeno"
            variant="perigo"
            onClick={() =>
              window.confirm(`Excluir ${c.nome}?`) &&
              excluirCliente(c.id)
            }
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
            onClick={() => setEdicao(clienteVazio)}
          >
            Novo cliente
          </Button>
        }
      />

      <Table columns={colunas} rows={clientes} />

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
                    onChange={(e) =>
                      mudarRendimento(i, 'empregador', e.target.value)
                    }
                    required
                  />

                  <Field
                    label="Valor (R$)"
                    type="number"
                    min="0"
                    value={r.valor}
                    onChange={(e) =>
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

              <Button id="botao-salvar-cliente" type="submit">
                Salvar cliente
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
