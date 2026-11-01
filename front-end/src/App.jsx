
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout/Layout.jsx'
import RotaPrivada from './components/RotaPrivada/RotaPrivada.jsx'

import Login from './pages/Login/Login.jsx'
import Cadastro from './pages/Cadastro/Cadastro.jsx'
import Inicio from './pages/Inicio/Inicio.jsx'
import Clientes from './pages/Clientes/Clientes.jsx'
import Automoveis from './pages/Automoveis/Automoveis.jsx'
import Pedidos from './pages/Pedidos/Pedidos.jsx'
import FormularioPedido from './pages/FormularioPedido/FormularioPedido.jsx'
import Avaliacao from './pages/Avaliacao/Avaliacao.jsx'
import DadosCliente from './pages/DadosCliente/DadosCliente.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route element={<RotaPrivada />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/automoveis" element={<Automoveis />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/pedidos/novo" element={<FormularioPedido />} />
            <Route path="/avaliacao" element={<Avaliacao />} />
            <Route path="/dados-cliente" element={<DadosCliente />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
