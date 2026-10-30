
import { NavLink } from 'react-router-dom'
import CarIcon from '../CarIcon/CarIcon.jsx'
import estilos from './Header.module.css'

export default function Header() {
  const links = [
    { to: '/', label: 'Início', end: true },
    { to: '/pedidos', label: 'Pedidos', end: true },
    { to: '/pedidos/novo', label: 'Novo pedido' },
    { to: '/avaliacao', label: 'Avaliação' },
    { to: '/clientes', label: 'Clientes' },
    { to: '/automoveis', label: 'Automóveis' }
  ]

  return (
    <header id="cabecalho" className={estilos.cabecalho}>
      <NavLink
        to="/"
        id="botao-logo"
        className={estilos.logo}
        aria-label="Ir para o início"
      >
        <CarIcon size={30} color="#7c3aed" />
      </NavLink>

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
    </header>
  )
}
