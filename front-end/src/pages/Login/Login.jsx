
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Field from '../../components/Field/Field.jsx'
import Button from '../../components/Button/Button.jsx'
import CarIcon from '../../components/CarIcon/CarIcon.jsx'
import estilos from './Login.module.css'

export default function Login() {
  const { login } = useAuth()
  const navegar = useNavigate()

  const [dados, setDados] = useState({
    usuario: '',
    senha: ''
  })

  const [erro, setErro] = useState('')

  const enviar = (e) => {
    e.preventDefault()

    if (login(dados.usuario.trim(), dados.senha)) {
      navegar('/')
    } else {
      setErro('Usuário ou senha incorretos. Confira os dados e tente de novo.')
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
            Use seu usuário e senha cadastrados.
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
            id="usuario"
            label="Usuário"
            value={dados.usuario}
            onChange={(e) =>
              setDados({ ...dados, usuario: e.target.value })
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

          <Button id="botao-entrar" type="submit">
            Entrar
          </Button>

          <p className={estilos.alternativa}>
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </section>
    </div>
  )
}
