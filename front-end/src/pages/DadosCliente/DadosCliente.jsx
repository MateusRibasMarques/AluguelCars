import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Field from '../../components/Field/Field.jsx'
import Button from '../../components/Button/Button.jsx'
import { api } from '../../services/api.js'

export default function DadosCliente() {
  const navegar = useNavigate()

  const [dados, setDados] = useState({
    rg: '',
    cpf: '',
    endereco: '',
    profissao: '',
    empregos: [
      { empregador: '', rendimento: '' }
    ]
  })

  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const mudar = (campo) => (e) => {
    setDados({ ...dados, [campo]: e.target.value })
  }

  const mudarEmprego = (index, campo, valor) => {
    const empregos = [...dados.empregos]
    empregos[index][campo] = valor

    setDados({ ...dados, empregos })
  }

  const adicionarEmprego = () => {
    if (dados.empregos.length >= 3) return

    setDados({
      ...dados,
      empregos: [
        ...dados.empregos,
        { empregador: '', rendimento: '' }
      ]
    })
  }

  const removerEmprego = (index) => {
    setDados({
      ...dados,
      empregos: dados.empregos.filter((_, i) => i !== index)
    })
  }

  const enviar = async (e) => {
    e.preventDefault()
    setErro('')

    try {
      setCarregando(true)

      const resposta = await api('/api/clientes/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rg: dados.rg,
          cpf: dados.cpf,
          endereco: dados.endereco,
          profissao: dados.profissao,
          empregos: dados.empregos
            .filter(emprego => emprego.empregador.trim() !== '')
            .map(emprego => ({
              empregador: emprego.empregador,
              rendimento: Number(emprego.rendimento)
            }))
        })
      })

      const resultado = await resposta.json()

      if (!resposta.ok) {
        throw new Error(
          typeof resultado === 'string'
            ? resultado
            : 'Não foi possível salvar os dados.'
        )
      }

      navegar('/')

    } catch (erro) {
      setErro(erro.message || 'Erro ao conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div id="pagina-dados-cliente">
      <PageHeader
        title="Dados pessoais"
        subtitle="Complete seu cadastro para poder solicitar um aluguel."
      />

      <form id="formulario-dados-cliente" onSubmit={enviar}>
        {erro && (
          <div role="alert">
            {erro}
          </div>
        )}

        <Field
          id="rg"
          label="RG"
          value={dados.rg}
          onChange={mudar('rg')}
          required
        />

        <Field
          id="cpf"
          label="CPF"
          value={dados.cpf}
          onChange={mudar('cpf')}
          required
        />

        <Field
          id="endereco"
          label="Endereço"
          value={dados.endereco}
          onChange={mudar('endereco')}
          required
        />

        <Field
          id="profissao"
          label="Profissão"
          value={dados.profissao}
          onChange={mudar('profissao')}
          required
        />

        <h3>Rendimentos e empregos</h3>

        {dados.empregos.map((emprego, index) => (
          <div key={index}>
            <h4>Emprego {index + 1}</h4>

            <Field
              id={`empregador-${index}`}
              label="Empregador"
              value={emprego.empregador}
              onChange={(e) =>
                mudarEmprego(index, 'empregador', e.target.value)
              }
            />

            <Field
              id={`rendimento-${index}`}
              label="Rendimento mensal"
              type="number"
              value={emprego.rendimento}
              onChange={(e) =>
                mudarEmprego(index, 'rendimento', e.target.value)
              }
            />

            {dados.empregos.length > 1 && (
              <Button
                type="button"
                variant="contorno"
                onClick={() => removerEmprego(index)}
              >
                Remover emprego
              </Button>
            )}
          </div>
        ))}

        {dados.empregos.length < 3 && (
          <Button
            type="button"
            variant="contorno"
            onClick={adicionarEmprego}
          >
            Adicionar emprego
          </Button>
        )}

        <Button
          id="botao-salvar-dados"
          type="submit"
          disabled={carregando}
        >
          {carregando ? 'Salvando...' : 'Salvar dados'}
        </Button>
      </form>
    </div>
  )
}