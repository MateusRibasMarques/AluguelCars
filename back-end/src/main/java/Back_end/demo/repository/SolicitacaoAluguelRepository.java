package Back_end.demo.repository;

import Back_end.demo.model.SolicitacaoAluguel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitacaoAluguelRepository extends JpaRepository<SolicitacaoAluguel, Long> {

}