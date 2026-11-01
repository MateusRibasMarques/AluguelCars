
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Field from '../../components/Field/Field.jsx'
import Button from '../../components/Button/Button.jsx'
import CarIcon from '../../components/CarIcon/CarIcon.jsx'
import estilos from './Login.module.css'

export default function Login() {
  const [dados, setDados] = useState({
    email: '',
    senha: ''
  })

  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const navegar = useNavigate()

  const enviar = async (e) => {
    e.preventDefault()
    setErro('')

    try {
      setCarregando(true)

      const resposta = await fetch(
        'http://localhost:8080/api/usuarios/login',
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
            : 'E-mail ou senha inválidos.'
        )
      }

      localStorage.setItem('token', resultado.token)
      localStorage.setItem('tipoUsuario', resultado.tipo)
      localStorage.setItem('nomeUsuario', resultado.nome)

      navegar('/')
    } catch (erro) {
      setErro(erro.message || 'Erro ao conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div id="pagina-login" className={estilos.tela}>
      <section className={estilos.cartao}>
        <div className={estilos.icone}>
          <CarIcon size={32} color="#7c3aed" />
        </div>

        <form
          id="formulario-login"
          className={estilos.formulario}
          onSubmit={enviar}
        >
          <h2>Entrar</h2>

          <p className={estilos.subtitulo}>
            Use seu e-mail e senha cadastrados.
          </p>

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
            id="email"
            label="E-mail"
            type="email"
            value={dados.email}
            onChange={(e) =>
              setDados({ ...dados, email: e.target.value })
            }
            required
          />

          <Field
            id="senha"
            label="Senha"
            type="password"
            value={dados.senha}
            onChange={(e) =>
              setDados({ ...dados, senha: e.target.value })
            }
            required
          />

          <Button
            id="botao-entrar"
            type="submit"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </Button>

          <p className={estilos.alternativa}>
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </section>
    </div>
  )
}
