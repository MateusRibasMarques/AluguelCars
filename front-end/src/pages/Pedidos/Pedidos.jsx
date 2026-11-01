
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api.js'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Table from '../../components/Table/Table.jsx'
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import Button from '../../components/Button/Button.jsx'
import estilos from './Pedidos.module.css'

const fmtData = (data) => {
  if (!data) return '-'

  return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR')
}

const fmtDataHora = (data) => {
  if (!data) return '-'

  return new Date(data).toLocaleString('pt-BR')
}

const nomeCliente = (pedido) => pedido.cliente?.nome ?? '-'

const nomeCarro = (pedido) => {
  const carro = pedido.carro

  return carro
    ? `${carro.marca} ${carro.modelo} (${carro.placa})`
    : '-'
}

const statusLegivel = (status) => {
  const statusMap = {
    PENDENTE: 'Pendente',
    EM_ANALISE: 'Em análise',
    APROVADA: 'Aprovada',
    REPROVADA: 'Reprovada',
    CANCELADA: 'Cancelada'
  }

  return statusMap[status] ?? status
}

export default function Pedidos() {
  const navegar = useNavigate()

  const [pedidos, setPedidos] = useState([])
  const [selecionado, setSelecionado] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarPedidos()
  }, [])

  async function carregarPedidos() {
    try {
      setCarregando(true)
      setErro('')

      const resposta = await api('/api/solicitacoes')

      if (!resposta.ok) {
        throw new Error('Não foi possível carregar os pedidos.')
      }

      const dados = await resposta.json()
      setPedidos(dados)
    } catch (erro) {
      setErro(erro.message)
    } finally {
      setCarregando(false)
    }
  }

  const colunas = [
    { key: 'id', label: '#' },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (pedido) => nomeCliente(pedido)
    },
    {
      key: 'carro',
      label: 'Automóvel',
      render: (pedido) => nomeCarro(pedido)
    },
    {
      key: 'inicio',
      label: 'Retirada',
      render: (pedido) => fmtData(pedido.inicio)
    },
    {
      key: 'fim',
      label: 'Devolução',
      render: (pedido) => fmtData(pedido.fim)
    },
    {
      key: 'dataSolicitacao',
      label: 'Data do pedido',
      render: (pedido) => fmtDataHora(pedido.dataSolicitacao)
    },
    {
      key: 'status',
      label: 'Status',
      render: (pedido) => (
        <StatusBadge status={pedido.status} />
      )
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: (pedido) => (
        <div className={estilos.acoes}>
          <Button
            size="pequeno"
            variant="escuro"
            onClick={() => setSelecionado(pedido)}
          >
            Consultar
          </Button>
        </div>
      )
    }
  ]

  return (
    <div id="pagina-pedidos">
      <PageHeader
        title="Pedidos"
        subtitle="Acompanhe o status de cada pedido de aluguel"
        action={
          <Button
            id="botao-novo-pedido"
            onClick={() => navegar('/pedidos/novo')}
          >
            Novo pedido
          </Button>
        }
      />

      {erro && (
        <div role="alert" className={estilos.erro}>
          {erro}
        </div>
      )}

      {carregando ? (
        <p>Carregando pedidos...</p>
      ) : (
        <Table
          columns={colunas}
          rows={pedidos}
          empty="Nenhum pedido cadastrado."
        />
      )}

      {selecionado && (
        <Modal
          title={`Pedido #${selecionado.id}`}
          onClose={() => setSelecionado(null)}
        >
          <div
            id="detalhes-pedido"
            className={estilos.detalhes}
          >
            <span>
              <b>Cliente:</b> {nomeCliente(selecionado)}
            </span>

            <span>
              <b>Automóvel:</b> {nomeCarro(selecionado)}
            </span>

            <span>
              <b>Data da solicitação:</b>{' '}
              {fmtDataHora(selecionado.dataSolicitacao)}
            </span>

            <span>
              <b>Retirada:</b> {fmtData(selecionado.inicio)}
            </span>

            <span>
              <b>Devolução:</b> {fmtData(selecionado.fim)}
            </span>

            <span>
              <b>Status:</b>{' '}
              {statusLegivel(selecionado.status)}
            </span>
          </div>

          <div
            id="linha-do-tempo"
            className={estilos.linhaTempo}
          >
            {[
              ['PENDENTE', 'Pendente'],
              ['EM_ANALISE', 'Em análise'],
              ['APROVADA', 'Aprovada']
            ].map(([status, nome]) => {
              const ordem = [
                'PENDENTE',
                'EM_ANALISE',
                'APROVADA'
              ]

              const atual = ordem.indexOf(selecionado.status)
              const indice = ordem.indexOf(status)

              const concluida =
                atual >= 0 && indice <= atual

              return (
                <div
                  key={status}
                  className={`${estilos.etapa} ${
                    concluida ? estilos.concluida : ''
                  }`}
                >
                  {nome}
                </div>
              )
            })}
          </div>

          {selecionado.status === 'REPROVADA' && (
            <StatusBadge status="REPROVADA" />
          )}

          {selecionado.status === 'CANCELADA' && (
            <StatusBadge status="CANCELADA" />
          )}
        </Modal>
      )}
    </div>
  )
}
