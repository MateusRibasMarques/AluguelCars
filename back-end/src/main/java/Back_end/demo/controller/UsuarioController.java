
package Back_end.demo.controller;

import Back_end.demo.dto.LoginRequest;
import Back_end.demo.dto.LoginResponse;
import Back_end.demo.model.Usuario;
import Back_end.demo.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody Usuario usuario) {

        try {
            Usuario usuarioSalvo = usuarioService.cadastrar(usuario);

            usuarioSalvo.setSenha(null);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(usuarioSalvo);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest dados) {

        try {
            LoginResponse resposta = usuarioService.login(dados);

            return ResponseEntity.ok(resposta);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }
}
