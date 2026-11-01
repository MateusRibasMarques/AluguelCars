package Back_end.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class AvaliacaoFinanceira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "solicitacao_id")
    private SolicitacaoAluguel solicitacao;

    @ManyToOne
    @JoinColumn(name = "agente_id")
    private Agente agente;

    @Enumerated(EnumType.STRING)
    private Parecer parecer;

    private String observacao;

    private LocalDateTime dataAvaliacao;

    public AvaliacaoFinanceira() {
        this.dataAvaliacao = LocalDateTime.now();
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

    public Agente getAgente() {
        return agente;
    }

    public void setAgente(Agente agente) {
        this.agente = agente;
    }

    public Parecer getParecer() {
        return parecer;
    }

    public void setParecer(Parecer parecer) {
        this.parecer = parecer;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public LocalDateTime getDataAvaliacao() {
        return dataAvaliacao;
    }

    public void setDataAvaliacao(LocalDateTime dataAvaliacao) {
        this.dataAvaliacao = dataAvaliacao;
    }
}