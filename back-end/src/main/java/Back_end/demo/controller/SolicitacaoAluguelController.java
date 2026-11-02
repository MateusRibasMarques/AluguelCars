
package Back_end.demo.controller;

import Back_end.demo.model.SolicitacaoAluguel;
import Back_end.demo.model.StatusSolicitacao;
import Back_end.demo.service.SolicitacaoAluguelService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin(origins = "http://localhost:5173")
public class SolicitacaoAluguelController {

    private final SolicitacaoAluguelService solicitacaoService;

    public SolicitacaoAluguelController(
            SolicitacaoAluguelService solicitacaoService) {

        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(
            @RequestBody SolicitacaoAluguel solicitacao,
            Authentication authentication) {

        try {
            SolicitacaoAluguel novaSolicitacao = solicitacaoService.salvar(
                    authentication.getName(),
                    solicitacao
            );

            return ResponseEntity.ok(novaSolicitacao);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<SolicitacaoAluguel>> listarTodos(
            Authentication authentication) {

        return ResponseEntity.ok(
                solicitacaoService.listarTodos(authentication.getName())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoAluguel> buscarPorId(
            @PathVariable Long id,
            Authentication authentication) {

        return solicitacaoService.buscarPorId(
                        id,
                        authentication.getName()
                )
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(
            @PathVariable Long id,
            Authentication authentication) {

        try {
            solicitacaoService.excluir(id, authentication.getName());

            return ResponseEntity.noContent().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelar(
            @PathVariable Long id,
            Authentication authentication) {

        try {
            solicitacaoService.cancelar(id, authentication.getName());

            return ResponseEntity.ok().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/avaliar")
    public ResponseEntity<?> avaliar(
            @PathVariable Long id,
            @RequestBody Map<String, String> dados,
            Authentication authentication) {

        try {
            StatusSolicitacao decisao = StatusSolicitacao.valueOf(
                    dados.get("decisao")
            );

            solicitacaoService.avaliar(
                    id,
                    authentication.getName(),
                    decisao,
                    dados.get("parecer")
            );

            return ResponseEntity.ok().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
