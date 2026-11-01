package Back_end.demo.service;

import Back_end.demo.model.AvaliacaoFinanceira;
import Back_end.demo.model.Parecer;
import Back_end.demo.model.StatusSolicitacao;
import Back_end.demo.repository.AvaliacaoFinanceiraRepository;
import Back_end.demo.repository.SolicitacaoAluguelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AvaliacaoFinanceiraService {

    private final AvaliacaoFinanceiraRepository avaliacaoRepository;
    private final SolicitacaoAluguelRepository solicitacaoRepository;

    public AvaliacaoFinanceiraService(
            AvaliacaoFinanceiraRepository avaliacaoRepository,
            SolicitacaoAluguelRepository solicitacaoRepository) {

        this.avaliacaoRepository = avaliacaoRepository;
        this.solicitacaoRepository = solicitacaoRepository;
    }

    public AvaliacaoFinanceira salvar(AvaliacaoFinanceira avaliacao) {

        if (avaliacao.getSolicitacao() == null
                || avaliacao.getSolicitacao().getId() == null) {
            throw new IllegalArgumentException("Solicitação não informada.");
        }

        var solicitacao = solicitacaoRepository
                .findById(avaliacao.getSolicitacao().getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Solicitação não encontrada."
                ));

        if (avaliacao.getParecer() == null) {
            throw new IllegalArgumentException("Parecer não informado.");
        }

        solicitacao.setStatus(
                avaliacao.getParecer() == Parecer.FAVORAVEL
                        ? StatusSolicitacao.APROVADA
                        : StatusSolicitacao.REPROVADA
        );

        solicitacaoRepository.save(solicitacao);

        avaliacao.setSolicitacao(solicitacao);

        return avaliacaoRepository.save(avaliacao);
    }

    public List<AvaliacaoFinanceira> listarTodas() {
        return avaliacaoRepository.findAll();
    }

    public Optional<AvaliacaoFinanceira> buscarPorId(Long id) {
        return avaliacaoRepository.findById(id);
    }

    public void excluir(Long id) {
        avaliacaoRepository.deleteById(id);
    }
}