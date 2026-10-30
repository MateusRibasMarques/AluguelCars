
import estilos from './Table.module.css'

export default function Table({
  columns,
  rows,
  empty = 'Nenhum registro encontrado.'
}) {
  if (!rows.length) {
    return (
      <div className={estilos.vazio}>
        {empty}
      </div>
    )
  }

  return (
    <div className={estilos.envoltorio}>
      <table className={estilos.tabela}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              {columns.map((c) => (
                <td key={c.key}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
