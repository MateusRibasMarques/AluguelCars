
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Field from '../../components/Field/Field.jsx'
import Button from '../../components/Button/Button.jsx'
import estilos from './FormularioPedido.module.css'

export default function FormularioPedido() {
  const { id } = useParams()
  const navegar = useNavigate()

  const existente = null

  const [dados, setDados] = useState({
    automovelId: '',
    inicio: '',
    fim: ''
  })

  const [erro, setErro] = useState('')

  const mudar = (campo) => (e) =>
    setDados({ ...dados, [campo]: e.target.value })

  const enviar = (e) => {
    e.preventDefault()

    if (dados.fim < dados.inicio) {
      return setErro(
        'A data de devolução deve ser depois da data de retirada.'
      )
    }

    setErro('')
    navegar('/pedidos')
  }

  return (
    <div id="pagina-formulario-pedido">
      <PageHeader
        title={id ? `Modificar pedido #${id}` : 'Novo pedido de aluguel'}
        subtitle="Depois de enviado, o pedido segue para análise financeira dos agentes."
      />

      <form
        id="formulario-pedido"
        className={estilos.formulario}
        onSubmit={enviar}
      >
        {erro && (
          <div
            id="mensagem-erro"
            className={estilos.aviso}
            role="alert"
          >
            {erro}
          </div>
        )}

        <Field
          id="automovel"
          as="select"
          label="Automóvel"
          value={dados.automovelId}
          onChange={mudar('automovelId')}
          required
        >
          <option value="">Selecione um automóvel</option>
        </Field>

        <div className={estilos.duasColunas}>
          <Field
            id="retirada"
            label="Retirada"
            type="date"
            value={dados.inicio}
            onChange={mudar('inicio')}
            required
          />

          <Field
            id="devolucao"
            label="Devolução"
            type="date"
            value={dados.fim}
            onChange={mudar('fim')}
            required
          />
        </div>

        <div className={estilos.rodape}>
          <Button
            type="button"
            variant="contorno"
            onClick={() => navegar('/pedidos')}
          >
            Cancelar
          </Button>

          <Button id="botao-enviar-pedido" type="submit">
            {id ? 'Salvar alterações' : 'Enviar pedido'}
          </Button>
        </div>
      </form>
    </div>
  )
}
