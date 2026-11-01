
import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Table from '../../components/Table/Table.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import Field from '../../components/Field/Field.jsx'
import Button from '../../components/Button/Button.jsx'
import estilos from './Automoveis.module.css'

const automovelVazio = {
  matricula: '',
  ano: '',
  marca: '',
  modelo: '',
  placa: '',
  proprietario: 'Empresa'
}

export default function Automoveis() {
  const [automoveis, setAutomoveis] = useState([])
  const [edicao, setEdicao] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarAutomoveis()
  }, [])

  async function carregarAutomoveis() {
    try {
      setCarregando(true)
      setErro('')

      const resposta = await api('/api/carros')

      if (!resposta.ok) {
        throw new Error('Não foi possível carregar os automóveis.')
      }

      const dados = await resposta.json()
      setAutomoveis(dados)
    } catch (erro) {
      setErro(erro.message)
    } finally {
      setCarregando(false)
    }
  }

  const mudar = campo => e => {
    setEdicao({ ...edicao, [campo]: e.target.value })
  }

  async function enviar(e) {
    e.preventDefault()

    try {
      setErro('')

      const carro = {
        matricula: edicao.matricula,
        ano: Number(edicao.ano),
        marca: edicao.marca,
        modelo: edicao.modelo,
        placa: edicao.placa,
        proprietario: edicao.proprietario.toUpperCase()
      }

      const editando = Boolean(edicao.id)

      const resposta = await api(
        editando
          ? `/api/carros/${edicao.id}`
          : '/api/carros',
        {
          method: editando ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(carro)
        }
      )

      if (!resposta.ok) {
        const mensagem = await resposta.text()
        throw new Error(
          mensagem || 'Não foi possível salvar o automóvel.'
        )
      }

      setEdicao(null)
      await carregarAutomoveis()
    } catch (erro) {
      setErro(erro.message)
    }
  }

  async function excluir(id) {
    if (!window.confirm('Deseja realmente excluir este automóvel?')) {
      return
    }

    try {
      setErro('')

      const resposta = await api(`/api/carros/${id}`, {
        method: 'DELETE'
      })

      if (!resposta.ok) {
        throw new Error('Não foi possível excluir o automóvel.')
      }

      await carregarAutomoveis()
    } catch (erro) {
      setErro(erro.message)
    }
  }

  function editar(carro) {
    setErro('')

    setEdicao({
      ...carro,
      proprietario: carro.proprietario
        ? carro.proprietario.charAt(0) +
          carro.proprietario.slice(1).toLowerCase()
        : 'Empresa'
    })
  }

  const colunas = [
    { key: 'matricula', label: 'Matrícula' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'ano', label: 'Ano' },
    { key: 'placa', label: 'Placa' },
    {
      key: 'proprietario',
      label: 'Propriedade',
      render: carro => carro.proprietario
        ? carro.proprietario.charAt(0) +
          carro.proprietario.slice(1).toLowerCase()
        : 'Não informado'
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: carro => (
        <div className={estilos.acoes}>
          <Button
            size="pequeno"
            variant="contorno"
            onClick={() => editar(carro)}
          >
            Editar
          </Button>

          <Button
            size="pequeno"
            variant="perigo"
            onClick={() => excluir(carro.id)}
          >
            Excluir
          </Button>
        </div>
      )
    }
  ]

  return (
    <div id="pagina-automoveis">
      <PageHeader
        title="Automóveis"
        subtitle="Frota disponível para aluguel"
        action={
          <Button
            id="botao-novo-automovel"
            onClick={() => {
              setErro('')
              setEdicao({ ...automovelVazio })
            }}
          >
            Novo automóvel
          </Button>
        }
      />

      {erro && (
        <div role="alert" className={estilos.erro}>
          {erro}
        </div>
      )}

      {carregando ? (
        <p>Carregando automóveis...</p>
      ) : (
        <Table columns={colunas} rows={automoveis} />
      )}

      {edicao && (
        <Modal
          title={edicao.id ? 'Editar automóvel' : 'Novo automóvel'}
          onClose={() => setEdicao(null)}
        >
          <form
            id="formulario-automovel"
            className={estilos.formulario}
            onSubmit={enviar}
          >
            <div className={estilos.duasColunas}>
              <Field
                id="matricula"
                label="Matrícula"
                value={edicao.matricula}
                onChange={mudar('matricula')}
                required
              />

              <Field
                id="placa"
                label="Placa"
                value={edicao.placa}
                onChange={mudar('placa')}
                required
              />

              <Field
                id="marca"
                label="Marca"
                value={edicao.marca}
                onChange={mudar('marca')}
                required
              />

              <Field
                id="modelo"
                label="Modelo"
                value={edicao.modelo}
                onChange={mudar('modelo')}
                required
              />

              <Field
                id="ano"
                label="Ano"
                type="number"
                value={edicao.ano}
                onChange={mudar('ano')}
                required
              />

              <Field
                id="proprietario"
                as="select"
                label="Registrado como propriedade de"
                value={edicao.proprietario}
                onChange={mudar('proprietario')}
              >
                <option>Cliente</option>
                <option>Empresa</option>
                <option>Banco</option>
              </Field>
            </div>

            <div className={estilos.rodape}>
              <Button
                type="button"
                variant="contorno"
                onClick={() => setEdicao(null)}
              >
                Cancelar
              </Button>

              <Button
                id="botao-salvar-automovel"
                type="submit"
              >
                Salvar automóvel
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
