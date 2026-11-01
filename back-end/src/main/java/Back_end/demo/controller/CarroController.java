package Back_end.demo.controller;

import Back_end.demo.model.Carro;
import Back_end.demo.service.CarroService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carros")
@CrossOrigin(origins = "http://localhost:5173")
public class CarroController {

    private final CarroService carroService;

    public CarroController(CarroService carroService) {
        this.carroService = carroService;
    }

    @PostMapping
    public ResponseEntity<Carro> cadastrar(@RequestBody Carro carro) {
        Carro novoCarro = carroService.salvar(carro);
        return ResponseEntity.ok(novoCarro);
    }

    @GetMapping
    public ResponseEntity<List<Carro>> listarTodos() {
        return ResponseEntity.ok(carroService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carro> buscarPorId(@PathVariable Long id) {
        return carroService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Carro> atualizar(
            @PathVariable Long id,
            @RequestBody Carro carro) {

        return carroService.buscarPorId(id)
                .map(carroExistente -> {
                    carro.setId(id);
                    return ResponseEntity.ok(carroService.salvar(carro));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (carroService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        carroService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}