
import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Table from '../../components/Table/Table.jsx'
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import Field from '../../components/Field/Field.jsx'
import Button from '../../components/Button/Button.jsx'
import { api } from '../../service/api.js'
import estilos from './Avaliacao.module.css'

const fmtData = (data) =>
  data ? data.split('-').reverse().join('/') : '-'

const fmtMoeda = (valor) =>
  Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

export default function Avaliacao() {
  const [selecionado, setSelecionado] = useState(null)
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(false)

  const [dados, setDados] = useState({
    parecer: '',
    decisao: 'APROVADA'
  })

  useEffect(() => {
    carregarPedidos()
  }, [])

  async function carregarPedidos() {
    try {
      setCarregando(true)

      const resposta = await api('/api/solicitacoes')

      if (!resposta.ok) {
        throw new Error('Erro ao buscar pedidos.')
      }

      const resultado = await resposta.json()

      setPedidos(
        resultado.filter((pedido) => pedido.status === 'PENDENTE')
      )
    } catch (erro) {
      console.error('Erro ao carregar pedidos:', erro)
      alert('Não foi possível carregar os pedidos.')
    } finally {
      setCarregando(false)
    }
  }

  function abrirAvaliacao(pedido) {
    setSelecionado(pedido)

    setDados({
      parecer: '',
      decisao: 'APROVADA'
    })
  }

  async function salvar(e) {
    e.preventDefault()

    if (!selecionado) return

    try {
      const resposta = await api(
        `/api/solicitacoes/${selecionado.id}/avaliar`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            decisao: dados.decisao,
            parecer: dados.parecer
          })
        }
      )

      if (!resposta.ok) {
        const mensagem = await resposta.text()
        throw new Error(mensagem || 'Erro ao salvar parecer.')
      }

      alert('Parecer salvo com sucesso!')

      setSelecionado(null)
      carregarPedidos()

    } catch (erro) {
      console.error('Erro ao salvar avaliação:', erro)
      alert(erro.message || 'Não foi possível salvar o parecer.')
    }
  }

  const colunas = [
    { key: 'id', label: '#' },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (p) => p.cliente?.nome || '-'
    },
    {
      key: 'renda',
      label: 'Renda mensal',
      render: (p) => {
        const empregos = p.cliente?.empregos || []

        const renda = empregos.reduce(
          (total, emprego) =>
            total + Number(emprego.rendimento || 0),
          0
        )

        return fmtMoeda(renda)
      }
    },
    {
      key: 'carro',
      label: 'Automóvel',
      render: (p) => p.carro?.modelo || p.carro?.nome || '-'
    },
    {
      key: 'periodo',
      label: 'Período',
      render: (p) =>
        `${fmtData(p.inicio)} até ${fmtData(p.fim)}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (p) => <StatusBadge status={p.status} />
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: (p) => (
        <Button
          size="pequeno"
          variant="contorno"
          onClick={() => abrirAvaliacao(p)}
        >
          Avaliar
        </Button>
      )
    }
  ]

  return (
    <div id="pagina-avaliacao">
      <PageHeader
        title="Avaliar pedidos"
        subtitle="Análise financeira, parecer e execução de contratos"
      />

      {carregando ? (
        <p>Carregando pedidos...</p>
      ) : (
        <Table columns={colunas} rows={pedidos} />
      )}

      {selecionado && (
        <Modal
          title={`Avaliar pedido #${selecionado.id}`}
          onClose={() => setSelecionado(null)}
        >
          <form
            id="formulario-avaliacao"
            className={estilos.formulario}
            onSubmit={salvar}
          >
            <Field
              id="decisao"
              as="select"
              label="Parecer financeiro"
              value={dados.decisao}
              onChange={(e) =>
                setDados({
                  ...dados,
                  decisao: e.target.value
                })
              }
            >
              <option value="APROVADA">
                Positivo — aprovar para contrato
              </option>

              <option value="REPROVADA">
                Negativo — reprovar
              </option>
            </Field>

            <Field
              id="observacoes"
              as="textarea"
              rows="3"
              label="Observações"
              value={dados.parecer}
              onChange={(e) =>
                setDados({
                  ...dados,
                  parecer: e.target.value
                })
              }
            />

            <div className={estilos.rodape}>
              <Button
                type="button"
                variant="contorno"
                onClick={() => setSelecionado(null)}
              >
                Cancelar
              </Button>

              <Button type="submit">
                Salvar parecer
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
