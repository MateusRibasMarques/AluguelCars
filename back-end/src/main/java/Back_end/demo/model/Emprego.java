package Back_end.demo.model;

import jakarta.persistence.*;

@Entity
public class Emprego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String empregador;

    private Double rendimento;

    public Emprego() {
    }

    public Emprego(String empregador, Double rendimento) {
        this.empregador = empregador;
        this.rendimento = rendimento;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmpregador() {
        return empregador;
    }

    public void setEmpregador(String empregador) {
        this.empregador = empregador;
    }

    public Double getRendimento() {
        return rendimento;
    }

    public void setRendimento(Double rendimento) {
        this.rendimento = rendimento;
    }
}