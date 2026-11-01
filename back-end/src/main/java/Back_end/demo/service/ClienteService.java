package Back_end.demo.service;

import Back_end.demo.model.Cliente;
import Back_end.demo.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Cliente salvar(Cliente cliente) {

        if (cliente.getEmpregos() != null && cliente.getEmpregos().size() > 3) {
            throw new IllegalArgumentException(
                    "Um cliente pode possuir no máximo 3 empregos."
            );
        }

        return clienteRepository.save(cliente);
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Optional<Cliente> buscarPorId(Long id) {
        return clienteRepository.findById(id);
    }

    public void excluir(Long id) {
        clienteRepository.deleteById(id);
    }
}