
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import Field from '../../components/Field/Field.jsx'
import Button from '../../components/Button/Button.jsx'
import CarIcon from '../../components/CarIcon/CarIcon.jsx'
import estilos from './Cadastro.module.css'

export default function Cadastro() {
  const { registrar } = useAuth()
  const { salvarCliente } = useData()
  const navegar = useNavigate()

  const [dados, setDados] = useState({
    nome: '',
    usuario: '',
    senha: '',
    role: 'CLIENTE',
    agenteTipo: 'Banco'
  })

  const [erro, setErro] = useState('')

  const mudar = (campo) => (e) => {
    setDados({ ...dados, [campo]: e.target.value })
  }

  const enviar = (e) => {
    e.preventDefault()

    if (dados.senha.length < 3) {
      return setErro('A senha precisa ter ao menos 3 caracteres.')
    }

    const novo = { ...dados }

    if (dados.role === 'CLIENTE') {
      novo.clienteId = salvarCliente({
        nome: dados.nome,
        rg: '',
        cpf: '',
        endereco: '',
        profissao: '',
        rendimentos: []
      })
    }

    if (registrar(novo)) {
      navegar('/')
    } else {
      setErro('Esse usuário já existe. Escolha outro nome de usuário.')
    }
  }

  return (
    <div id="pagina-cadastro" className={estilos.tela}>
      <section className={estilos.cartao}>
        <div className={estilos.icone}>
          <CarIcon size={32} color="#7c3aed" />
        </div>

        <form
          id="formulario-cadastro"
          className={estilos.formulario}
          onSubmit={enviar}
        >
          <h2>Cadastro</h2>

          {erro && (
            <div
              id="mensagem-erro"
              className={estilos.erro}
              role="alert"
            >
              {erro}
            </div>
          )}

          <div className={estilos.opcoes}>
            <label>
              <input
                id="tipo-cliente"
                type="radio"
                checked={dados.role === 'CLIENTE'}
                onChange={() =>
                  setDados({ ...dados, role: 'CLIENTE' })
                }
              />
              Cliente
            </label>

            <label>
              <input
                id="tipo-agente"
                type="radio"
                checked={dados.role === 'AGENTE'}
                onChange={() =>
                  setDados({ ...dados, role: 'AGENTE' })
                }
              />
              Agente
            </label>
          </div>

          {dados.role === 'AGENTE' && (
            <Field
              id="tipo-agente-select"
              as="select"
              label="Tipo de agente"
              value={dados.agenteTipo}
              onChange={mudar('agenteTipo')}
            >
              <option>Banco</option>
              <option>Empresa</option>
            </Field>
          )}

          <Field
            id="nome"
            label="Nome completo"
            value={dados.nome}
            onChange={mudar('nome')}
            required
          />

          <Field
            id="usuario"
            label="Usuário"
            value={dados.usuario}
            onChange={mudar('usuario')}
            required
          />

          <Field
            id="senha"
            label="Senha"
            type="password"
            value={dados.senha}
            onChange={mudar('senha')}
            required
          />

          <Button id="botao-criar-conta" type="submit">
            Criar conta
          </Button>

          <p className={estilos.alternativa}>
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </section>
    </div>
  )
}
