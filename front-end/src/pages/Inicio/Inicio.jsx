
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Card from '../../components/Card/Card.jsx'
import Button from '../../components/Button/Button.jsx'
import { api } from '../../service/api.js'
import estilos from './Inicio.module.css'

export default function Inicio() {
  const navegar = useNavigate()

  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [automoveis, setAutomoveis] = useState([])

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      const tipoUsuario = localStorage.getItem('tipoUsuario')

      const requisicoes = [
        api('/api/solicitacoes'),
        api('/api/carros')
      ]

      if (tipoUsuario === 'AGENTE') {
        requisicoes.push(api('/api/clientes'))
      }

      const [resPedidos, resAutomoveis, resClientes] =
        await Promise.all(requisicoes)

      if (!resPedidos.ok || !resAutomoveis.ok) {
        throw new Error('Não foi possível carregar os dados.')
      }

      const [dadosPedidos, dadosAutomoveis] =
        await Promise.all([
          resPedidos.json(),
          resAutomoveis.json()
        ])

      setPedidos(dadosPedidos)
      setAutomoveis(dadosAutomoveis)

      if (tipoUsuario === 'AGENTE' && resClientes.ok) {
        const dadosClientes = await resClientes.json()

        setClientes(
          Array.isArray(dadosClientes)
            ? dadosClientes
            : dadosClientes
              ? [dadosClientes]
              : []
        )
      } else {
        setClientes([])
      }

    } catch (erro) {
      console.error('Erro ao carregar dashboard:', erro)
    }
  }

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
          value={contar('APROVADA')}
          hint="prontos para contrato"
        />

        <Card
          title="Contratos executados"
          value={contar('CONTRATO_EXECUTADO')}
        />

        <Card
          title="Clientes / Carros"
          value={clientes.length + ' / ' + automoveis.length}
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
