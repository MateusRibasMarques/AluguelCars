
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Card from '../../components/Card/Card.jsx'
import Button from '../../components/Button/Button.jsx'
import estilos from './Inicio.module.css'

export default function Inicio() {
  const navegar = useNavigate()

  // Sem backend, os dados começam vazios.
  const pedidos = []
  const clientes = []
  const automoveis = []

  const contar = (status) =>
    pedidos.filter((p) => p.status === status).length

  return (
    <div id="pagina-inicio">
      <PageHeader
        title="Olá!"
        subtitle="Resumo geral do sistema de aluguel"
      />

      <div id="resumo-cartoes" className={estilos.cartoes}>
        <Card
          dark
          title="Pedidos recebidos"
          value={pedidos.length}
        />

        <Card
          title="Em análise"
          value={contar('EM_ANALISE')}
          hint="aguardando parecer"
        />

        <Card
          title="Aprovados"
          value={contar('APROVADO')}
          hint="prontos para contrato"
        />

        <Card
          title="Contratos executados"
          value={contar('CONTRATO_EXECUTADO')}
        />

        <Card
          title="Clientes / Carros"
          value={`${clientes.length} / ${automoveis.length}`}
        />
      </div>

      <div id="chamada-acao" className={estilos.chamada}>
        <h2>Precisa de um carro?</h2>

        <Button
          variant="escuro"
          onClick={() => navegar('/pedidos/novo')}
        >
          Fazer novo pedido
        </Button>
      </div>
    </div>
  )
}
