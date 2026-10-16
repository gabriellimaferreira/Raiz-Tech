package com.raiztech.controller;

import com.raiztech.model.Agendamento;
import com.raiztech.service.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE, RequestMethod.OPTIONS })
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    @GetMapping
    public ResponseEntity<List<Agendamento>> getAll() {
        return ResponseEntity.ok(agendamentoService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<Agendamento> criar(@RequestBody Agendamento agendamento) {
        if (agendamento.getStatus() == null || agendamento.getStatus().isEmpty()) {
            agendamento.setStatus("Pendente");
        }
        Agendamento novoAgendamento = agendamentoService.salvar(agendamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoAgendamento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Agendamento> atualizar(@PathVariable Long id, @RequestBody Agendamento agendamento) {
        agendamento.setId(id);
        Agendamento atualizado = agendamentoService.salvar(agendamento);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        agendamentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}