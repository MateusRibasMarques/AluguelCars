
import { useState } from 'react'
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
  const [edicao, setEdicao] = useState(null)

  const automoveis = []

  const mudar = (campo) => (e) =>
    setEdicao({ ...edicao, [campo]: e.target.value })

  const enviar = (e) => {
    e.preventDefault()
    setEdicao(null)
  }

  const colunas = [
    { key: 'matricula', label: 'Matrícula' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'ano', label: 'Ano' },
    { key: 'placa', label: 'Placa' },
    { key: 'proprietario', label: 'Propriedade' },
    {
      key: 'acoes',
      label: 'Ações',
      render: () => (
        <div className={estilos.acoes}>
          <Button size="pequeno" variant="contorno" disabled>
            Editar
          </Button>
          <Button size="pequeno" variant="perigo" disabled>
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
            onClick={() => setEdicao({ ...automovelVazio })}
          >
            Novo automóvel
          </Button>
        }
      />

      <Table columns={colunas} rows={automoveis} />

      {edicao && (
        <Modal
          title="Novo automóvel"
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
