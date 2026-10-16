package com.raiztech.controller;

import com.raiztech.model.Mentor;
import com.raiztech.service.MentorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/mentores")
@CrossOrigin(origins = "*", allowedHeaders = "*")

public class MentorController {
    @Autowired
    private MentorService mentorService;

    // Listar todos os mentores
    @GetMapping
    public ResponseEntity<List<Mentor>> listarTodos() {
        return ResponseEntity.ok(mentorService.listarTodos());
    }

    // Buscar mentor por ID
    @GetMapping("/{id}")
    public ResponseEntity<Mentor> buscarPorId(@PathVariable Long id) {
        Optional<Mentor> mentor = mentorService.buscarPorId(id);
        return mentor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Cadastrar novo mentor
    @PostMapping
    public ResponseEntity<Mentor> criar(@RequestBody Mentor mentor) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mentorService.salvar(mentor));
    }

    // Atualizar mentor existente
    @PutMapping("/{id}")
    public ResponseEntity<Mentor> atualizar(@PathVariable Long id, @RequestBody Mentor mentor) {
        mentor.setId(id);
        return ResponseEntity.ok(mentorService.salvar(mentor));
    }

    // Deletar mentor
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (mentorService.buscarPorId(id).isPresent()) {
            mentorService.deletar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
