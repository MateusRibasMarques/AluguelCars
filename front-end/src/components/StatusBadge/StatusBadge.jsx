
import estilos from './StatusBadge.module.css'

const STATUS = {
  EM_ANALISE: 'Em análise',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  CONTRATO_EXECUTADO: 'Contrato executado',
  CANCELADO: 'Cancelado'
}

export default function StatusBadge({ status }) {
  return (
    <span className={`${estilos.selo} ${estilos[status]}`}>
      {STATUS[status] || status}
    </span>
  )
}
