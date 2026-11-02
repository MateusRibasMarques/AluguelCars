
package Back_end.demo.repository;

import Back_end.demo.model.Contrato;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContratoRepository extends JpaRepository<Contrato, Long> {

    boolean existsBySolicitacaoId(Long solicitacaoId);
}
