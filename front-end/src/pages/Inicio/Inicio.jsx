
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Card from '../../components/Card/Card.jsx'
import Button from '../../components/Button/Button.jsx'
import estilos from './Inicio.module.css'

export default function Inicio() {
  const { user } = useAuth()
  const { pedidos, clientes, automoveis } = useData()

  const navegar = useNavigate()
  const ehCliente = user.role === 'CLIENTE'

  const meus = ehCliente
    ? pedidos.filter((p) => p.clienteId === user.clienteId)
    : pedidos

  const contar = (status) =>
    meus.filter((p) => p.status === status).length

  return (
    <div id="pagina-inicio">
      <PageHeader
        title={`Olá, ${user.nome.split(' ')[0]}`}
        subtitle={
          ehCliente
            ? 'Resumo dos seus pedidos de aluguel'
            : 'Resumo da carteira de pedidos'
        }
      />

      <div id="resumo-cartoes" className={estilos.cartoes}>
        <Card
          dark
          title={ehCliente ? 'Meus pedidos' : 'Pedidos recebidos'}
          value={meus.length}
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

        {!ehCliente && (
          <Card
            title="Clientes / Carros"
            value={`${clientes.length} / ${automoveis.length}`}
          />
        )}
      </div>

      <div id="chamada-acao" className={estilos.chamada}>
        <h2>
          {ehCliente
            ? 'Precisa de um carro?'
            : 'Há pedidos esperando análise.'}
        </h2>

        <Button
          variant="escuro"
          onClick={() =>
            navegar(ehCliente ? '/pedidos/novo' : '/avaliacao')
          }
        >
          {ehCliente ? 'Fazer novo pedido' : 'Avaliar pedidos'}
        </Button>
      </div>
    </div>
  )
}
