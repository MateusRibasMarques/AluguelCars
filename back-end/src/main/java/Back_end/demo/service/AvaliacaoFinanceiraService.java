
package Back_end.demo.service;

import Back_end.demo.model.AvaliacaoFinanceira;
import Back_end.demo.model.Parecer;
import Back_end.demo.model.StatusSolicitacao;
import Back_end.demo.model.TipoUsuario;
import Back_end.demo.model.Usuario;
import Back_end.demo.repository.AvaliacaoFinanceiraRepository;
import Back_end.demo.repository.SolicitacaoAluguelRepository;
import Back_end.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AvaliacaoFinanceiraService {

    private final AvaliacaoFinanceiraRepository avaliacaoRepository;
    private final SolicitacaoAluguelRepository solicitacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public AvaliacaoFinanceiraService(
            AvaliacaoFinanceiraRepository avaliacaoRepository,
            SolicitacaoAluguelRepository solicitacaoRepository,
            UsuarioRepository usuarioRepository) {

        this.avaliacaoRepository = avaliacaoRepository;
        this.solicitacaoRepository = solicitacaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public AvaliacaoFinanceira salvar(
            AvaliacaoFinanceira avaliacao, String email) {

        buscarAgente(email);

        if (avaliacao.getSolicitacao() == null ||
                avaliacao.getSolicitacao().getId() == null) {
            throw new IllegalArgumentException(
                    "Solicitação não informada."
            );
        }

        var solicitacao = solicitacaoRepository
                .findById(avaliacao.getSolicitacao().getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Solicitação não encontrada."
                ));

        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE &&
                solicitacao.getStatus() != StatusSolicitacao.EM_ANALISE) {
            throw new IllegalArgumentException(
                    "Esta solicitação não pode mais ser avaliada."
            );
        }

        if (avaliacao.getParecer() == null) {
            throw new IllegalArgumentException(
                    "Parecer não informado."
            );
        }

        avaliacao.setId(null);
        avaliacao.setSolicitacao(solicitacao);

        solicitacao.setStatus(
                avaliacao.getParecer() == Parecer.FAVORAVEL
                        ? StatusSolicitacao.APROVADA
                        : StatusSolicitacao.REPROVADA
        );

        solicitacaoRepository.save(solicitacao);

        return avaliacaoRepository.save(avaliacao);
    }

    public List<AvaliacaoFinanceira> listarTodas(String email) {
        buscarAgente(email);
        return avaliacaoRepository.findAll();
    }

    public Optional<AvaliacaoFinanceira> buscarPorId(
            Long id, String email) {

        buscarAgente(email);
        return avaliacaoRepository.findById(id);
    }

    public void excluir(Long id, String email) {
        buscarAgente(email);

        AvaliacaoFinanceira avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Avaliação não encontrada."
                ));

        avaliacaoRepository.delete(avaliacao);
    }

    private Usuario buscarAgente(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Usuário não encontrado."
                ));

        if (usuario.getTipo() != TipoUsuario.AGENTE) {
            throw new IllegalArgumentException(
                    "Apenas agentes podem acessar as avaliações."
            );
        }

        return usuario;
    }
}
