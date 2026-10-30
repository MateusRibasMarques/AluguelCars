
import estilos from './Button.module.css'

export default function Button({
  variant = 'primario',
  size,
  className = '',
  ...props
}) {
  const classes = [
    estilos.botao,
    estilos[variant],
    size === 'pequeno' ? estilos.pequeno : '',
    className
  ].join(' ')

  return <button className={classes} {...props} />
}
