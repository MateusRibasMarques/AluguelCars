package Back_end.demo.repository;

import Back_end.demo.model.AvaliacaoFinanceira;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvaliacaoFinanceiraRepository
        extends JpaRepository<AvaliacaoFinanceira, Long> {

}