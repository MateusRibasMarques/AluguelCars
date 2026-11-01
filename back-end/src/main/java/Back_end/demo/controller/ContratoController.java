package Back_end.demo.controller;

import Back_end.demo.model.Contrato;
import Back_end.demo.service.ContratoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contratos")
@CrossOrigin(origins = "http://localhost:5173")
public class ContratoController {

    private final ContratoService contratoService;

    public ContratoController(ContratoService contratoService) {
        this.contratoService = contratoService;
    }

    @PostMapping
    public ResponseEntity<Contrato> cadastrar(@RequestBody Contrato contrato) {
        return ResponseEntity.ok(contratoService.salvar(contrato));
    }

    @GetMapping
    public ResponseEntity<List<Contrato>> listarTodos() {
        return ResponseEntity.ok(contratoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contrato> buscarPorId(@PathVariable Long id) {
        return contratoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (contratoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        contratoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}