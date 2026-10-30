
import { useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import Table from '../../components/Table/Table.jsx'
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import Field from '../../components/Field/Field.jsx'
import Button from '../../components/Button/Button.jsx'
import estilos from './Avaliacao.module.css'

const fmtData = (d) => d ? d.split('-').reverse().join('/') : '-'

const fmtMoeda = (v) =>
  Number(v).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

export default function Avaliacao() {
  const [selecionado, setSelecionado] = useState(null)

  const [dados, setDados] = useState({
    parecer: '',
    decisao: 'APROVADO',
    credito: false,
    valor: ''
  })

  const pedidos = []

  const colunas = [
    { key: 'id', label: '#' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'renda', label: 'Renda mensal' },
    { key: 'carro', label: 'Automóvel' },
    { key: 'periodo', label: 'Período' },
    {
      key: 'status',
      label: 'Status',
      render: (p) => <StatusBadge status={p.status} />
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: () => (
        <Button size="pequeno" variant="contorno" disabled>
          Avaliar
        </Button>
      )
    }
  ]

  const salvar = (e) => {
    e.preventDefault()
    setSelecionado(null)
  }

  return (
    <div id="pagina-avaliacao">
      <PageHeader
        title="Avaliar pedidos"
        subtitle="Análise financeira, parecer e execução de contratos"
      />

      <Table columns={colunas} rows={pedidos} />

      {selecionado && (
        <Modal
          title={`Avaliar pedido #${selecionado.id}`}
          onClose={() => setSelecionado(null)}
        >
          <form
            id="formulario-avaliacao"
            className={estilos.formulario}
            onSubmit={salvar}
          >
            <Field
              id="decisao"
              as="select"
              label="Parecer financeiro"
              value={dados.decisao}
              onChange={(e) =>
                setDados({ ...dados, decisao: e.target.value })
              }
            >
              <option value="APROVADO">
                Positivo — aprovar para contrato
              </option>
              <option value="REPROVADO">
                Negativo — reprovar
              </option>
            </Field>

            <Field
              id="observacoes"
              as="textarea"
              rows="3"
              label="Observações"
              value={dados.parecer}
              onChange={(e) =>
                setDados({ ...dados, parecer: e.target.value })
              }
            />

            <div className={estilos.rodape}>
              <Button
                type="button"
                variant="contorno"
                onClick={() => setSelecionado(null)}
              >
                Cancelar
              </Button>

              <Button type="submit">
                Salvar parecer
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
