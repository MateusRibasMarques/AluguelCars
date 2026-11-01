package Back_end.demo.service;

import Back_end.demo.model.SolicitacaoAluguel;
import Back_end.demo.repository.SolicitacaoAluguelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SolicitacaoAluguelService {

    private final SolicitacaoAluguelRepository solicitacaoRepository;

    public SolicitacaoAluguelService(SolicitacaoAluguelRepository solicitacaoRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
    }

    public SolicitacaoAluguel salvar(SolicitacaoAluguel solicitacao) {
        return solicitacaoRepository.save(solicitacao);
    }

    public List<SolicitacaoAluguel> listarTodos() {
        return solicitacaoRepository.findAll();
    }

    public Optional<SolicitacaoAluguel> buscarPorId(Long id) {
        return solicitacaoRepository.findById(id);
    }

    public void excluir(Long id) {
        solicitacaoRepository.deleteById(id);
    }
}