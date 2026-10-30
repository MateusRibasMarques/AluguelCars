
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Table from '../../components/Table/Table.jsx'
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import Button from '../../components/Button/Button.jsx'
import estilos from './Pedidos.module.css'

const ETAPAS = [
  ['EM_ANALISE', 'Em análise'],
  ['APROVADO', 'Aprovado'],
  ['CONTRATO_EXECUTADO', 'Contrato']
]

const fmtData = (d) => d ? d.split('-').reverse().join('/') : '-'

const fmtMoeda = (v) =>
  Number(v).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

export default function Pedidos() {
  const navegar = useNavigate()
  const [selecionado, setSelecionado] = useState(null)

  // Sem backend: a tabela permanece vazia.
  const pedidos = []

  const nomeCliente = (pedido) => pedido.cliente?.nome ?? '-'
  const nomeCarro = (pedido) => {
    const carro = pedido.automovel

    return carro
      ? `${carro.marca} ${carro.modelo} (${carro.placa})`
      : '-'
  }

  const etapaAtual = selecionado
    ? ETAPAS.findIndex(([status]) => status === selecionado.status)
    : -1

  const colunas = [
    { key: 'id', label: '#' },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (p) => nomeCliente(p)
    },
    {
      key: 'carro',
      label: 'Automóvel',
      render: (p) => nomeCarro(p)
    },
    {
      key: 'periodo',
      label: 'Período',
      render: (p) => `${fmtData(p.inicio)} → ${fmtData(p.fim)}`
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
        <div className={estilos.acoes}>
          <Button
            size="pequeno"
            variant="escuro"
            onClick={() => setSelecionado(p)}
          >
            Consultar
          </Button>
          <Button size="pequeno" variant="contorno" disabled>
            Modificar
          </Button>
          <Button size="pequeno" variant="perigo" disabled>
            Cancelar
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

      <Table
        columns={colunas}
        rows={pedidos}
        empty="Nenhum pedido cadastrado."
      />

      {selecionado && (
        <Modal
          title={`Pedido #${selecionado.id}`}
          onClose={() => setSelecionado(null)}
        >
          <div id="detalhes-pedido" className={estilos.detalhes}>
            <span>
              <b>Cliente:</b> {nomeCliente(selecionado)}
            </span>

            <span>
              <b>Automóvel:</b> {nomeCarro(selecionado)}
            </span>

            <span>
              <b>Período:</b> {fmtData(selecionado.inicio)} a {fmtData(selecionado.fim)}
            </span>

            <span>
              <b>Contrato de crédito:</b>{' '}
              {selecionado.credito
                ? `${selecionado.credito.banco} — ${fmtMoeda(selecionado.credito.valor)}`
                : 'Sem crédito associado'}
            </span>

            {selecionado.parecer && (
              <span>
                <b>Parecer do agente:</b> {selecionado.parecer}
              </span>
            )}
          </div>

          {selecionado.status === 'REPROVADO' ||
          selecionado.status === 'CANCELADO' ? (
            <StatusBadge status={selecionado.status} />
          ) : (
            <div id="linha-do-tempo" className={estilos.linhaTempo}>
              {ETAPAS.map(([status, nome], i) => (
                <div
                  key={status}
                  className={`${estilos.etapa} ${
                    i <= etapaAtual ? estilos.concluida : ''
                  }`}
                >
                  {nome}
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
