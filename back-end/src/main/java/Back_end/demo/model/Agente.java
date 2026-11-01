package Back_end.demo.model;

import jakarta.persistence.*;

@Entity
public class Agente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Enumerated(EnumType.STRING)
    private TipoAgente tipo;

    public Agente() {
    }

    public Agente(String nome, TipoAgente tipo) {
        this.nome = nome;
        this.tipo = tipo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public TipoAgente getTipo() {
        return tipo;
    }

    public void setTipo(TipoAgente tipo) {
        this.tipo = tipo;
    }
}