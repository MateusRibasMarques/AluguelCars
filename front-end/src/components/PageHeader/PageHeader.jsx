
import estilos from './PageHeader.module.css'

export default function PageHeader({
  title,
  subtitle,
  action
}) {
  return (
    <header className={estilos.cabecalhoPagina}>
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {action}
    </header>
  )
}
