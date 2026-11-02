
package Back_end.demo.service;

import Back_end.demo.model.Carro;
import Back_end.demo.model.TipoUsuario;
import Back_end.demo.model.Usuario;
import Back_end.demo.repository.CarroRepository;
import Back_end.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarroService {

    private final CarroRepository carroRepository;
    private final UsuarioRepository usuarioRepository;

    public CarroService(
            CarroRepository carroRepository,
            UsuarioRepository usuarioRepository) {
        this.carroRepository = carroRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Carro salvar(String email, Carro carro) {
        validarAgente(email);
        return carroRepository.save(carro);
    }

    public List<Carro> listarTodos() {
        return carroRepository.findAll();
    }

    public Optional<Carro> buscarPorId(Long id) {
        return carroRepository.findById(id);
    }

    public Carro atualizar(Long id, Carro dados, String email) {
        validarAgente(email);

        Carro carro = carroRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Automóvel não encontrado."
                ));

        carro.setMatricula(dados.getMatricula());
        carro.setAno(dados.getAno());
        carro.setMarca(dados.getMarca());
        carro.setModelo(dados.getModelo());
        carro.setPlaca(dados.getPlaca());
        carro.setProprietario(dados.getProprietario());

        return carroRepository.save(carro);
    }

    public void excluir(Long id, String email) {
        validarAgente(email);

        Carro carro = carroRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Automóvel não encontrado."
                ));

        carroRepository.delete(carro);
    }

    private void validarAgente(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Usuário não encontrado."
                ));

        if (usuario.getTipo() != TipoUsuario.AGENTE) {
            throw new IllegalArgumentException(
                    "Apenas agentes podem realizar esta operação."
            );
        }
    }
}
