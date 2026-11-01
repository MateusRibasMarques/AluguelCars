package Back_end.demo.controller;

import Back_end.demo.model.SolicitacaoAluguel;
import Back_end.demo.service.SolicitacaoAluguelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin(origins = "http://localhost:5173")
public class SolicitacaoAluguelController {

    private final SolicitacaoAluguelService solicitacaoService;

    public SolicitacaoAluguelController(SolicitacaoAluguelService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping
    public ResponseEntity<SolicitacaoAluguel> cadastrar(
            @RequestBody SolicitacaoAluguel solicitacao) {

        return ResponseEntity.ok(solicitacaoService.salvar(solicitacao));
    }

    @GetMapping
    public ResponseEntity<List<SolicitacaoAluguel>> listarTodos() {
        return ResponseEntity.ok(solicitacaoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoAluguel> buscarPorId(@PathVariable Long id) {
        return solicitacaoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (solicitacaoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        solicitacaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}