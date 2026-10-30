
import estilos from './Field.module.css'

export default function Field({
  label,
  as: Tag = 'input',
  error,
  children,
  ...props
}) {
  return (
    <label className={estilos.campo}>
      <span>{label}</span>

      <Tag
        className={`${estilos.controle} ${error ? estilos.invalido : ''}`}
        {...props}
      >
        {children}
      </Tag>

      {error && <em>{error}</em>}
    </label>
  )
}
