
package Back_end.demo.service;

import Back_end.demo.model.Contrato;
import Back_end.demo.model.StatusSolicitacao;
import Back_end.demo.model.TipoUsuario;
import Back_end.demo.model.Usuario;
import Back_end.demo.repository.ContratoRepository;
import Back_end.demo.repository.SolicitacaoAluguelRepository;
import Back_end.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContratoService {

    private final ContratoRepository contratoRepository;
    private final SolicitacaoAluguelRepository solicitacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public ContratoService(
            ContratoRepository contratoRepository,
            SolicitacaoAluguelRepository solicitacaoRepository,
            UsuarioRepository usuarioRepository) {

        this.contratoRepository = contratoRepository;
        this.solicitacaoRepository = solicitacaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Contrato salvar(Contrato contrato, String email) {

        validarAgente(email);

        if (contrato.getSolicitacao() == null ||
                contrato.getSolicitacao().getId() == null) {
            throw new IllegalArgumentException(
                    "Solicitação não informada."
            );
        }

        var solicitacao = solicitacaoRepository
                .findById(contrato.getSolicitacao().getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Solicitação não encontrada."
                ));

        if (solicitacao.getStatus() != StatusSolicitacao.APROVADA) {
            throw new IllegalArgumentException(
                    "Somente solicitações aprovadas podem gerar contratos."
            );
        }

        if (contratoRepository.existsBySolicitacaoId(solicitacao.getId())) {
            throw new IllegalArgumentException(
                    "Esta solicitação já possui um contrato."
            );
        }

        contrato.setId(null);
        contrato.setSolicitacao(solicitacao);
        contrato.setDataContratacao(LocalDateTime.now());

        return contratoRepository.save(contrato);
    }

    public List<Contrato> listarTodos(String email) {
        validarAgente(email);
        return contratoRepository.findAll();
    }

    public Optional<Contrato> buscarPorId(Long id, String email) {
        validarAgente(email);
        return contratoRepository.findById(id);
    }

    public void excluir(Long id, String email) {
        validarAgente(email);

        Contrato contrato = contratoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Contrato não encontrado."
                ));

        contratoRepository.delete(contrato);
    }

    private void validarAgente(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Usuário não encontrado."
                ));

        if (usuario.getTipo() != TipoUsuario.AGENTE) {
            throw new IllegalArgumentException(
                    "Apenas agentes podem gerenciar contratos."
            );
        }
    }
}
