
import estilos from './Modal.module.css'

export default function Modal({ title, onClose, children }) {
  return (
    <div className={estilos.fundo} onClick={onClose}>
      <div
        id="janela-modal"
        className={estilos.modal}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={estilos.topo}>
          <h2>{title}</h2>

          <button
            id="botao-fechar"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        {children}
      </div>
    </div>
  )
}
