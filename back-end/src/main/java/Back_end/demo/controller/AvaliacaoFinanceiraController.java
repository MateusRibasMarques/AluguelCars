
package Back_end.demo.controller;

import Back_end.demo.model.AvaliacaoFinanceira;
import Back_end.demo.service.AvaliacaoFinanceiraService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/avaliacoes")
@CrossOrigin(origins = "http://localhost:5173")
public class AvaliacaoFinanceiraController {

    private final AvaliacaoFinanceiraService avaliacaoService;

    public AvaliacaoFinanceiraController(
            AvaliacaoFinanceiraService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(
            @RequestBody AvaliacaoFinanceira avaliacao,
            Authentication authentication) {

        try {
            return ResponseEntity.ok(
                    avaliacaoService.salvar(
                            avaliacao, authentication.getName()
                    )
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listarTodas(Authentication authentication) {
        try {
            return ResponseEntity.ok(
                    avaliacaoService.listarTodas(authentication.getName())
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
            return avaliacaoService.buscarPorId(
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
            avaliacaoService.excluir(id, authentication.getName());
            return ResponseEntity.noContent().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
