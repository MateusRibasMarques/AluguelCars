package Back_end.demo.service;

import Back_end.demo.model.Agente;
import Back_end.demo.repository.AgenteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgenteService {

    private final AgenteRepository agenteRepository;

    public AgenteService(AgenteRepository agenteRepository) {
        this.agenteRepository = agenteRepository;
    }

    public Agente salvar(Agente agente) {
        return agenteRepository.save(agente);
    }

    public List<Agente> listarTodos() {
        return agenteRepository.findAll();
    }

    public Optional<Agente> buscarPorId(Long id) {
        return agenteRepository.findById(id);
    }

    public void excluir(Long id) {
        agenteRepository.deleteById(id);
    }
}