
package Back_end.demo.service;

import Back_end.demo.dto.LoginRequest;
import Back_end.demo.dto.LoginResponse;
import Back_end.demo.model.TipoUsuario;
import Back_end.demo.model.Usuario;
import Back_end.demo.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public Usuario cadastrar(Usuario usuario) {

        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException(
                    "Já existe um usuário cadastrado com esse e-mail."
            );
        }

        usuario.setTipo(TipoUsuario.CLIENTE);
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        return usuarioRepository.save(usuario);
    }

    public LoginResponse login(LoginRequest dados) {

        Usuario usuario = usuarioRepository.findByEmail(dados.email())
                .orElseThrow(() -> new IllegalArgumentException(
                        "E-mail ou senha inválidos."
                ));

        if (!passwordEncoder.matches(dados.senha(), usuario.getSenha())) {
            throw new IllegalArgumentException(
                    "E-mail ou senha inválidos."
            );
        }

        String token = jwtService.gerarToken(usuario);

        return new LoginResponse(
                token,
                usuario.getTipo().name(),
                usuario.getNome()
        );
    }
}
