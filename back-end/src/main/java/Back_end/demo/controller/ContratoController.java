
package Back_end.demo.controller;

import Back_end.demo.model.Contrato;
import Back_end.demo.service.ContratoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contratos")
@CrossOrigin(origins = "http://localhost:5173")
public class ContratoController {

    private final ContratoService contratoService;

    public ContratoController(ContratoService contratoService) {
        this.contratoService = contratoService;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(
            @RequestBody Contrato contrato,
            Authentication authentication) {

        try {
            return ResponseEntity.ok(
                    contratoService.salvar(
                            contrato, authentication.getName()
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
                    contratoService.listarTodos(authentication.getName())
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
            return contratoService.buscarPorId(
                    id, authentication.getName()
            )
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(
            @PathVariable Long id,
            Authentication authentication) {

        try {
            contratoService.excluir(id, authentication.getName());
            return ResponseEntity.noContent().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
