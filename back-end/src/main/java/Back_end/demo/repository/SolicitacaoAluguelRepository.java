
package Back_end.demo.repository;

import Back_end.demo.model.SolicitacaoAluguel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolicitacaoAluguelRepository
        extends JpaRepository<SolicitacaoAluguel, Long> {

    List<SolicitacaoAluguel> findByClienteId(Long clienteId);
}
