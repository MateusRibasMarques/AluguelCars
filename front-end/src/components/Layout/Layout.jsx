
import { Outlet } from 'react-router-dom'
import Header from '../Header/Header.jsx'
import estilos from './Layout.module.css'

export default function Layout() {
  return (
    <div id="estrutura" className={estilos.estrutura}>
      <Header />

      <main
        id="conteudo-principal"
        className={estilos.principal}
      >
        <Outlet />
      </main>
    </div>
  )
}
