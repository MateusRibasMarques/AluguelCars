
package Back_end.demo.controller;

import Back_end.demo.model.Cliente;
import Back_end.demo.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:5173")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping("/me")
    public ResponseEntity<?> cadastrarMeusDados(
            @RequestBody Cliente cliente,
            Authentication authentication) {

        try {
            Cliente novoCliente = clienteService.cadastrarDadosCliente(
                    authentication.getName(), cliente
            );

            return ResponseEntity.ok(novoCliente);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> meusDados(Authentication authentication) {

        return clienteService.buscarPorEmailUsuario(
                authentication.getName()
        )
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(
            @RequestBody Cliente cliente,
            Authentication authentication) {

        try {
            return ResponseEntity.ok(
                    clienteService.salvarComoAgente(
                            authentication.getName(), cliente
                    )
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listarTodos(Authentication authentication) {

        try {
            return ResponseEntity.ok(
                    clienteService.listarTodos(authentication.getName())
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(
            @PathVariable Long id,
            Authentication authentication) {

        try {
            return clienteService.buscarPorIdComoAgente(
                    id, authentication.getName()
            )
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody Cliente cliente,
            Authentication authentication) {

        try {
            return ResponseEntity.ok(
                    clienteService.atualizarComoAgente(
                            id, cliente, authentication.getName()
                    )
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(
            @PathVariable Long id,
            Authentication authentication) {

        try {
            clienteService.excluirComoAgente(
                    id, authentication.getName()
            );

            return ResponseEntity.noContent().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
