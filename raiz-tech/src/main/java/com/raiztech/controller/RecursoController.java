package com.raiztech.controller;

import com.raiztech.model.Recurso;
import com.raiztech.service.RecursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recursos")
@CrossOrigin(origins = "*", allowedHeaders = "*")

public class RecursoController {
    @Autowired
    private RecursoService recursoService;

    // Listar todos os recursos
    @GetMapping
    public ResponseEntity<List<Recurso>> listarTodos() {
        return ResponseEntity.ok(recursoService.listarTodos());
    }

    // Buscar recurso por ID
    @GetMapping("/{id}")
    public ResponseEntity<Recurso> buscarPorId(@PathVariable Long id) {
        Optional<Recurso> recurso = recursoService.buscarPorId(id);
        return recurso.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Cadastrar novo recurso/oportunidade
    @PostMapping
    public ResponseEntity<Recurso> criar(@RequestBody Recurso recurso) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recursoService.salvar(recurso));
    }

    // Atualizar recurso existente
    @PutMapping("/{id}")
    public ResponseEntity<Recurso> atualizar(@PathVariable Long id, @RequestBody Recurso recurso) {
        recurso.setId(id);
        return ResponseEntity.ok(recursoService.salvar(recurso));
    }

    // Deletar recurso
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (recursoService.buscarPorId(id).isPresent()) {
            recursoService.deletar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
