package com.retread.entity;

public enum TireStatus {
    COLLECTED,      // Coletado no cliente
    RECEIVED,       // Recebido na fábrica
    INSPECTION,     // Em exame inicial
    PRODUCTION,     // Em processo de recauchutagem
    READY,          // Finalizado / Estoque de Prontos
    DELIVERED,      // Entregue ao cliente
    REJECTED        // Recusado (sucata)
}
