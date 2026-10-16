package com.raiztech.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String senha;
    private String bio;
    private String bairro;

    // Relacionamento 1 para N: Um utilizador pode ter vários agendamentos
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("usuario")
    private List<Agendamento> agendamentos = new ArrayList<>();

    // Relacionamento N para N: Um utilizador pode salvar/inscrever-se em vários
    // recursos
    @ManyToMany
    @JoinTable(name = "tb_usuario_recursos", joinColumns = @JoinColumn(name = "usuario_id"), inverseJoinColumns = @JoinColumn(name = "recurso_id"))
    @JsonIgnoreProperties("usuarios")
    private List<Recurso> recursosSalvos = new ArrayList<>();

    public Usuario() {
    }

    public Usuario(String nome, String email, String senha, String bio, String bairro) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.bio = bio;
        this.bairro = bairro;
    }

    // Getters e Setters
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    @JsonIgnore
    public List<Agendamento> getAgendamentos() {
        return agendamentos;
    }

    public void setAgendamentos(List<Agendamento> agendamentos) {
        this.agendamentos = agendamentos;
    }

    public List<Recurso> getRecursosSalvos() {
        return recursosSalvos;
    }

    public void setRecursosSalvos(List<Recurso> recursosSalvos) {
        this.recursosSalvos = recursosSalvos;
    }
}