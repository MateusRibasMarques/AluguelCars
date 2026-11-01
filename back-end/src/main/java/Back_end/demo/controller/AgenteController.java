package Back_end.demo.controller;

import Back_end.demo.model.Agente;
import Back_end.demo.service.AgenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agentes")
@CrossOrigin(origins = "http://localhost:5173")
public class AgenteController {

    private final AgenteService agenteService;

    public AgenteController(AgenteService agenteService) {
        this.agenteService = agenteService;
    }

    @PostMapping
    public ResponseEntity<Agente> cadastrar(@RequestBody Agente agente) {
        return ResponseEntity.ok(agenteService.salvar(agente));
    }

    @GetMapping
    public ResponseEntity<List<Agente>> listarTodos() {
        return ResponseEntity.ok(agenteService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agente> buscarPorId(@PathVariable Long id) {
        return agenteService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Agente> atualizar(
            @PathVariable Long id,
            @RequestBody Agente agente) {

        return agenteService.buscarPorId(id)
                .map(agenteExistente -> {
                    agente.setId(id);
                    return ResponseEntity.ok(agenteService.salvar(agente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (agenteService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        agenteService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}