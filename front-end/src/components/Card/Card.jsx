
import estilos from './Card.module.css'

export default function Card({ title, value, hint, dark }) {
  return (
    <div className={`${estilos.cartao} ${dark ? estilos.escuro : ''}`}>
      <span>{title}</span>

      <strong>{value}</strong>

      {hint && <small>{hint}</small>}
    </div>
  )
}
