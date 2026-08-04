package com.food.rastreador_pedidos.order.dto;

import com.food.rastreador_pedidos.order.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String nomeCliente,
        String enderecoEntrega,
        OrderStatus status,
        List<OrderItemResponse> itens,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
}
