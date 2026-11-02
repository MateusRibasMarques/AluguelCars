
package Back_end.demo.service;

import Back_end.demo.model.Cliente;
import Back_end.demo.model.TipoUsuario;
import Back_end.demo.model.Usuario;
import Back_end.demo.repository.ClienteRepository;
import Back_end.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    public ClienteService(
            ClienteRepository clienteRepository,
            UsuarioRepository usuarioRepository) {

        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Cliente cadastrarDadosCliente(String email, Cliente cliente) {

        Usuario usuario = buscarUsuario(email);

        if (usuario.getTipo() != TipoUsuario.CLIENTE) {
            throw new IllegalArgumentException(
                    "Apenas clientes podem cadastrar seus próprios dados."
            );
        }

        if (usuario.getCliente() != null) {
            throw new IllegalArgumentException(
                    "Este usuário já possui um cadastro de cliente."
            );
        }

        validarEmpregos(cliente);

        cliente.setNome(usuario.getNome());

        Cliente clienteSalvo = clienteRepository.save(cliente);

        usuario.setCliente(clienteSalvo);
        usuarioRepository.save(usuario);

        return clienteSalvo;
    }

    public Optional<Cliente> buscarPorEmailUsuario(String email) {

        Usuario usuario = buscarUsuario(email);

        if (usuario.getTipo() != TipoUsuario.CLIENTE) {
            throw new IllegalArgumentException(
                    "Apenas clientes podem acessar esta operação."
            );
        }

        return Optional.ofNullable(usuario.getCliente());
    }

    public Cliente salvarComoAgente(String email, Cliente cliente) {

        validarAgente(email);
        validarEmpregos(cliente);

        return clienteRepository.save(cliente);
    }

    public List<Cliente> listarTodos(String email) {

        validarAgente(email);

        return clienteRepository.findAll();
    }

    public Optional<Cliente> buscarPorIdComoAgente(
            Long id, String email) {

        validarAgente(email);

        return clienteRepository.findById(id);
    }

    public Cliente atualizarComoAgente(
            Long id, Cliente dados, String email) {

        validarAgente(email);
        validarEmpregos(dados);

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Cliente não encontrado."
                ));

        cliente.setRg(dados.getRg());
        cliente.setCpf(dados.getCpf());
        cliente.setNome(dados.getNome());
        cliente.setEndereco(dados.getEndereco());
        cliente.setProfissao(dados.getProfissao());
        cliente.setEmpregos(dados.getEmpregos());

        return clienteRepository.save(cliente);
    }

    public void excluirComoAgente(Long id, String email) {

        validarAgente(email);

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Cliente não encontrado."
                ));

        clienteRepository.delete(cliente);
    }

    private Usuario buscarUsuario(String email) {

        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Usuário não encontrado."
                ));
    }

    private void validarAgente(String email) {

        Usuario usuario = buscarUsuario(email);

        if (usuario.getTipo() != TipoUsuario.AGENTE) {
            throw new IllegalArgumentException(
                    "Apenas agentes podem realizar esta operação."
            );
        }
    }

    private void validarEmpregos(Cliente cliente) {

        if (cliente.getEmpregos() != null &&
                cliente.getEmpregos().size() > 3) {

            throw new IllegalArgumentException(
                    "Um cliente pode possuir no máximo 3 empregos."
            );
        }
    }
}
