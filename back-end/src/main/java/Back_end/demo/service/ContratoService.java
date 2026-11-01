package Back_end.demo.service;

import Back_end.demo.model.Contrato;
import Back_end.demo.model.StatusSolicitacao;
import Back_end.demo.repository.ContratoRepository;
import Back_end.demo.repository.SolicitacaoAluguelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContratoService {

    private final ContratoRepository contratoRepository;
    private final SolicitacaoAluguelRepository solicitacaoRepository;

    public ContratoService(
            ContratoRepository contratoRepository,
            SolicitacaoAluguelRepository solicitacaoRepository) {

        this.contratoRepository = contratoRepository;
        this.solicitacaoRepository = solicitacaoRepository;
    }

    public Contrato salvar(Contrato contrato) {

        if (contrato.getSolicitacao() == null
                || contrato.getSolicitacao().getId() == null) {
            throw new IllegalArgumentException("Solicitação não informada.");
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

        contrato.setSolicitacao(solicitacao);

        return contratoRepository.save(contrato);
    }

    public List<Contrato> listarTodos() {
        return contratoRepository.findAll();
    }

    public Optional<Contrato> buscarPorId(Long id) {
        return contratoRepository.findById(id);
    }

    public void excluir(Long id) {
        contratoRepository.deleteById(id);
    }
}