package com.raiztech.service;

import com.raiztech.model.Mentor;
import com.raiztech.repository.MentorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MentorService {
    @Autowired
    private MentorRepository mentorRepository;

    // Listar todos os mentores voluntários
    public List<Mentor> listarTodos() {
        return mentorRepository.findAll();
    }

    // Buscar mentor por ID
    public Optional<Mentor> buscarPorId(Long id) {
        return mentorRepository.findById(id);
    }

    // Cadastrar ou Atualizar mentor
    public Mentor salvar(Mentor mentor) {
        return mentorRepository.save(mentor);
    }

    // Deletar mentor por ID
    public void deletar(Long id) {
        mentorRepository.deleteById(id);
    }
}
