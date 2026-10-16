package com.raiztech.service;

import com.raiztech.model.Recurso;
import com.raiztech.repository.RecursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RecursoService {
    @Autowired
    private RecursoRepository recursoRepository;

    // Listar todos os recursos/oportunidades
    public List<Recurso> listarTodos() {
        return recursoRepository.findAll();
    }

    // Buscar recurso por ID
    public Optional<Recurso> buscarPorId(Long id) {
        return recursoRepository.findById(id);
    }

    // Cadastrar ou Atualizar recurso
    public Recurso salvar(Recurso recurso) {
        return recursoRepository.save(recurso);
    }

    // Deletar recurso por ID
    public void deletar(Long id) {
        recursoRepository.deleteById(id);
    }
}
