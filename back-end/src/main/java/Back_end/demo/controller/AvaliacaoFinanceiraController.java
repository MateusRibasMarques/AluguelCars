package Back_end.demo.controller;

import Back_end.demo.model.AvaliacaoFinanceira;
import Back_end.demo.service.AvaliacaoFinanceiraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<AvaliacaoFinanceira> cadastrar(
            @RequestBody AvaliacaoFinanceira avaliacao) {
        return ResponseEntity.ok(avaliacaoService.salvar(avaliacao));
    }

    @GetMapping
    public ResponseEntity<List<AvaliacaoFinanceira>> listarTodas() {
        return ResponseEntity.ok(avaliacaoService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvaliacaoFinanceira> buscarPorId(
            @PathVariable Long id) {
        return avaliacaoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (avaliacaoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        avaliacaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}