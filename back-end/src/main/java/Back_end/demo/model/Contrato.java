package Back_end.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Contrato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "solicitacao_id")
    private SolicitacaoAluguel solicitacao;

    private LocalDateTime dataContratacao;

    public Contrato() {
        this.dataContratacao = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SolicitacaoAluguel getSolicitacao() {
        return solicitacao;
    }

    public void setSolicitacao(SolicitacaoAluguel solicitacao) {
        this.solicitacao = solicitacao;
    }

    public LocalDateTime getDataContratacao() {
        return dataContratacao;
    }

    public void setDataContratacao(LocalDateTime dataContratacao) {
        this.dataContratacao = dataContratacao;
    }
}