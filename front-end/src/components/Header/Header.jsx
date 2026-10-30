
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import CarIcon from '../CarIcon/CarIcon.jsx'
import estilos from './Header.module.css'

export default function Header() {
  const { user, logout } = useAuth()
  const navegar = useNavigate()

  const links = [
    { to: '/', label: 'Início', end: true },
    {
      to: '/pedidos',
      label: user.role === 'CLIENTE' ? 'Meus pedidos' : 'Todos os pedidos',
      end: true
    },
    ...(user.role === 'CLIENTE'
      ? [{ to: '/pedidos/novo', label: 'Novo pedido' }]
      : []),
    ...(user.role === 'AGENTE'
      ? [{ to: '/avaliacao', label: 'Avaliar pedidos' }]
      : []),
    { to: '/clientes', label: 'Clientes' },
    { to: '/automoveis', label: 'Automóveis' }
  ]

  return (
    <header id="cabecalho" className={estilos.cabecalho}>
      <button
        id="botao-logo"
        className={estilos.logo}
        onClick={() => navegar('/')}
        aria-label="Ir para o início"
      >
        <CarIcon size={30} color="#7c3aed" />
      </button>

      <nav id="menu" className={estilos.menu}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              isActive
                ? `${estilos.link} ${estilos.ativo}`
                : estilos.link
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div id="usuario-logado" className={estilos.usuario}>
        <div>
          <strong>{user.nome}</strong>
          <small>
            {user.role === 'CLIENTE'
              ? 'Cliente'
              : `Agente · ${user.agenteTipo}`}
          </small>
        </div>

        <button
          id="botao-sair"
          onClick={() => {
            logout()
            navegar('/login')
          }}
        >
          Sair
        </button>
      </div>
    </header>
  )
}
