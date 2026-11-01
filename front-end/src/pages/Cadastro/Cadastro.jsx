
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Field from '../../components/Field/Field.jsx'
import Button from '../../components/Button/Button.jsx'
import CarIcon from '../../components/CarIcon/CarIcon.jsx'
import estilos from './Cadastro.module.css'

export default function Cadastro() {
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    senha: ''
  })

  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const navegar = useNavigate()

  const mudar = (campo) => (e) => {
    setDados({ ...dados, [campo]: e.target.value })
  }

  const enviar = async (e) => {
    e.preventDefault()
    setErro('')

    if (dados.senha.length < 3) {
      return setErro('A senha precisa ter ao menos 3 caracteres.')
    }

    try {
      setCarregando(true)

      const resposta = await fetch(
        'http://localhost:8080/api/usuarios/cadastro',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados)
        }
      )

      const resultado = await resposta.json()

      if (!resposta.ok) {
        throw new Error(
          typeof resultado === 'string'
            ? resultado
            : 'Não foi possível realizar o cadastro.'
        )
      }

      navegar('/login')
    } catch (erro) {
      setErro(erro.message || 'Erro ao conectar com o servidor.')
    } finally {
      setCarregando(false)
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

          <Field
            id="nome"
            label="Nome completo"
            value={dados.nome}
            onChange={mudar('nome')}
            required
          />

          <Field
            id="email"
            label="E-mail"
            type="email"
            value={dados.email}
            onChange={mudar('email')}
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

          <Button
            id="botao-criar-conta"
            type="submit"
            disabled={carregando}
          >
            {carregando ? 'Cadastrando...' : 'Criar conta'}
          </Button>

          <p className={estilos.alternativa}>
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </section>
    </div>
  )
}
