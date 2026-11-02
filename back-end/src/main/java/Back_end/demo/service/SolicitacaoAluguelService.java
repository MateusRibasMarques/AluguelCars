
package Back_end.demo.service;

import Back_end.demo.model.Carro;
import Back_end.demo.model.Cliente;
import Back_end.demo.model.SolicitacaoAluguel;
import Back_end.demo.model.StatusSolicitacao;
import Back_end.demo.model.TipoUsuario;
import Back_end.demo.model.Usuario;
import Back_end.demo.repository.CarroRepository;
import Back_end.demo.repository.SolicitacaoAluguelRepository;
import Back_end.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SolicitacaoAluguelService {

    private final SolicitacaoAluguelRepository solicitacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CarroRepository carroRepository;

    public SolicitacaoAluguelService(
            SolicitacaoAluguelRepository solicitacaoRepository,
            UsuarioRepository usuarioRepository,
            CarroRepository carroRepository) {

        this.solicitacaoRepository = solicitacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.carroRepository = carroRepository;
    }

    @Transactional
    public SolicitacaoAluguel salvar(
            String email,
            SolicitacaoAluguel solicitacao) {

        Usuario usuario = buscarUsuario(email);

        if (usuario.getTipo() != TipoUsuario.CLIENTE) {
            throw new IllegalArgumentException(
                    "Apenas clientes podem solicitar aluguéis."
            );
        }

        Cliente cliente = usuario.getCliente();

        if (cliente == null) {
            throw new IllegalArgumentException(
                    "Complete seus dados pessoais antes de solicitar um aluguel."
            );
        }

        if (solicitacao.getCarro() == null ||
                solicitacao.getCarro().getId() == null) {
            throw new IllegalArgumentException("Selecione um automóvel.");
        }

        Carro carro = carroRepository.findById(
                solicitacao.getCarro().getId()
        ).orElseThrow(() -> new IllegalArgumentException(
                "Automóvel não encontrado."
        ));

        LocalDate inicio = solicitacao.getInicio();
        LocalDate fim = solicitacao.getFim();

        if (inicio == null || fim == null) {
            throw new IllegalArgumentException(
                    "Informe as datas de retirada e devolução."
            );
        }

        if (inicio.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "A retirada não pode ocorrer em uma data passada."
            );
        }

        if (fim.isBefore(inicio)) {
            throw new IllegalArgumentException(
                    "A devolução não pode ocorrer antes da retirada."
            );
        }

        solicitacao.setId(null);
        solicitacao.setCliente(cliente);
        solicitacao.setCarro(carro);
        solicitacao.setStatus(StatusSolicitacao.PENDENTE);
        solicitacao.setDataSolicitacao(LocalDateTime.now());

        return solicitacaoRepository.save(solicitacao);
    }

    public List<SolicitacaoAluguel> listarTodos(String email) {

        Usuario usuario = buscarUsuario(email);

        if (usuario.getTipo() == TipoUsuario.AGENTE) {
            return solicitacaoRepository.findAll();
        }

        if (usuario.getCliente() == null) {
            return List.of();
        }

        return solicitacaoRepository.findByClienteId(
                usuario.getCliente().getId()
        );
    }

    public Optional<SolicitacaoAluguel> buscarPorId(
            Long id,
            String email) {

        Usuario usuario = buscarUsuario(email);

        Optional<SolicitacaoAluguel> solicitacao =
                solicitacaoRepository.findById(id);

        if (usuario.getTipo() == TipoUsuario.AGENTE) {
            return solicitacao;
        }

        return solicitacao.filter(s ->
                usuario.getCliente() != null &&
                s.getCliente().getId().equals(usuario.getCliente().getId())
        );
    }

    @Transactional
    public void excluir(Long id, String email) {

        SolicitacaoAluguel solicitacao = buscarPorId(id, email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Solicitação não encontrada ou sem permissão para excluí-la."
                ));

        solicitacaoRepository.delete(solicitacao);
    }

    @Transactional
    public void cancelar(Long id, String email) {

        Usuario usuario = buscarUsuario(email);

        if (usuario.getTipo() != TipoUsuario.CLIENTE) {
            throw new IllegalArgumentException(
                    "Apenas clientes podem cancelar solicitações."
            );
        }

        SolicitacaoAluguel solicitacao = buscarPorId(id, email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Solicitação não encontrada ou sem permissão para cancelá-la."
                ));

        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE &&
                solicitacao.getStatus() != StatusSolicitacao.EM_ANALISE) {
            throw new IllegalArgumentException(
                    "Esta solicitação não pode ser cancelada."
            );
        }

        solicitacao.setStatus(StatusSolicitacao.CANCELADA);
        solicitacaoRepository.save(solicitacao);
    }

    @Transactional
    public void avaliar(
            Long id,
            String email,
            StatusSolicitacao decisao,
            String parecer) {

        Usuario usuario = buscarUsuario(email);

        if (usuario.getTipo() != TipoUsuario.AGENTE) {
            throw new IllegalArgumentException(
                    "Apenas agentes podem avaliar solicitações."
            );
        }

        if (decisao != StatusSolicitacao.APROVADA &&
                decisao != StatusSolicitacao.REPROVADA) {
            throw new IllegalArgumentException(
                    "Decisão inválida."
            );
        }

        SolicitacaoAluguel solicitacao = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Solicitação não encontrada."
                ));

        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE) {
            throw new IllegalArgumentException(
                    "Esta solicitação já foi avaliada."
            );
        }

        solicitacao.setStatus(decisao);
        solicitacao.setParecer(parecer);

        solicitacaoRepository.save(solicitacao);
    }

    private Usuario buscarUsuario(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Usuário não encontrado."
                ));
    }
}
